window.FormBuilder ||= {}

FormBuilder.all_fields = {}
FormBuilder.input_fields = {}
FormBuilder.non_input_fields = {}
FormBuilder.helpers = {}
FormBuilder.models = {}
FormBuilder.views = {}
FormBuilder.collections = {}

FormBuilder.helpers.defaultFieldAttrs = (field_type) ->
  attrs =
    label: "Untitled"
    field_type: field_type
    field_options:
      required: true

  FormBuilder.all_fields[field_type].defaultAttributes?(attrs) || attrs

FormBuilder.helpers.simple_format = (x) ->
  x?.replace(/\n/g, '<br />')

FormBuilder.registerField = (name, opts) ->
  for x in ['view', 'edit']
    opts[x] = _.template(opts[x])

  FormBuilder.all_fields[name] = opts

  if opts.type == 'non_input'
    FormBuilder.non_input_fields[name] = opts
  else
    FormBuilder.input_fields[name] = opts

FormBuilder.views.view_field = Backbone.View.extend
  className: "response-field-wrapper"

  initialize: ->
    @parentView = @options.parentView
    @listenTo @model, "change", @render
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.addClass('response-field-'+@model.get('field_type'))
        .data('cid', @model.cid)
        .html(FormBuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))

    return @

  focusEditView: ->
    @parentView.createAndShowEditView(@model)

  clear: ->
    @parentView.handleFormUpdate()
    @model.destroy()

  duplicate: ->
    attrs = _.clone(@model.attributes)
    delete attrs['id']
    attrs['label'] += ' Copy'
    @parentView.createField attrs, { position: @model.indexInDOM() + 1 }

FormBuilder.views.edit_field = Backbone.View.extend
  className: "edit-response-field"

  initialize: ->
    @listenTo @model, "destroy", @remove
    @listenTo @model, "change:field_options.review_this_field", @auditReviewThisFieldChanged

  render: ->
    @$el.html(FormBuilder.templates["edit/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    rivets.bind @$el, { model: @model }
    return @

  remove: ->
    @options.parentView.editView = undefined
    @options.parentView.$el.find("[href=\"#addField\"]").click()
    Backbone.View.prototype.remove.call(@)

  # @todo this should really be on the model, not the view
  addOption: (e, $el) ->
    i = @$el.find('.option').index($el.closest('.option'))
    options = @model.get("field_options.options") || []
    newOption = {label: "", checked: false}

    if i > -1
      options.splice(i + 1, 0, newOption)
    else
      options.push newOption

    @model.set "field_options.options", options

  removeOption: (e, $el) ->
    index = @$el.find("[data-backbone-click=removeOption]").index($el)
    options = @model.get "field_options.options"
    options.splice index, 1
    @model.set "field_options.options", options

  defaultUpdated: (e, $el) ->
    unless @model.get('field_type') == 'checkboxes' # checkboxes can have multiple options selected
      @$el.find("[data-backbone-click=defaultUpdated]").not($el).attr('checked', false).trigger('change')

    @forceRender()

  forceRender: ->
    @model.trigger('change')

FormBuilder.models.response_field = Backbone.DeepModel.extend
  sync: -> # noop

  indexInDOM: ->
    $wrapper = $(".response-field-wrapper").filter ( (_, el) => $(el).data('cid') == @cid  )
    $(".response-field-wrapper").index $wrapper

  is_input: ->
    FormBuilder.input_fields[@get('field_type')]?

FormBuilder.collections.response_fields = Backbone.Collection.extend
  model: FormBuilder.models.response_field

  comparator: (model) ->
    model.indexInDOM()

  addCidsToModels: ->
    @each (model) ->
      model.attributes.cid = model.cid

FormBuilder.main = Backbone.View.extend
  el: "#formBuilder"

  SUBVIEWS: []

  events:
    'click .js-save-form': 'saveForm'
    'click .fb-tabs a': 'showTab'
    'click .fb-add-field-types a': 'addField'

  initialize: ->
    # Create the collection, and bind the appropriate events
    @collection = new FormBuilder.collections.response_fields
    @collection.bind 'add', @addOne, @
    @collection.bind 'reset', @reset, @
    @collection.bind 'change', @handleFormUpdate, @
    @collection.bind 'destroy add reset', @hideShowNoResponseFields, @
    @collection.bind 'destroy', @ensureEditViewScrolled, @

    @render()
    @collection.reset(@options.bootstrapData)
    @initAutosave()

  initAutosave: ->
    @formSaved = true
    @saveFormButton = @$el.find("[data-backbone-click=saveForm]")
    # @saveFormButton.button 'loading'

    setInterval =>
      @saveForm.call(@)
    , 5000

    $(window).bind 'beforeunload', =>
      if @formSaved then undefined else 'You have unsaved changes. If you leave this page, you will lose those changes!'

  reset: ->
    @$responseFields.html('')
    @addAll()

  render: ->
    @$el.html FormBuilder.templates['page']()

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.fb-left')
    @$responseFields = @$el.find('.fb-response-fields')

    @bindWindowScrollEvent()
    @hideShowNoResponseFields()

    # Render any subviews (this is an easy way of extending the FormBuilder)
    new subview({parentView: @}).render() for subview in @SUBVIEWS

    return @

  bindWindowScrollEvent: ->
    $(window).on 'scroll', =>
      return if @$fbLeft.data('locked') == true
      newMargin = Math.max(0, $(window).scrollTop())
      maxMargin = @$responseFields.height()

      @$fbLeft.css
        'margin-top': Math.min(maxMargin, newMargin)

  showTab: (e) ->
    $el = $(e.currentTarget)
    target = $el.data('target')
    $el.closest('li').addClass('active').siblings('li').removeClass('active')
    $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active')

    @unlockLeftWrapper() unless target == '#editField'

    if target == '#editField' && !@editView && (first_model = @collection.models[0])
      @createAndShowEditView(first_model)

  addOne: (responseField, _, options) ->
    view = new FormBuilder.views.view_field
      model: responseField
      parentView: @

    #####
    # Calculates where to place this new field.
    #
    # Are we replacing a temporarily drag placeholder?
    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)

    # Are we adding to the bottom?
    else if !options.position? || options.position == -1
      @$responseFields.append view.render().el

    # Are we adding to the top?
    else if options.position == 0
      @$responseFields.prepend view.render().el

    # Are we adding below an existing field?
    else if ($replacePosition = @$responseFields.find(".response-field-wrapper").eq(options.position))[0]
      $replacePosition.before view.render().el

    # Catch-all: add to bottom
    else
      @$responseFields.append view.render().el

  setSortable: ->
    @$responseFields.sortable('destroy') if @$responseFields.hasClass('ui-sortable')
    @$responseFields.sortable
      forcePlaceholderSize: true
      placeholder: 'sortable-placeholder'
      stop: (e, ui) =>
        if ui.item.is('a')
          field_type = ui.item.data('backbone-params')
          pos = $(".response-field-wrapper").index(ui.item.next(".response-field-wrapper"))
          rf = @collection.create FormBuilder.helpers.defaultFieldAttrs(field_type), {$replaceEl: ui.item}
          @createAndShowEditView(rf)

        @handleFormUpdate()
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.hasClass('btn')

    @setDraggable()

  setDraggable: ->
    return
    $addFieldButtons = @$el.find("[data-backbone-click=addField], [data-backbone-click=addExistingField]")
    $addFieldButtons.draggable('destroy') if $addFieldButtons.hasClass('ui-draggable')

    $addFieldButtons.draggable
      connectToSortable: @$responseFields
      helper: =>
        $helper = $("<div class='response-field-draggable-helper' />")
        $helper.css
          width: @$responseFields.width() # hacky, won't get set without inline style
          height: '80px'

        $helper

  addAll: ->
    @collection.each @addOne, @
    @setSortable()

  hideShowNoResponseFields: ->
    @$el.find(".fb-no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

  addField: (e) ->
    field_type = $(e.currentTarget).data('field-type')
    @createField FormBuilder.helpers.defaultFieldAttrs(field_type)

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".response-field-wrapper").filter( -> $(@).data('cid') == model.cid )
    $responseFieldEl.addClass('editing').siblings('.response-field-wrapper').removeClass('editing')

    if @editView
      if @editView.model.cid is model.cid
        @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
        @scrollLeftWrapper $responseFieldEl, (oldPadding? && oldPadding)
        return

      oldPadding = @$fbLeft.css('padding-top')
      @editView.remove()

    @editView = new FormBuilder.views.edit_field
      model: model
      parentView: @

    $newEditEl = @editView.render().$el
    @$el.find("#edit-response-field-wrapper").html $newEditEl
    @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
    @scrollLeftWrapper($responseFieldEl)
    return @

  ensureEditViewScrolled: ->
    return unless @editView
    @scrollLeftWrapper $(".response-field-wrapper.editing")

  scrollLeftWrapper: ($responseFieldEl) ->
    @unlockLeftWrapper()
    $.scrollWindowTo ($responseFieldEl.offset().top - @$responseFields.offset().top), 200, =>
      @lockLeftWrapper()

  lockLeftWrapper: ->
    @$fbLeft.data('locked', true)

  unlockLeftWrapper: ->
    @$fbLeft.data('locked', false)

  handleFormUpdate: ->
    return if @updatingBatch
    @formSaved = false
    # @saveFormButton.button('reset')

  saveForm: (e) ->
    return if @formSaved is true
    @formSaved = true
    # @saveFormButton.button 'loading'

    @collection.sort()

    # we need to send the cids to the server
    @collection.addCidsToModels()

    # trigger an event that we're syncing up to the server
    @collection.trigger 'batchUpdate'

    $.ajax
      url: "/response_fields/batch?#{@collection.urlParams}"
      type: "PUT"
      contentType: "application/json"
      data: JSON.stringify({response_fields: @collection.toJSON(), form_options: @response_fieldable?.toJSON()})
      success: (data) =>
        @updatingBatch = true

        for datum in data
          # set the IDs of new response fields, returned from the server
          @collection.get(datum.cid)?.set({id: datum.id})
          @collection.trigger 'sync'

        @updatingBatch = undefined
