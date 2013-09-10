`String.prototype.simple_format = function() {
  return this.replace(/\n/g, '<br />');
}`

_.extend Backbone.View.prototype,
  onClick: (e) ->
    return if $(e.currentTarget).hasClass 'disabled'
    @callMethodIfExists $(e.currentTarget).data('backbone-click'), e

  onSubmit: (e) ->
    e.preventDefault()
    @callMethodIfExists $(e.currentTarget).data('backbone-submit'), e

  onFocus: (e) ->
    @callMethodIfExists $(e.currentTarget).data('backbone-focus'), e

  onInput: (e) ->
    @callMethodIfExists $(e.currentTarget).data('backbone-input'), e

  callMethodIfExists: (methodName, e) ->
    @[methodName]?(e, $(e.currentTarget), $(e.currentTarget).data('backbone-params'))

  delegateEvents: (events) ->
    delegateEventSplitter = /^(\S+)\s*(.*)$/

    events ||= _.result(this, "events") || {}

    _.extend events,
      "click [data-backbone-click]": "onClick"
      "submit [data-backbone-submit]": "onSubmit"
      "focus [data-backbone-focus]": "onFocus"
      "input [data-backbone-input]": "onInput"

    @undelegateEvents()

    for key of events
      method = events[key]
      method = this[events[key]]  unless _.isFunction(method)
      throw new Error("Method \"" + events[key] + "\" does not exist")  unless method
      match = key.match(delegateEventSplitter)
      eventName = match[1]
      selector = match[2]
      method = _.bind(method, this)
      eventName += ".delegateEvents" + @cid
      if selector is ""
        @$el.on eventName, method
      else
        @$el.on eventName, selector, method

window.FormBuilder ||= {}

FormBuilder.RESPONSE_FIELD_TYPES =
  text: "<span class='symbol'><span class='icon-font'></span></span> Text"
  paragraph: '<span class="symbol">&#182;</span> Paragraph'
  checkboxes: '<span class="symbol"><span class="icon-check-empty"></span></span> Checkboxes'
  radio: '<span class="symbol"><span class="icon-circle-blank"></span></span> Multiple Choice'
  dropdown: '<span class="symbol"><span class="icon-caret-down"></span></span> Dropdown'
  price: '<span class="symbol"><span class="icon-dollar"></span></span> Price'
  number: '<span class="symbol"><span class="icon-number">123</span></span> Number'
  date: '<span class="symbol"><span class="icon-calendar"></span></span> Date'
  time: '<span class="symbol"><span class="icon-time"></span></span> Time'
  website: '<span class="symbol"><span class="icon-link"></span></span> Website'
  file: '<span class="symbol"><span class="icon-cloud-upload"></span></span> File'
  email: '<span class="symbol"><span class="icon-envelope-alt"></span></span> Email'
  address: '<span class="symbol"><span class="icon-home"></span></span> Address'

FormBuilder.RESPONSE_FIELD_NON_INPUT_TYPES =
  section_break: "<span class='symbol'><span class='icon-minus'></span></span> Section Break"

ADD_FIELD_VIEW = Backbone.View.extend
  el: "#addField"

  render: ->
    @$el.html FormBuilder.JST['add_field']()
    @options.parentView.setDraggable()

RESPONSE_IDENTIFIER_VIEW = Backbone.View.extend
  el: ".response-identifier-wrapper"

  initialize: ->
    @listenTo @options.parentView.collection, 'remove', @render
    @listenTo @options.parentView.collection, 'batchUpdate', @render
    @listenTo @options.parentView.collection, 'sync', @render

  render: ->
    @$el.html FormBuilder.JST['response_identifier']
      response_fields: @options.parentView.collection

    rivets.bind @$el,
      formOptions: @options.parentView.response_fieldable

VIEW_FIELD_VIEW = Backbone.View.extend
  className: "response-field-wrapper"

  initialize: ->
    @parentView = @options.parentView
    @listenTo @model, "change", @render
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.addClass('response-field-'+@model.get('field_type'))

    @$el.html FormBuilder.JST["view/base#{if !@model.is_input() then '_non_input' else ''}"]
      response_field: @model

    @$el.find(".subtemplate-wrapper-inner").html FormBuilder.JST["view/#{@model.get('field_type')}"]
      response_field: @model

    @$el.data('cid', @model.cid)

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

EDIT_FIELD_VIEW = Backbone.View.extend
  className: "edit-response-field"

  initialize: ->
    @listenTo @model, "destroy", @remove
    @listenTo @model, "change:field_options.review_this_field", @auditReviewThisFieldChanged
    @parentView = @options.parentView

  render: ->
    @$el.html FormBuilder.JST["edit/base#{if !@model.is_input() then '_non_input' else ''}"]
      response_field: @model
      parentView: @parentView

    @$el.find(".edit-subtemplate-wrapper").html FormBuilder.JST["edit/#{@model.get('field_type')}"]
      model: @model

    rivets.bind @$el,
      model: @model

    return @

  remove: ->
    @parentView.editView = undefined
    @parentView.$el.find("[href=\"#addField\"]").click()
    Backbone.View.prototype.remove.call(@)

  auditReviewThisFieldChanged: ->
    # Warn when removing field that exists
    if !@model.get('field_options.review_this_field')
      @model.attributes.field_options.review_this_field = true

      if confirm 'Are you sure you want to remove the review field? You will lose all reviews.'
        @model.attributes.field_options.review_this_field = false
      else
        @model.set('field_options.review_this_field', true)

    # Set defaults
    if !@model.get('field_options.review_this_field_type')?
      @model.set('field_options.review_this_field_type', 'stars')

    if !@model.get('field_options.review_this_field_max')?
      @model.set('field_options.review_this_field_max', 10)

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
    @model.trigger 'change'

RESPONSE_FIELD_MODEL = Backbone.DeepModel.extend
  sync: -> # noop
  indexInDOM: ->
    $wrapper = $(".response-field-wrapper").filter ( (_, el) => $(el).data('cid') == @cid  )
    $(".response-field-wrapper").index $wrapper
  is_input: ->
    FormBuilder.RESPONSE_FIELD_TYPES[@get('field_type')]

RESPONSE_FIELD_LIST = Backbone.Collection.extend
  model: RESPONSE_FIELD_MODEL
  comparator: (model) ->
    model.indexInDOM()

FormBuilder.formBuilder = Backbone.View.extend
  el: "#formBuilder"

  SUBVIEWS: [ADD_FIELD_VIEW, RESPONSE_IDENTIFIER_VIEW]

  initialize: ->
    @collection = new RESPONSE_FIELD_LIST

    # if @options.formOptions
    #   @response_fieldable = new Backbone.Model(@options.formOptions)
    #   @response_fieldable.bind 'change', @handleFormUpdate, @

    @collection.bind 'add', @addOne, @
    @collection.bind 'reset', @reset, @
    @collection.bind 'change', @handleFormUpdate, @
    @collection.bind 'destroy add reset', @toggleNoResponseFields, @
    @collection.bind 'destroy', @ensureEditViewScrolled, @

    @editView = undefined
    @addingAll = undefined

    @render()

    @collection.reset(@options.bootstrapData)

    for subview in @SUBVIEWS
      new subview({parentView: @}).render()

    @formSaved = true
    @saveFormButton = @$el.find("[data-backbone-click=saveForm]")
    @saveFormButton.button 'loading'
    setInterval =>
      @saveForm.call(@)
    , 5000

    $(window).bind 'beforeunload', =>
      if @formSaved then undefined else 'You have unsaved changes. If you leave this page, you will lose those changes!'

  reset: ->
    $("#response-fields").html('')
    @addAll()

  render: ->
    @$el.html FormBuilder.JST['page']
      options: @options

    # rivets.bind @$el,
    #   formOptions: @response_fieldable

    @$el.find("#response-field-tabs a[href=\"#editField\"]").on 'show', =>
      if !@editView && (first_model = @collection.models[0])
        @createAndShowEditView(first_model)

    @$el.find("#response-field-tabs a").on 'show', (e) =>
      @unlockLeftWrapper() unless $(e.currentTarget).attr('href') == '#editField'
      if $(e.currentTarget).attr('href') == '#formOptions'
        $.scrollWindowTo 0, 200, =>
          @lockLeftWrapper()


    $(window).on 'scroll', =>
      return if $('#response-field-left-wrapper').data('locked') == true
      newMargin = Math.max(0, $(window).scrollTop())
      maxMargin = $("#response-fields").height()

      $('#response-field-left-wrapper').css
        'margin-top': Math.min(maxMargin, newMargin)

    @toggleNoResponseFields()

    return @

  addOne: (responseField, _, options) ->
    view = new VIEW_FIELD_VIEW
      model: responseField
      parentView: @

    if options.$replaceEl?
      options.$replaceEl.replaceWith(view.render().el)
    else if !options.position? || options.position == -1
      $("#response-fields").append view.render().el
    else if options.position == 0
      $("#response-fields").prepend view.render().el
    else
      $replacePosition = $("#response-fields .response-field-wrapper").eq(options.position)
      if $replacePosition.length > 0
        $replacePosition.before view.render().el
      else
        $("#response-fields").append view.render().el

    @resetSortable() unless @addingAll

  resetSortable: ->
    @$el.find("#response-fields").sortable('destroy') if $(@).find("#response-fields").hasClass('ui-sortable')
    @$el.find("#response-fields").sortable
      forcePlaceholderSize: true
      placeholder: 'sortable-placeholder'
      stop: (e, ui) =>
        if ui.item.is('a')
          field_type = ui.item.data('backbone-params')
          pos = $(".response-field-wrapper").index(ui.item.next(".response-field-wrapper"))
          rf = @collection.create @defaultAttrs(field_type), {$replaceEl: ui.item}
          @createAndShowEditView(rf)

        @handleFormUpdate()
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.hasClass('btn')


    @setDraggable()

  setDraggable: ->
    $addFieldButtons = @$el.find("[data-backbone-click=addField], [data-backbone-click=addExistingField]")
    # $addFieldButtons.draggable('destroy') if $addFieldButtons.hasClass('ui-draggable')
    $addFieldButtons.draggable
      connectToSortable: '#response-fields'
      helper: ->
        $helper = $("<div class='response-field-draggable-helper' />")
        $helper.css
          width: $('#response-fields').width() # hacky, won't get set without inline style
          height: '80px'

        $helper

  addAll: ->
    @addingAll = true
    @collection.each @addOne, @
    @addingAll = false
    @resetSortable()

  toggleNoResponseFields: ->
    @$el.find("#no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

  defaultAttrs: (field_type) ->
    attrs =
      label: "Untitled"
      field_type: field_type
      field_options:
        required: true

    switch attrs.field_type
      when "checkboxes", "dropdown", "radio"
        attrs.field_options.options = [
          label: "",
          checked: false
        ,
          label: "",
          checked: false
        ]

      when "dropdown"
        attrs.field_options.include_blank_option = false

      when "text", "paragraph"
        attrs.field_options.size = "small"

    attrs

  addField: (_, __, field_type) ->
    @createField @defaultAttrs(field_type)

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".response-field-wrapper").filter(-> $(@).data('cid') == model.cid)
    @$el.find(".response-field-wrapper").removeClass('editing')
    $responseFieldEl.addClass('editing')

    if @editView
      if @editView.model.cid is model.cid
        @$el.find("#response-field-tabs a[href=\"#editField\"]").click()
        @scrollLeftWrapper $responseFieldEl, (oldPadding? && oldPadding)
        return

      oldPadding = @$el.find("#response-field-left-wrapper").css('padding-top')
      @editView.remove()

    @editView = new EDIT_FIELD_VIEW
      model: model
      parentView: @

    $newEditEl = @editView.render().$el
    @$el.find("#edit-response-field-wrapper").html $newEditEl
    @$el.find("#response-field-tabs a[href=\"#editField\"]").click()

    @scrollLeftWrapper($responseFieldEl)
    @

  ensureEditViewScrolled: ->
    return unless @editView
    @scrollLeftWrapper $(".response-field-wrapper.editing")

  scrollLeftWrapper: ($responseFieldEl) ->
    @unlockLeftWrapper()
    $.scrollWindowTo ($responseFieldEl.offset().top - $("#response-fields").offset().top), 200, =>
      @lockLeftWrapper()

  lockLeftWrapper: ->
    $("#response-field-left-wrapper").data('locked', true)

  unlockLeftWrapper: ->
    $("#response-field-left-wrapper").data('locked', false)

  handleFormUpdate: ->
    return if @updatingBatch
    @formSaved = false
    @saveFormButton.button('reset')

  saveForm: (e) ->
    return if @formSaved is true
    @formSaved = true
    @saveFormButton.button 'loading'

    @collection.sort()

    # we need to send the cids to the server
    @collection.each ( (model) -> model.attributes.cid = model.cid )

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

          if (newReviewFieldId = datum.field_options.review_this_field_id)
            @collection.get(datum.cid)?.set('field_options.review_this_field_id', newReviewFieldId)

          @collection.trigger 'sync'

        @updatingBatch = undefined
