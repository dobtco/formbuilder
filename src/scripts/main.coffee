# helpers...
classify = (field_type) ->
  "ResponseField#{_.str.classify(field_type)}"

buildModel = (attrs) ->
  new FormRenderer.Models[classify(attrs.field_type)](attrs)

optionsForResponseField = (model) ->
  if model.field_type in ['dropdown', 'checkboxes', 'radio']
    _.map model.getOptions(), (opt) ->
      opt.label

window.Formbuilder = Formbuilder = Backbone.View.extend
  events:
    'click .js-add-field': -> @setLeft('add')

    # Lock/unlock scroll position when adding/editing a field, otherwise short
    # viewports won't be able to add fields from the bottom of the list:
    # http://take.ms/tXHaW
    'mouseover .fb_left': 'lockLeftWrapper'
    'mouseout .fb_left': 'unlockLeftWrapper'
    'click .fb_add_field_wrapper a': '_addFieldViaClick'

    # Change identification level -- pretty hacky
    'click [data-change-id-level]': ->
      Turbolinks.visit(
        window.location.pathname.replace('/response_form', '/responses')
      )

  defaults:
    selector: '[data-formbuilder]'

  initialize: (options) ->
    @options = $.extend({}, @defaults, options)
    @state = new Backbone.Model
    new Formbuilder.StatusIndicatorController(fb: @)

    # Set element, store instance in data
    @setElement $(@options.selector)
    @$el.data('formbuilder-instance', @)

    # We use this for explicitly deleting fields
    @fieldsForDeletion = []

    # Create the collection, and bind the appropriate events
    @collection = new Formbuilder.Collection(null, parentView: @)
    @collection.bind 'add', @_onCollectionAdd, @

    # When a model is destroyed, push its id onto the fieldsForDeletion
    # array so that we can tell the server to destroy it too.
    @listenTo @collection, 'destroy', (model) ->
      @fieldsForDeletion.push(model.get('id')) if model.get('id')
      @ensureEditPaneScrolled()
      @_onChange()

    @render()

    # Populate collection with bootstrapData
    for rf in @options.bootstrapData
      model = buildModel(rf)
      @collection.add model, sort: false

    @collection.bind 'change add', @_onChange, @

    @autosaver = new Autosaver
      fn: (done) =>
        return done() unless @isValid()

        @collection.sort()
        initFieldsForDeletion = _.clone(@fieldsForDeletion)

        $.ajax
          url: @options.endpoint
          type: 'put'
          data: JSON.stringify(
            fields: @collection.toJSON()
            fields_marked_for_deletion: initFieldsForDeletion
            last_updated: @options.last_updated
          )
          contentType: 'application/json'
          complete: ->
            done()
          error: (xhr) =>
            @state.set(hasServerErrors: true)
            @trigger('refreshStatus')

            conflict = xhr.status == 409

            DvlFlash(
              'error',
              xhr.responseJSON?.error || t('flash.error.generic'),
              if conflict then 100000000 # Need to refactor dvl-core, lol
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
            for datum in data.response_fields
              @collection.get(datum.cid)?.set { id: datum.id }, { silent: true }

    @initSortable()
    @initDraggable()
    @initBeforeUnload()
    @initLeftScroll()

  render: ->
    @$el.html JST['formbuilder/page'](view: @)

    if @options.identificationFields
      idView = new FormRenderer.Views.ResponseFieldIdentification(
        model: new FormRenderer.Models.ResponseFieldIdentification
      )

      @$el.find('.fb_identification_cover').after(
        idView.render().$el
      )

      Formbuilder.disableTabbing(idView.$el)

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.fb_left')
    @$leftAdd = @$el.find('.fb_add_field_wrapper')
    @$leftEdit = @$el.find('.fb_edit_field_wrapper')
    @$responseFields = @$el.find('.fb_response_fields')

    # @$el.initialize()
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
      if: => @autosaver.isPending() || !@isValid()
      cb: (url) =>
        return false unless @isValid()
        @autosaver.ensure -> Turbolinks.visit url

  initSortable: ->
    new Sortable @$responseFields[0],
      group:
        name: 'responseFields'
        pull: false
        put: true
      onUpdate: (_e) =>
        @_onChange()
        @ensureEditPaneScrolled()
      onAdd: (e) =>
        @addField $(e.item).data('field-type'), { $replaceEl: $(e.item) }
        @_onChange()

  initDraggable: ->
    opts = {
      group:
        name: 'responseFields'
        pull: 'clone'
        put: false
      sort: false
    }

    $('.fb_add_field_section').each ->
      new Sortable @, opts

  ## Left pane

  setLeft: (addOrEdit) ->
    if addOrEdit == 'edit'
      @$leftEdit.show()
      @$leftAdd.hide()
    else # add
      @removeEditPane()
      @$leftAdd.show()
      @$leftEdit.hide()

  ## Scroll logic

  lockLeftWrapper: ->
    @leftWrapperLocked = true

  unlockLeftWrapper: ->
    @leftWrapperLocked = false

  ensureEditPaneScrolled: ->
    @scrollToField($(".fb_field_wrapper.editing")) if @editView

  scrollToField: ($responseFieldEl) ->
    if $responseFieldEl[0]
      @scrollingPage = true
      scrollPos = @$el.offset().top +
                  $responseFieldEl.offset().top -
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
    rf.set 'showOther', true

    view = new Formbuilder.Views.ViewField
      model: rf
      parentView: @

    # Are we replacing a temporarily drag placeholder?
    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)

    # Are we adding below an existing field?
    else if options.position? &&
            ($replacePosition = @$responseFields.
                                    find(".fb_field_wrapper").
                                    eq(options.position))[0]
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

  # Adds a new response field.
  # @param attrs [String or Object] Either a string representing the field type,
  # or a hash of attributes.
  addField: (attrs, options) ->
    if typeof attrs == 'string'
      attrs = Formbuilder.DEFAULT_FIELD_ATTRS(attrs)

    model = buildModel(attrs)
    model.typeUnlocked = true
    @collection.add model, _.extend(options || {}, sort: false)
    @collection.sort()
    @collection.validateField(model)
    @showEditPane(model)

  ## Edit pane

  removeEditPane: ->
    @editView?.remove()
    @editView = undefined

  showEditPane: (model) ->
    @unlockLeftWrapper()
    $responseFieldEl = @modelEl(model)
    $responseFieldEl.
      addClass('editing').
      siblings('.fb_field_wrapper').
      removeClass('editing')

    if @editView
      if @editView.model.cid is model.cid
        @setLeft('edit')
        @scrollToField($responseFieldEl)
        return
      else
        @editView.remove()

    @editView = new Formbuilder.Views.EditField
      model: model
      parentView: @

    @$el.find(".fb_edit_field_inner").html @editView.render().$el
    @setLeft('edit')
    @$el.find('[data-rv-input="model.label"]').focus()
    @scrollToField($responseFieldEl)
    return @

  ## Save logic

  isValid: ->
    @collection.all (m) ->
      m.isValid

  calculateValidation: ->
    @state.set('hasValidationErrors', !@isValid())
    @trigger('refreshStatus')

  _onChange: ->
    @autosaver.saveLater()
    @trigger('refreshStatus')

Formbuilder.Views = {}

# Default attributes for all fields
Formbuilder.DEFAULT_FIELD_ATTRS = (field_type) ->
  _.extend({
    label: 'Untitled',
    field_type: field_type,
    required: true,
    field_options: {}
  }, Formbuilder.FIELD_TYPES[field_type].defaultAttributes?() || {})

# Default options for checkbox/radio/dropdown fields
Formbuilder.DEFAULT_OPTIONS = ->
  [
    label: 'Option 1',
    checked: false
  ,
    label: 'Option 2',
    checked: false
  ]

Formbuilder.options =
  BUTTON_CLASS: 'button small'

Formbuilder.mappings =
  SIZE: 'field_options.size'
  UNITS: 'field_options.units'
  LABEL: 'label'
  FIELD_TYPE: 'field_type'
  REQUIRED: 'required'
  ADMIN_ONLY: 'admin_only'
  BLIND: 'blind'
  OPTIONS: 'field_options.options'
  COLUMNS: 'field_options.columns'
  COLUMN_TOTALS: 'field_options.column_totals'
  PRESET_VALUES: 'field_options.preset_values'
  DESCRIPTION: 'field_options.description'
  INCLUDE_OTHER: 'field_options.include_other_option'
  INCLUDE_BLANK: 'field_options.include_blank_option'
  INTEGER_ONLY: 'field_options.integer_only'
  MIN: 'field_options.min'
  MAX: 'field_options.max'
  MINLENGTH: 'field_options.minlength'
  MAXLENGTH: 'field_options.maxlength'
  MINROWS: 'field_options.minrows'
  MAXROWS: 'field_options.maxrows'
  LENGTH_UNITS: 'field_options.min_max_length_units'
  DISABLE_CENTS: 'field_options.disable_cents'
  DISABLE_SECONDS: 'field_options.disable_seconds'
  DEFAULT_LAT: 'field_options.default_lat'
  DEFAULT_LNG: 'field_options.default_lng'
  ADDRESS_FORMAT: 'field_options.address_format'
  FILE_TYPES: 'field_options.file_types'
  CONDITIONS: 'field_options.conditions'
  PHONE_FORMAT: 'field_options.phone_format'

sizeMed = ->
  field_options:
    size: 'medium'

# All fields, categorized
Formbuilder.FIELD_CATEGORIES =
  'Inputs':
    text:
      name: 'Text'
      icon: 'font'
      defaultAttributes: sizeMed
    paragraph:
      name: 'Paragraph'
      buttonHtml: """<span class="symbol">&#182;</span> Paragraph"""
      defaultAttributes: sizeMed
    checkboxes:
      name: 'Checkboxes'
      icon: 'check'
      defaultAttributes: ->
        field_options:
          options: Formbuilder.DEFAULT_OPTIONS()
    radio:
      name: 'Multiple Choice'
      icon: 'circle-o'
      defaultAttributes: ->
        field_options:
          options: Formbuilder.DEFAULT_OPTIONS()
    date:
      name: 'Date'
      icon: 'calendar'
    dropdown:
      name: 'Dropdown'
      icon: 'caret-down'
      defaultAttributes: ->
        field_options:
          options: Formbuilder.DEFAULT_OPTIONS()
          include_blank_option: false
    time:
      name: 'Time'
      icon: 'clock-o'
      defaultAttributes: ->
        field_options:
          disable_seconds: true
    number:
      name: 'Numeric'
      buttonHtml: """<span class="symbol">123</span> Numeric"""
    phone:
      name: 'Phone'
      icon: 'phone'
      defaultAttributes: ->
        field_options:
          phone_format: 'us'
    website:
      name: 'Website'
      icon: 'link'
    email:
      name: 'Email'
      icon: 'envelope'
    price:
      name: 'Price'
      icon: 'usd'
    address:
      name: 'Address'
      icon: 'home'
    file:
      name: 'File'
      icon: 'cloud-upload'
    table:
      name: 'Table'
      icon: 'table'
      defaultAttributes: ->
        field_options:
          columns: [
            label: 'Column 1'
          ,
            label: 'Column 2'
          ]
  'Geographic':
    map_marker:
      name: 'Map Marker'
      icon: 'map-marker'
  'Non-input':
    section_break:
      name: 'Section Break'
      icon: 'minus'
      defaultAttributes: sizeMed
    page_break:
      name: 'Page Break'
      icon: 'file'
    block_of_text:
      name: 'Block of Text'
      icon: 'font'
      defaultAttributes: sizeMed

# Flatten fields from above
Formbuilder.FIELD_TYPES = _.extend.apply(@,
  _.union({}, _.values(Formbuilder.FIELD_CATEGORIES))
)

validators =
  duplicateColumns: (model) ->
    return false unless model.field_type == 'table'
    colNames = _.map model.getColumns(), (col) -> col.label
    _.uniq(colNames).length != colNames.length

  minMaxMismatch: (model) ->
    return false unless model.field_type == 'number'
    min = parseFloat(model.get('field_options.min'))
    max = parseFloat(model.get('field_options.max'))
    if min && max && min > max
      true

  minMaxLengthMismatch: (model) ->
    return false unless model.field_type == 'paragraph' || model.field_type == 'text'
    min = parseInt(model.get('field_options.minlength'), 10)
    max = parseInt(model.get('field_options.maxlength'), 10)
    if min && max && min > max
      true

  minMaxRowsMismatch: (model) ->
    return false unless model.field_type == 'table'
    min = parseInt(model.get('field_options.minrows'), 10)
    max = parseInt(model.get('field_options.maxrows'), 10)
    if min && max && min > max
      true

  blankOption: (model) ->
    return false unless model.field_type in ['radio', 'checkboxes', 'dropdown']
    _.any model.getOptions(), (opt) ->
      !opt.label

  blankColumn: (model) ->
    return false unless model.field_type == 'table'
    _.any model.getColumns(), (col) ->
      !col.label

Formbuilder.Collection = Backbone.Collection.extend
  initialize: (_, options) ->
    { @parentView } = options
    @on 'add', @copyCidToModel
    @on 'remove', @removeConditionals
    @on 'remove change:isValid', => @parentView.calculateValidation()

    @on 'change', (model) =>
      # If the model is valid, validate silently. If there are already
      # errors, we want to clear them ASAP.
      @validateField(model, undefined, model.isValid)

    # Otherwise, be careful about _when_ we validate
    @on 'change:field_options.columns change:field_options.columns.*', (model) =>
      @validateField(model, 'duplicateColumns')

  validateField: (model, useValidator, silent) ->
    errs = $.extend {}, model.get('errors')

    # If useValidator is passed, only use that specific validator
    if useValidator
      errs[useValidator] = validators[useValidator](model)
    else
      for k, validator of validators
        errs[k] = validator(model)

    model.validationErrors = errs

    unless silent
      model.set 'errors', errs

    model.isValid = !_.any( _.values(errs), ((v) -> v) )

    unless silent
      model.set 'isValid', model.isValid

  comparator: (model) ->
    @parentView.modelDOMIndex(model)

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

Formbuilder.Views.ViewField = Backbone.View.extend
  className: "fb_field_wrapper"

  events:
    'click .cover': 'focusEditView'
    'click .js-duplicate': 'duplicate'
    'click [data-hard-remove]': 'hardRemove'
    'click [data-soft-remove]': 'softRemove'
    'click [data-toggle="dropdown"]': 'setEditing'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, 'change', @render
    @listenTo @model, 'destroy', @remove

  render: ->
    @model.setExistingValue?(null)

    @$el.data('cid', @model.cid).html JST["formbuilder/view/base"](
      hasResponses: @parentView.options.hasResponses,
      model: @model
    )

    @rendererView ||= new FormRenderer.Views[classify(@model.field_type)](
      model: @model
      showLabels: true
    )

    @toggleErrorClass()
    @$el.append @rendererView.render().el
    Formbuilder.disableTabbing(@$el)
    # @$el.initialize()
    @rendererView.trigger('shown')
    return @

  toggleErrorClass: ->
    if @model.get('isValid') == false
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
    if @parentView.options.hasResponses
      $.rails.showConfirmDialog @clearConfirmMsg(), $.proxy(@clear, @)
    else
      @clear()

  softRemove: ->
    @model.set Formbuilder.mappings.ADMIN_ONLY, true
    @model.set Formbuilder.mappings.REQUIRED, false
    @$el.appendTo(@$el.closest('.fb_response_fields'))
    @parentView._onChange()
    @parentView.ensureEditPaneScrolled()

  clear: ->
    @model.destroy()

  duplicate: ->
    attrs = _.deepClone(@model.attributes)
    delete attrs['id']
    attrs['label'] += ' Copy'
    newModel = @parentView.addField(
      attrs,
      position: @parentView.modelDOMIndex(@model) + 1
    )

Formbuilder.Views.EditField = Backbone.View.extend
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
      @parentView.removeEditPane()
      @parentView.setLeft('add')

    # 1. When condition field changed, reset method & value
    # 2. When condition method changed, reset value
    @listenTo @model, 'change:field_options.conditions.*', (m) =>
      for i in [0..(@model.getConditions().length - 1)]
        newVal = @conditionValueOptions(i)?[0]

        if m.hasChanged("field_options.conditions.#{i}.response_field_id")
          @setCondition(i, method: @conditionMethodsAtIndex(i)[0].key, value: newVal)
        else if m.hasChanged("field_options.conditions.#{i}.method")
          @setCondition(i, value: newVal)

  render: ->
    templateName = if @model.input_field then 'base' else 'base_non_input'
    @$el.html JST["formbuilder/edit/#{templateName}"](@)
    rivets.bind @$el, model: @model
    # @$el.initialize()

    if @model.hasColumnsOrOptions()
      new Sortable @$el.find('.fb_options')[0],
        handle: '.fa-reorder'
        onUpdate: $.proxy(@_optionsSorted, @)

    return @

  _optionsSorted: ->
    newOrder = @$el.find('.fb_options [data-index]').map ->
      $(@).data('index')
    .get()

    @model.orderOptions(newOrder)
    @render()

  addOption: (e) ->
    @model.addOptionOrColumn()
    @render()

  removeOption: (e) ->
    i = @$el.find(".js-remove-option").index($(e.currentTarget))
    @model.removeOptionOrColumn(i)
    @render()

  showModal: (e) ->
    modal = new Formbuilder.Views["#{$(e.currentTarget).data('show-modal')}Modal"]
      model: @model
      parentView: @

    $el = modal.render().$el

    $el.
      appendTo('body').
      modal('show')

    modal.shown?()

  changeFieldType: (e) ->
    newAttrs = Formbuilder.DEFAULT_FIELD_ATTRS($(e.currentTarget).val())

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

    @model.set @model.columnOrOptionKeypath(), newOpts.slice(0)
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
      method: _.first(@conditionMethodsForType(rf.field_type)).key
      value: optionsForResponseField(rf)?[0]
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
    if (id = @model.getConditionAt(i).response_field_id)
      # Can't use .get on newly-created models
      @parentView.collection.find (m) -> "#{m.id}" == "#{id}"

  conditionMethod: (i) ->
    @model.getConditionAt(i).method

  conditionFieldOptions: ->
    thisIdx = @parentView.collection.indexOf(@model)

    # Only allow setting conditions on fields that come *before*
    # this one.
    @parentView.collection.filter (field, index) =>
      field.input_field &&
      @conditionMethodsForType(field.field_type).length &&
      index < thisIdx

  conditionMethodsForType: (field_type) ->
    _.filter Formbuilder.CONDITION_METHODS, (method) ->
      field_type in method.field_types

  conditionMethodsAtIndex: (i) ->
    if (field_type = @conditionField(i)?.field_type)
      @conditionMethodsForType(field_type)
    else
      []

  conditionValueOptions: (i) ->
    optionsForResponseField(@conditionField(i))

  canAddConditions: ->
    @conditionFieldOptions().length > 0

  setCondition: (i, attrs) ->
    conditions = @model.getConditions().slice(0)
    _.extend conditions[i], attrs
    @model.set Formbuilder.mappings.CONDITIONS, conditions, silent: true
    @render()

FormRenderer.Models.ResponseField::getConditionAt = (i) ->
  @getConditions()[i] || {}

FormRenderer.Models.ResponseField::columnOrOptionKeypath = ->
  switch @field_type
    when 'table'
      'field_options.columns'
    when 'checkboxes', 'radio', 'dropdown'
      'field_options.options'

FormRenderer.Models.ResponseField::hasColumnsOrOptions = ->
  !!@columnOrOptionKeypath()

FormRenderer.Models.ResponseField::addOptionOrColumn = (i) ->
  opts = if @field_type == 'table' then @getColumns() else @getOptions()
  newOpts = opts.slice(0)
  newOpt =
    label: "#{if @field_type == 'table' then 'Column' else 'Option'} #{opts.length + 1}"
  newOpt.checked = false unless @field_type == 'table'
  newOpts.push newOpt
  @set @columnOrOptionKeypath(), newOpts

FormRenderer.Models.ResponseField::removeOptionOrColumn = (i) ->
  opts = @get(@columnOrOptionKeypath())
  newOpts = opts.slice(0)
  newOpts.splice i, 1
  @set @columnOrOptionKeypath(), newOpts

FormRenderer.Models.ResponseField::orderOptions = (newOrder) ->
  opts = @get(@columnOrOptionKeypath())
  newOpts = _.sortBy opts.slice(0), (_opt, i) ->
    _.indexOf(newOrder, i)
  @set @columnOrOptionKeypath(), newOpts

Formbuilder.CONDITION_METHODS = [
  key: 'eq'
  label: 'is'
  field_types: [
    'date', 'dropdown', 'email', 'number', 'paragraph', 'price',
    'radio', 'text', 'time', 'website'
  ]
,
  key: 'contains'
  label: 'contains'
  field_types: [
    'checkboxes', 'text', 'paragraph', 'website', 'email',
    'address', 'table'
  ]
,
  key: 'lt'
  label: 'is less than'
  field_types: ['number', 'price']
,
  key: 'gt'
  label: 'is greater than'
  field_types: ['number', 'price']
,
  key: 'shorter'
  label: 'is shorter than'
  field_types: ['text', 'paragraph']
,
  key: 'longer'
  label: 'is longer than'
  field_types: ['text', 'paragraph']
]

Formbuilder.Views.BaseModal = Backbone.View.extend
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

Formbuilder.Views.PresetValuesModal = Formbuilder.Views.BaseModal.extend
  render: ->
    @$el.html(JST["formbuilder/edit/preset_values_modal"](rf: @model))
    # @$el.initialize()
    return @

  save: ->
    @model.set Formbuilder.mappings.PRESET_VALUES, @getValues()

  getValues: ->
    _.tap {}, (h) =>
      for k, column of @model.getColumns()
        h[column.label] = @$el.find("[data-col=#{k}]").map( -> $(@).val() ).get()

Formbuilder.Views.DefaultLocationModal = Formbuilder.Views.BaseModal.extend
  render: ->
    @$el.html(JST["formbuilder/edit/default_location_modal"](rf: @model))
    @initMap()
    # @$el.initialize()
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

Formbuilder.Views.BulkAddOptionsModal = Formbuilder.Views.BaseModal.extend
  render: ->
    @$el.html(JST["formbuilder/edit/bulk_add_options_modal"]({rf: @model}))
    # @$el.initialize()
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

class Formbuilder.StatusIndicatorController
  constructor: (options) ->
    _.extend @, Backbone.Events
    { @fb } = options
    @$el = $('.save_status')
    @$btn = $('.bottom_status_bar_buttons .continue_button')
    @listenTo @fb, 'refreshStatus', @updateClass

  updateClass: ->
    @$el.removeClass('is_error is_saving is_invalid')
    @$btn.removeClass('disabled')

    if @fb.state.get('hasServerErrors')
      @$el.addClass('is_error')
    else if @fb.state.get('hasValidationErrors')
      @$btn.addClass('disabled')
      @$el.addClass('is_invalid')
    else if @fb.autosaver.isPending()
      @$el.addClass('is_saving')

Formbuilder.disableTabbing = ($el) ->
  $el.find('a, button, :input').attr('tabindex', '-1')
