#= require_tree ./templates
#= require_self
#= require ./form_renderer_extensions
#= require ./data_mappings
#= require ./field_types
#= require ./validators
#= require ./helpers
#= require ./status_indicator_controller

window.Formbuilder = Backbone.View.extend
  events:
    'click .js-add-field': -> @removeLeftPane()

    # Lock/unlock scroll position when adding/editing a field, otherwise short
    # viewports won't be able to add fields from the bottom of the list:
    # http://take.ms/tXHaW
    'mouseover .fb_left': 'lockLeftWrapper'
    'mouseout .fb_left': 'unlockLeftWrapper'
    'click .fb_add_field_wrapper button': '_addFieldViaClick'
    'click .fb_right': '_deselectField'

  defaults:
    selector: '[data-formbuilder]'

  initialize: (options) ->
    @options = $.extend({}, @defaults, options)
    @state = new Backbone.Model
    @project = new Backbone.Model(@options.project)
    @project.bind 'change', => @_onChange()
    new Formbuilder.StatusIndicatorController(fb: @)

    # Set element, store instance in data
    @setElement $(@options.selector)
    @$el.data('formbuilder-instance', @)

    # We use this for explicitly deleting fields
    @fieldsForDeletion = []
    @changedModels = []

    # Create the collection, and bind the appropriate events
    @collection = new Formbuilder.Collection(null, parentView: @)
    @collection.bind 'add', @_onCollectionAdd, @

    # When a model is destroyed, push its id onto the fieldsForDeletion
    # array so that we can tell the server to destroy it too.
    @listenTo @collection, 'destroy', (model) ->
      @fieldsForDeletion.push(model.get('id')) if model.get('id')
      @recreateEditView()
      @_onChange()

    @render()

    # Populate collection with bootstrapData
    for rf in @options.bootstrapData
      model = Formbuilder.buildModel(rf)
      @collection.add model, sort: false
      @collection.validateField(model)

    @collection.bind 'change add', @_onChange, @
    @collection.bind 'add destroy', @_toggleBlankSlate, @
    @collection.bind 'add destroy', @_modelsWerePositioned, @
    @_toggleBlankSlate()
    @_modelsWerePositioned()

    @autosaver = new Autosaver
      fn: (done) =>
        return done() unless @isFbValid()

        initFieldsForDeletion = _.clone(@fieldsForDeletion)

        formData =
          save_fields: @saveFieldsJSON()
          delete_fields: initFieldsForDeletion

        if @sortNeedsSaving
          @sortNeedsSaving = false
          formData.sort_order = _.map(
            _.sortBy(@collection.models, 'sortPos'), (m) ->
              m.id || m.cid
          )

        $.ajax
          url: @options.endpoint
          type: 'put'
          data:
            form: formData
            project: JSON.stringify(@project.toJSON())
            last_updated: @options.last_updated
          complete: ->
            done()
          error: (xhr) =>
            @state.set(hasServerErrors: true)
            @trigger('refreshStatus')

            conflict = xhr.status == 409

            Dvl.Flash(
              'error',
              xhr.responseJSON?.error || t('flash.error.generic')
            )

            if conflict
              @saveDisabled = true
              @autosaver.clear()
              BeforeUnload.disable()

          success: (data) =>
            @options.last_updated = data.last_updated

            @state.set(hasServerErrors: false)
            @trigger('refreshStatus')

            @fieldsForDeletion = _.difference(
              @fieldsForDeletion,
              initFieldsForDeletion
            )

            # set the IDs of new response fields, returned from the server
            @ignoringChanges =>
              for cid, id of data.created_field_ids
                @collection.get(cid)?.set(id: id)

    @initDraggableFields()
    @initBeforeUnload()
    @initLeftScroll()

  render: ->
    @$el.html JST['form_builder/templates/page'](view: @)
    @idView = new Formbuilder.RenderedIdentificationFieldView(parentView: @)
    @$el.find('.fb_right').prepend(@idView.render().$el)

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.fb_left')
    @$leftAddWrapper = @$el.find('.fb_add_field_wrapper')
    @$leftPaneWrapper = @$el.find('.fb_left_pane_wrapper')
    @$responseFields = @$el.find('.fb_response_fields')
    @$blankSlate = @$el.find('.fb_blank_slate')

    @$el.initialize()
    return @

  ## Initialization logic

  initLeftScroll: ->
    scrollHandler = _.debounce =>
      # Don't run the scroll handler while the entire page is scrolling
      return if @scrollingPage

      oldMargin = parseFloat(@$fbLeft.css('margin-top'))
      desiredMargin = $(window).scrollTop() - @$el.offset().top + 60
      maxMargin = @$responseFields.height()
      newMargin = Math.max(0, Math.min(maxMargin, desiredMargin))
      difference = Math.abs(oldMargin - newMargin)
      transitionLength = Math.min(
        difference * 1.5, # 1.5ms per pixel
        250 # maximum transition length
      )

      @$fbLeft.animate { 'margin-top': newMargin }, transitionLength
    , 100

    $(window).on 'scroll', =>
      scrollHandler() unless @leftWrapperLocked

  initBeforeUnload: ->
    BeforeUnload.enable
      if: => @autosaver.isPending() || !@isFbValid()
      cb: (url) =>
        return false unless @isFbValid()
        @autosaver.ensure -> Turbolinks.visit url

  initDraggableFields: ->
    drake = dragula(
      @$responseFields.add($('.fb_add_field_section')).get(),
      copy: (el, source) ->
        $(source).closest('.fb_add_field_section')[0]
      accepts: (el, target) ->
        $(target).closest('.fb_response_fields')[0]
      # Don't drag the blank slate
      invalid: (el) -> $(el).closest('.fb_blank_slate')[0]
      # Mirror elements must be inside same container
      mirrorContainer: @$responseFields[0]
    )

    drake.on 'drag', => @$responseFields.addClass 'is_drop_target'
    drake.on 'dragend', => @$responseFields.removeClass 'is_drop_target'
    drake.on 'drop', (el, target, source, sibling) =>
      # Adding from left side
      if $(source).hasClass('fb_add_field_section') && target
        @addField $(el).data('field-type'), $replaceEl: $(el)
        @_onChange()

      # Sorting right side
      else if $(source).hasClass('fb_response_fields')
        @sortUpdated($(el))

  sortUpdated: ($el) ->
    @_onChange()
    @_modelsWerePositioned()
    model = @collection.get($el.data('cid'))
    @showEditPane(model)

  ## Scroll logic

  lockLeftWrapper: ->
    @leftWrapperLocked = true

  unlockLeftWrapper: ->
    @leftWrapperLocked = false

  recreateEditView: ->
    if @editView
      model = @editView.model
      @removeLeftPane()
      @showEditPane(model)

  scrollToField: (model) ->
    if ($responseFieldEl = @modelEl(model))[0]
      @scrollToRightSideEl($responseFieldEl)

  scrollToRightSideEl: ($rightSideEl) ->
    @scrollingPage = true
    scrollPos = @$el.offset().top +
                $rightSideEl.offset().top -
                @$responseFields.offset().top

    $.scrollWindowTo scrollPos, 200, =>
      @scrollingPage = false

  ## Utility

  allFields: ->
    @$el.find('.fb_field_wrapper')

  modelEl: (model) ->
    @allFields().filter (_, el) ->
      $(el).data('cid') == model.cid

  modelDOMIndex: (model) ->
    @allFields().index @modelEl(model)

  ## Adding fields and things....

  _onCollectionAdd: (rf, _, options) ->
    # Always show the "other" field
    rf.attributes.showOther = true

    @modelViews ||= {}
    @modelViews[rf.cid] = view = new Formbuilder.RenderedFieldView
      model: rf
      parentView: @

    # Are we replacing a temporarily drag placeholder?
    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)

    # Are we adding below an existing field?
    else if options.position? &&
            ($replacePosition = @allFields().eq(options.position))[0]
      $replacePosition.before view.render().el

    else
      @$responseFields.append view.render().el

  _addFieldViaClick: (e) ->
    position = if ($editing = @$el.find(".fb_field_wrapper.editing"))[0]
                 @$el.find('.fb_field_wrapper').index($editing) + 1

    @addField(
      $(e.currentTarget).data('field-type'),
      position: position
    )

  _toggleBlankSlate: ->
    toggleMethod = if @collection.length then 'hide' else 'show'
    classMethod = if @collection.length then 'removeClass' else 'addClass'
    @$blankSlate[toggleMethod]()
    @$responseFields[classMethod]('is_blank_slate')

  _modelsWerePositioned: ->
    @sortNeedsSaving = true

    @collection.each (m) =>
      idx = @modelDOMIndex(m)
      m.sortPos = idx
      @modelViews[m.cid].wasPositioned()

  # Adds a new response field.
  # @param attrs [String or Object] Either a string representing the field type,
  # or a hash of attributes.
  addField: (attrs, options) ->
    analytics.track 'response field added'

    if typeof attrs == 'string'
      attrs = Formbuilder.defaultFieldAttrs(attrs)

    model = Formbuilder.buildModel(attrs)
    model.justCreated = true
    @collection.add model, _.extend(options || {}, sort: false)
    @collection.validateField(model)
    @showEditPane(model)

  ## Edit pane

  removeLeftPane: ->
    @leftPaneView?.remove()
    @leftPaneView = undefined
    @$leftAddWrapper.show()
    @$leftPaneWrapper.hide()

  showLeftPane: (view) ->
    @unlockLeftWrapper()
    @removeLeftPane()
    @leftPaneView = view
    @$el.find('.fb_edit_field_inner').html view.render().$el
    @$leftPaneWrapper.show()
    @$leftAddWrapper.hide()
    view.shown?()

  showEditPane: (model) ->
    @showLeftPane(
      new Formbuilder.EditFieldView
        model: model
        parentView: @
    )

  setActiveRightSideEl: ($newEl) ->
    @$el.find('.fb_field_wrapper.editing').removeClass('editing')
    $newEl?.addClass('editing')

  _deselectField: (e) ->
    # Only trigger on direct clicks, not clicks on children
    if $(e.target).hasClass('fb_right') ||
       $(e.target).hasClass('fb_response_fields')
      @removeLeftPane()
      @setActiveRightSideEl()

  ## Save logic

  isFbValid: ->
    @collection.all (m) ->
      m.isFbValid

  calculateValidation: ->
    @state.set('hasValidationErrors', !@isFbValid())
    @trigger('refreshStatus')

  ignoringChanges: (fn) ->
    @ignoreChanges = true
    fn()
    @ignoreChanges = false

  _onChange: (model) ->
    unless @ignoreChanges
      if model
        @changedModels.push model

      @autosaver.saveLater()
      @trigger('refreshStatus')

  attributesForSave:
    [
      'id', 'key', 'blind', 'label', 'field_options', 'required',
      'admin_only', 'cid', 'field_type'
    ]

  saveFieldsJSON: ->
    filteredFields = @collection.filter (m) =>
      m in @changedModels

    # Reset changed models
    @changedModels = []

    JSON.stringify(
      _.map filteredFields, (m) =>
        _.clone(_.pick(m.attributes, @attributesForSave...))
    )

Formbuilder.Collection = Backbone.Collection.extend
  initialize: (_, options) ->
    { @parentView } = options
    @on 'add', @copyCidToModel
    @on 'remove', @removeConditionals
    @on 'remove change:isFbValid', => @parentView.calculateValidation()

    @on 'change', (model) =>
      # If the model is valid, validate silently. If there are already
      # errors, we want to clear them ASAP.
      @validateField(model, undefined, model.isFbValid)

    # Otherwise, be careful about _when_ we validate
    @on 'change:field_options.columns change:field_options.columns.*', (model) =>
      @validateField(model, 'duplicateColumns')

  validateField: (model, useValidator, silent) ->
    errs = $.extend {}, model.get('errors')

    # If useValidator is passed, only use that specific validator
    if useValidator
      errs[useValidator] = Formbuilder.Validators[useValidator](model)
    else
      for k, validator of Formbuilder.Validators
        errs[k] = validator(model)

    model.validationErrors = errs

    unless silent
      model.set 'errors', errs

    model.isFbValid = !_.any( _.values(errs), ((v) -> v) )

    unless silent
      model.set 'isFbValid', model.isFbValid

  copyCidToModel: (model) ->
    model.attributes.cid = model.cid

  input_fields: ->
    @models.filter (m) -> m.input_field

  removeConditionals: (removing) ->
    @models.forEach (m) =>
      if (oldConditions = m.get(Formbuilder.mappings.CONDITIONS))
        newConditions = _.reject oldConditions, (condition) ->
          "#{condition.response_field_id}" == "#{removing.id}"

        if !_.isEqual(oldConditions, newConditions)
          m.set Formbuilder.mappings.CONDITIONS, newConditions

          # Re-render edit view in case the affected field is being edited
          @parentView.editView?.render()

Formbuilder.RenderedFieldView = Backbone.View.extend
  className: "fb_field_wrapper"

  events:
    'click .cover': 'focusEditView'
    'click [data-duplicate]': 'duplicate'
    'click [data-hard-remove]': 'hardRemove'
    'click [data-soft-remove]': 'softRemove'
    'click [data-sort-up]': 'sortUp'
    'click [data-sort-down]': 'sortDown'
    'click [data-toggle="dropdown"]': 'setEditing'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, 'change', @render
    @listenTo @model, 'destroy', @remove

  wasPositioned: ->
    return unless @model.sortPos?

    methods = {
      up: if @model.sortPos == 1 then 'add' else 'remove'
      down: if @model.sortPos == @parentView.collection.length then 'add' else 'remove'
    }

    for k, v of methods
      @$el.find("[data-sort-#{k}]")["#{v}Class"]('disabled')

  render: ->
    @model.setExistingValue?(null)

    @$el.data('cid', @model.cid).html JST["form_builder/templates/view/base"](
      hasResponses: @parentView.options.hasResponses,
      model: @model
    )

    if !@rendererView
      if @model.field_type == 'page_break'
        @rendererView = new Formbuilder.PageBreakView
      else
        fieldTypeClass = Formbuilder.classify(@model.field_type)
        @rendererView = new FormRenderer.Views[fieldTypeClass](
          model: @model
          showLabels: true
        )

    @toggleErrorClass()
    @$el.append @rendererView.render().el
    Formbuilder.disableTabbing(@$el.find('.fr_response_field'))
    @$el.initialize()
    @rendererView.trigger('shown')
    @wasPositioned()
    return @

  toggleErrorClass: ->
    if @model.get('isFbValid') == false
      @$el.addClass('has_errors')
    else
      @$el.removeClass('has_errors')

  focusEditView: ->
    @parentView.showEditPane(@model)

  clearConfirmMsg: ->
    if @model.input_field
      "Are you sure you want to delete this field? " +
      "You'll also lose access to any submitted answers to this field."

  setEditing: ->
    unless @$el.hasClass('editing')
      @parentView.showEditPane(@model)

  hardRemove: ->
    if @parentView.options.hasResponses && !@model.justCreated
      new Dvl.Confirmations.Modal $(), @clearConfirmMsg(), $.proxy(@clear, @)
    else
      @clear()

  softRemove: ->
    @model.set Formbuilder.mappings.ADMIN_ONLY, true
    @model.set Formbuilder.mappings.REQUIRED, false
    @$el.appendTo(@$el.closest('.fb_response_fields'))
    @parentView._onChange()
    @parentView.recreateEditView()

  sortUp: ->
    if ($prev = @$el.prev('.fb_field_wrapper'))[0]
      @$el.insertBefore($prev)
      @parentView.sortUpdated(@$el)

  sortDown: ->
    if ($next = @$el.next('.fb_field_wrapper'))[0]
      @$el.insertAfter($next)
      @parentView.sortUpdated(@$el)

  clear: ->
    @model.destroy()

  duplicate: ->
    attrs = _.deepClone(@model.attributes)
    delete attrs['id']

    # Append " (1)" to differentiate the new field. If the field was already
    # copied, increment the number.
    if (matches = attrs.label.match(/\(([0-9]+)\)$/))
      attrs.label = attrs.label.replace(
        "(#{matches[1]})",
        "(#{parseInt(matches[1], 10) + 1})"
      )
    else
      attrs.label += ' (1)'

    newModel = @parentView.addField(
      attrs,
      position: @parentView.modelDOMIndex(@model) + 1
    )

Formbuilder.EditFieldView = Backbone.View.extend
  className: "fb_edit_inner"

  events:
    'click .js-add-option': 'addOption'
    'click .js-remove-option': 'removeOption'
    'change .js-change-field-type': 'changeFieldType'
    'click [data-show-modal]': 'showModal'
    'blur [data-rv-input="model.field_options.minlength"]': 'auditMinLength'
    'blur [data-rv-input="model.field_options.maxlength"]': 'auditMaxLength'
    'blur [data-rv-input="model.field_options.min"]': 'auditMin'
    'blur [data-rv-input="model.field_options.max"]': 'auditMax'
    'blur [data-rv-input="model.field_options.minrows"]': 'auditMinRows'
    'blur [data-rv-input="model.field_options.maxrows"]': 'auditMaxRows'
    'blur [data-rv-input^="model.field_options.options."]': 'validateField'
    'blur [data-rv-input^="model.field_options.columns."]': 'validateField'
    'change [data-rv-value="model.field_options.min_max_length_units"]': 'setSizeToRecommendedSize'
    'click .js-add-condition': 'addCondition'
    'click .js-remove-condition': 'removeCondition'
    'click .js-set-checked': 'setChecked'

  initialize: (options) ->
    {@parentView} = options

    @listenTo @model, 'destroy', ->
      @parentView.removeLeftPane()

    # 1. When condition field changed, reset method & value
    # 2. When condition method changed, reset value
    @listenTo @model, 'change:field_options.conditions.*', (m) =>
      for i in [0..(@model.getConditions().length - 1)]
        newVal = @conditionValueOptions(i)?[0]

        if m.hasChanged("field_options.conditions.#{i}.response_field_id")
          @setCondition(i, method: @conditionMethodsAtIndex(i)[0].key, value: newVal)
        else if m.hasChanged("field_options.conditions.#{i}.method")
          @setCondition(i, value: newVal)

    @listenTo @model, 'change:field_options.columns.*', (m) =>
      for k, v of m.changedAttributes()
        if k.match(/\.label$/) # sanity check?
          @movePresetValues(m.previous(k), v)

  movePresetValues: (oldColumnName, newColumnName) ->
    return unless oldColumnName && newColumnName

    if @model.get(Formbuilder.mappings.PRESET_VALUES)?[oldColumnName]
      values = @model.get(Formbuilder.mappings.PRESET_VALUES)
      values[newColumnName] = values[oldColumnName]
      delete values[oldColumnName]
      @model.set(Formbuilder.mappings.PRESET_VALUES, values)

  shown: ->
    @parentView.setActiveRightSideEl(@parentView.modelEl(@model))
    @parentView.scrollToField(@model)
    @$el.find(
      '[data-rv-input="model.label"], ' +
      '[data-rv-input="model.field_options.description"]'
    ).first().focus()

  render: ->
    templateName = if @model.input_field then 'base' else 'base_non_input'
    @$el.html JST["form_builder/templates/edit/#{templateName}"](@)
    rivets.bind @$el, model: @model
    @$el.initialize()

    if Formbuilder.hasColumnsOrOptions(@model)
      dragula(
        @$el.find('.fb_options').get(),
        moves: (_, __, h) -> $(h).closest('.fa-reorder')[0]
      ).on 'drop', $.proxy(@_optionsSorted, @)

    return @

  _optionsSorted: ->
    newOrder = @$el.find('.fb_options [data-index]').map ->
      $(@).data('index')
    .get()

    Formbuilder.orderOptions(@model, newOrder)
    @render()

  addOption: (e) ->
    Formbuilder.addOptionOrColumn(@model)
    @render()

  removeOption: (e) ->
    i = @$el.find(".js-remove-option").index($(e.currentTarget))
    Formbuilder.removeOptionOrColumn(@model, i)
    @render()

  showModal: (e) ->
    modal = new Formbuilder["#{$(e.currentTarget).data('show-modal')}ModalView"]
      model: @model
      parentView: @

    $el = modal.render().$el

    $el.
      appendTo('body').
      modal('show')

    modal.shown?()

  changeFieldType: (e) ->
    newFieldType = $(e.currentTarget).val()
    newAttrs = Formbuilder.defaultFieldAttrs(newFieldType)

    # Clone everything *except* field_type and field_options
    _.extend(
      newAttrs,
      _.omit(@model.attributes, 'field_type', 'field_options')
    )

    # Clone field_options
    newAttrs.field_options = _.extend(
      {},
      newAttrs.field_options,
      @model.attributes.field_options
    )

    # If new field is a dropdown, ensure that only one option is selected.
    # See https://github.com/dobtco/screendoor-v2/issues/2420
    if newFieldType == 'dropdown' && newAttrs.field_options.options
      foundChecked = false
      for opt in newAttrs.field_options.options
        if opt.checked
          if foundChecked
            opt.checked = false
          else
            foundChecked = true

    delete newAttrs.value

    newIdx = @parentView.modelDOMIndex(@model)

    # Remove ID and "destroy"
    @model.set 'id', null
    @model.destroy()

    @parentView.addField(
      newAttrs,
      position: newIdx
    )

  isChecked: (i) ->
    @model.getOptions()[i].checked

  setChecked: (e) ->
    idx = $(e.currentTarget).closest('[data-index]').data('index')
    newVal = if @isChecked(idx) then false else true
    newOpts = $.extend(true, [], @model.getOptions()) # deep clone

    # Multiple can be checked
    if @model.field_type == 'checkboxes'
      newOpts[idx].checked = newVal
    else
      _.each newOpts, (o, i) ->
        o.checked = if i == idx then newVal else false

    @model.set Formbuilder.columnOrOptionKeypath(@model), newOpts.slice(0)
    @render()

  validateField: ->
    @parentView.collection.validateField(@model)

  auditMinLength: ->
    @normalizePositiveInteger(Formbuilder.mappings.MINLENGTH)
    @setSizeToRecommendedSize()
    @validateField()

  auditMaxLength: ->
    @normalizePositiveInteger(Formbuilder.mappings.MAXLENGTH)
    @validateField()

  auditMin: ->
    @normalizeFloat(Formbuilder.mappings.MIN)
    @validateField()

  auditMax: ->
    @normalizeFloat(Formbuilder.mappings.MAX)
    @validateField()

  auditMinRows: ->
    @normalizePositiveInteger(Formbuilder.mappings.MINROWS)
    @validateField()

  auditMaxRows: ->
    @normalizePositiveInteger(Formbuilder.mappings.MAXROWS)
    @validateField()

  normalizePositiveInteger: (map) ->
    val = @model.get(map)
    parsed = parseInt(val, 10)

    if _.isNaN(parsed) || parsed < 1
      @model.unset map
    else
      @model.set map, "#{parsed}"

  normalizeFloat: (map) ->
    val = @model.get(map)
    parsed = parseFloat(val)

    if _.isNaN(parsed)
      @model.unset map
    else
      @model.set map, "#{parsed}"

  setSizeToRecommendedSize: ->
    if (rec = @recommendedParagraphSize())
      @model.set Formbuilder.mappings.SIZE, rec
      @render()

  recommendedParagraphSize: ->
    parsed = parseInt(@model.get(Formbuilder.mappings.MINLENGTH))
    words = @model.get(Formbuilder.mappings.LENGTH_UNITS) == 'words'

    if (words && parsed > 60) || (!words && parsed > 1000)
      'large'
    else if (words && parsed > 30) || (!words && parsed > 350)
      'medium'

  ## Conditions

  blankCondition: ->
    rf = @conditionFieldOptions()[0]

    {
      action: 'show'
      response_field_id: rf.id,
      method: _.first(Formbuilder.conditionsByType(rf.field_type)).key
      value: Formbuilder.optionsForResponseField(rf)?[0]
    }

  addCondition: ->
    conditions = @model.getConditions().slice(0)
    conditions.push(@blankCondition())
    @model.set Formbuilder.mappings.CONDITIONS, conditions
    @render()

  removeCondition: (e) ->
    i = $(e.currentTarget).data('index')
    conditions = @model.getConditions().slice(0)
    conditions.splice i, 1
    @model.set Formbuilder.mappings.CONDITIONS, conditions
    @render()

  conditionField: (i) ->
    if (id = Formbuilder.getConditionAt(@model, i).response_field_id)
      # Can't use .get on newly-created models
      @parentView.collection.find (m) -> "#{m.id}" == "#{id}"

  conditionMethod: (i) ->
    Formbuilder.getConditionAt(@model, i).method

  conditionFieldOptions: ->
    # Only allow setting conditions on fields that come *before*
    # this one.
    @parentView.collection.filter (field) =>
      field.input_field &&
      Formbuilder.conditionsByType(field.field_type).length &&
      field.sortPos < @model.sortPos

  conditionMethodsAtIndex: (i) ->
    if (field_type = @conditionField(i)?.field_type)
      Formbuilder.conditionsByType(field_type)
    else
      []

  conditionValueOptions: (i) ->
    Formbuilder.optionsForResponseField(@conditionField(i))

  canAddConditions: ->
    @conditionFieldOptions().length > 0

  setCondition: (i, attrs) ->
    conditions = @model.getConditions().slice(0)
    _.extend conditions[i], attrs
    @model.set Formbuilder.mappings.CONDITIONS, conditions, silent: true
    @render()

Formbuilder.BaseModalView = Backbone.View.extend
  className: 'modal'

  events:
    'click button': ->
      @save()
      @hideAndRemove()
    'hidden.bs.modal': 'remove'

  initialize: (options) ->
    { @parentView } = options

  hideAndRemove: ->
    @$el.modal('hide')
    @remove()

Formbuilder.PresetValuesModalView = Formbuilder.BaseModalView.extend
  render: ->
    @$el.html(JST["form_builder/templates/edit/preset_values_modal"](rf: @model))
    @$el.initialize()
    return @

  save: ->
    @model.set Formbuilder.mappings.PRESET_VALUES, @getValues()

  getValues: ->
    _.tap {}, (h) =>
      for k, column of @model.getColumns()
        h[column.label] = @$el.find("[data-col=#{k}]").map( -> $(@).val() ).get()

Formbuilder.DefaultLocationModalView = Formbuilder.BaseModalView.extend
  render: ->
    @$el.html(JST["form_builder/templates/edit/default_location_modal"](rf: @model))
    @initMap()
    @$el.initialize()
    return @

  # map.js is already required, since we've already rendered the field
  initMap: ->
    @$mapEl = @$el.find('.fb_default_location_modal_map')

    @map = L.mapbox.map @$mapEl[0], App.MAPBOX_TILE_ID,
      center: @model.defaultLatLng() || App.DEFAULT_LAT_LNG
      zoom: 13

  save: ->
    @model.set Formbuilder.mappings.DEFAULT_LAT, @map.getCenter().lat.toFixed(7)
    @model.set Formbuilder.mappings.DEFAULT_LNG, @map.getCenter().lng.toFixed(7)

  shown: ->
    @map._onResize()

Formbuilder.BulkAddOptionsModalView = Formbuilder.BaseModalView.extend
  render: ->
    @$el.html(JST["form_builder/templates/edit/bulk_add_options_modal"]({rf: @model}))
    @$el.initialize()
    return @

  save: ->
    @addOptions()

  addOptions: ->
    val = @$el.find('textarea').val()
    return unless val

    options = _.reject @model.getOptions(), (o) -> !o.label

    for opt in val.split("\n")
      options.push(label: opt, checked: false)

    @model.set Formbuilder.mappings.OPTIONS, options
    @parentView.render()

Formbuilder.EditIdentificationFieldView = Backbone.View.extend
  initialize: (options) ->
    {@parentView} = options

  render: ->
    @$el.html JST['form_builder/templates/edit/identification'](@)
    rivets.bind @$el, project: @parentView.project
    @$el.initialize()
    return @

Formbuilder.RenderedIdentificationFieldView = Backbone.View.extend
  className: 'fb_field_wrapper fb_field_wrapper_id'

  events:
    'click .cover': 'showLeftPane'
    'click [data-restore-id-fields]': ->
      @parentView.project.set('anonymous', false)
    'click [data-remove-id-fields]': ->
      @parentView.project.set('anonymous', true)


  initialize: (options) ->
    {@parentView} = options

    @listenTo @parentView.project, 'change', @render

  render: ->
    @$el.html JST['form_builder/templates/view/identification'](@)

    if ($idWrap = @$el.find('.js-id-field-wrapper'))[0]
      idView = new FormRenderer.Views.ResponseFieldIdentification(
        model: new FormRenderer.Models.ResponseFieldIdentification
      )

      $idWrap.append(idView.render().$el)

    Formbuilder.disableTabbing(@$el.find('.fr_response_field'))
    return @

  showLeftPane: ->
    view = new Formbuilder.EditIdentificationFieldView(
      parentView: @parentView
    )

    @parentView.showLeftPane(view)
    @parentView.scrollToRightSideEl(@parentView.idView.$el)
    @parentView.setActiveRightSideEl(@$el)

Formbuilder.PageBreakView = Backbone.View.extend
  className: 'fr_response_field fr_response_field_page_break'
  render: ->
    @$el.html JST['form_builder/templates/view/page_break']()
    @
