class FormbuilderModel extends Backbone.DeepModel
  sync: -> # noop
  indexInDOM: ->
    $wrapper = $(".fb-field-wrapper").filter ( (_, el) => $(el).data('cid') == @cid  )
    $(".fb-field-wrapper").index $wrapper
  is_input: ->
    Formbuilder.inputFields[@get(Formbuilder.options.mappings.FIELD_TYPE)]?


class FormbuilderCollection extends Backbone.Collection
  initialize: ->
    @on 'add', @copyCidToModel

  model: FormbuilderModel

  comparator: (model) ->
    model.indexInDOM()

  copyCidToModel: (model) ->
    model.attributes.cid = model.cid


class ViewFieldView extends Backbone.View
  className: "fb-field-wrapper"

  events:
    'click .subtemplate-wrapper': 'focusEditView'
    'click .js-duplicate': 'duplicate'
    'click .js-clear': 'clear'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "change", @render
    @listenTo @model, "destroy", @remove

  render: ->
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.FIELD_TYPE))
        .data('cid', @model.cid)
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))

    return @

  focusEditView: ->
    @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    cb = =>
      @parentView.handleFormUpdate()
      @model.destroy()

    x = Formbuilder.options.CLEAR_FIELD_CONFIRM

    switch typeof x
      when 'string'
        if confirm(x) then cb()
      when 'function'
        x(cb)
      else
        cb()

  duplicate: (e) ->
    e.preventDefault();
    e.stopPropagation();
    attrs = _.clone(@model.attributes)
    delete attrs['id']
    delete attrs['cid']
    attrs['label'] += ' Copy'
    if attrs.grid
        attrs.grid = _.clone(attrs.grid)
        attrs.grid.row = attrs.grid.row + 1
    @parentView.createField attrs, { position: @model.indexInDOM() + 1 }
    @model.trigger "duplicate:viewfield"

class GridFieldView extends Backbone.View
  className: "fb-field-wrapper"
  events:
    'click .response-field-grid-cell li': 'inlineAdd'
    'click .response-field-grid-cell .js-clear': 'subelementClear'
    'click .js-duplicate': 'duplicate'
    'click .js-clear': 'clear'
    'click .subtemplate-wrapper': 'focusEditView'

  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "change", @redraw
    @listenTo @model, "destroy", @remove
    #bind models on subelement add instead of like this
    @parentView.collection.bind 'add', @addSubelement, @
    @parentView.collection.bind 'destroy', @removeSubelement, @
    @render

  render: ->
    @redraw()
    @renderChildren()
    return @

  #boo
  redraw: ->
    table = @$el.find('.response-field-grid-table').detach()
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.FIELD_TYPE))
        .data('cid', @model.cid)
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    if table.length == 1
      @$el.find('.response-field-grid-table').replaceWith(table);
    @renderTable()

  # make less gross
  renderTable: ->
    numRows = @model.get('field_options.num_rows') || 1
    numCols = @model.get('field_options.num_cols') || 1
    table = @$el.find 'table'
    currentRows = table.find('tr').length
    currentCols = table.find("tr:nth-child(1) td").length
    rows = $.makeArray table.find('tr')
    if currentRows < numRows
        rows = rows.concat [rows.length...numRows]
    rows = _.map rows, (row) =>
        if _.isNumber row
            row = $('<tr class="response-field-grid-row"></tr>').appendTo(table)

        cols = $.makeArray $(row).find('td')
        if cols.length < numCols
            cols = cols.concat [cols.length...numCols]
        cols = _.map cols, (col) ->
            if _.isNumber col
                col = $('<td class="response-field-grid-cell"></td>').appendTo(row).html(Formbuilder.templates["view/element_selector"]())
        row

    if currentRows > numRows
        _.each @subelements(), (subelement) =>
           grid = @parentView.gridAttr(subelement)
           if grid.row > (numRows - 1) then subelement.destroy()
        table.find('tr').slice(numRows - currentRows).remove()

    if currentCols > numCols
        _.each @subelements(), (subelement) =>
           grid = @parentView.gridAttr(subelement)
           if grid.col > (numCols - 1) then subelement.destroy()
        table.find('tr').find('td:gt('+(numCols - 1)+')').remove()

  renderChildren: ->
    children = @model.get('children') || [];
    _.each children, (child) =>
        grid = child.grid
        @createField child, @getSubelement(grid.row, grid.col)


  focusEditView: (e) ->
    if $(e.target).parents('table').length == 0 then  @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    _.each @subelements(), (model) ->
        model.destroy()

    cb = =>
      @parentView.handleFormUpdate()
      @model.destroy()

    x = Formbuilder.options.CLEAR_FIELD_CONFIRM

    switch typeof x
      when 'string'
        if confirm(x) then cb()
      when 'function'
        x(cb)
      else
        cb()

  duplicate: ->
    attrs = _.clone(@model.attributes)
    delete attrs['id']
    delete attrs['cid']
    attrs['label'] += ' Copy'
    children = @subelements()
    attrs['children'] = _.map children, (child) =>
        childattrs = _.clone(child.attributes)
        delete childattrs['id']
        delete childattrs['cid']
        childattrs
    @parentView.createField attrs, { position: -1 }


  addSubelement: (model) ->
    if @belongsToMe(model)
        grid = @parentView.gridAttr(model)
        model.attributes.label = 'Row: ' + (grid.row + 1) + ', Col: ' + (grid.col + 1)

  removeSubelement: (model) ->
    if @belongsToMe(model)
        grid = @parentView.gridAttr(model)
        @getSubelement(grid.row, grid.col).html(Formbuilder.templates["view/element_selector"]({rf: @model}))

  subelements: ->
    @parentView.collection.filter (item) =>
        return @belongsToMe(item)

  belongsToMe: (model) ->
    @parentView.inGrid(model) && @parentView.gridAttr(model).cid == @model.get('cid')

  inlineAdd: (e) ->
    e.preventDefault()
    e.stopPropagation()
    type = $(e.currentTarget).data('field-type')
    target = $(e.currentTarget).parents('.response-field-grid-cell')
    @createField(type, target)

  getSubelement: (row, col) ->
    row++
    col++
    @$el.find('tr:nth-child('+row+') td:nth-child('+col+')');

  createField: (attrs, target) ->
    if _.isString(attrs)
        attrs = Formbuilder.helpers.defaultFieldAttrs(attrs)
    attrs.grid =
        cid: @model.get('cid')
        col: target.prop('cellIndex')
        row: target.parents('tr').prop('rowIndex')
    @parentView.createField attrs, { $appendEl: target }




class EditFieldView extends Backbone.View
  className: "edit-response-field"

  events:
    'click .js-add-option': 'addOption'
    'click .js-remove-option': 'removeOption'
    'click .js-default-updated': 'defaultUpdated'
    'input .option-label-input': 'forceRender'


  initialize: (options) ->
    {@parentView} = options
    @listenTo @model, "destroy", @remove
    _.each Formbuilder.options.change, (callback, key) =>
      eventName = 'change:' + Formbuilder.options.mappings[key]
      @listenTo @model, eventName, callback


  render: ->
    @$el.html(Formbuilder.templates["edit/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    rivets.bind @$el, { model: @model }
    return @

  reset: ->
    @parentView.editView = undefined
    @parentView.createAndShowEditView(@model)

  remove: ->
    @parentView.editView = undefined
    @parentView.$el.find("[data-target=\"#addField\"]").click()
    super

  # @todo this should really be on the model, not the view
  addOption: (e) ->
    $el = $(e.currentTarget)
    i = @$el.find('.option').index($el.closest('.option'))
    options = @model.get(Formbuilder.options.mappings.OPTIONS) || []
    newOption = {label: "", checked: false}

    if i > -1
      options.splice(i + 1, 0, newOption)
    else
      options.push newOption

    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  removeOption: (e) ->
    $el = $(e.currentTarget)
    index = @$el.find(".js-remove-option").index($el)
    options = @model.get Formbuilder.options.mappings.OPTIONS
    options.splice index, 1
    @model.set Formbuilder.options.mappings.OPTIONS, options
    @model.trigger "change:#{Formbuilder.options.mappings.OPTIONS}"
    @forceRender()

  defaultUpdated: (e) ->
    $el = $(e.currentTarget)

    unless @model.get(Formbuilder.options.mappings.FIELD_TYPE) == 'checkboxes' # checkboxes can have multiple options selected
      @$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change')

    @forceRender()

  forceRender: ->
    @model.trigger('change')



class BuilderView extends Backbone.View
  SUBVIEWS: []

  saveFormButton: $()

  events:
    'click .fb-tabs a': 'showTab'
    'click .fb-add-field-types a': 'addField'
    'mouseover .fb-add-field-types': 'lockLeftWrapper'
    'mouseout .fb-add-field-types': 'unlockLeftWrapper'

  initialize: (options) ->
    {selector, @formBuilder, @bootstrapData} = options

    # This is a terrible idea because it's not scoped to this view.
    if selector?
      @setElement $(selector)

    # Create the collection, and bind the appropriate events
    @collection = new FormbuilderCollection
    @collection.bind 'add', @addOne, @
    @collection.bind 'reset', @reset, @
    @collection.bind 'change', @handleFormUpdate, @
    @collection.bind 'destroy add reset', @hideShowNoResponseFields, @
    @collection.bind 'destroy', @ensureEditViewScrolled, @

    @render()
    @collection.reset(@bootstrapData)
    @bindSaveEvent()

  bindSaveEvent: ->
    @formSaved = true
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)

    unless !Formbuilder.options.AUTOSAVE
      setInterval =>
        @saveForm.call(@)
      , 5000

    $(window).bind 'beforeunload', =>
      if @formSaved then undefined else Formbuilder.options.dict.UNSAVED_CHANGES

  reset: ->
    @$responseFields.html('')
    @addAll()

  render: ->
    @$el.html Formbuilder.templates['page']()

    # Save jQuery objects for easy use
    @$fbLeft = @$el.find('.fb-left')
    @$responseFields = @$el.find('.fb-response-fields')

    @bindWindowScrollEvent()
    @hideShowNoResponseFields()

    # Render any subviews (this is an easy way of extending the Formbuilder)
    new subview({parentView: @}).render() for subview in @SUBVIEWS

    return @

  bindWindowScrollEvent: ->
    $(window).on 'scroll', =>
      return if @$fbLeft.data('locked') == true
      newMargin = Math.max(0, $(window).scrollTop() - @$el.offset().top)
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
    appendEl = options.$appendEl || null
    replaceEl = options.$replaceEl || null
    if responseField.attributes.field_type == 'grid'
        view = new GridFieldView
          model: responseField
          parentView: @
    else
        view = new ViewFieldView
          model: responseField
          parentView: @

    grid = @gridAttr(responseField);

    if appendEl == null && grid? && grid.col != undefined && grid.row != undefined && grid.cid != undefined
        gridModel = @collection.find (model) ->
            return model.get('cid') is grid.cid
        wrapper = $('.fb-field-wrapper').filter (item) ->
            $(@).data('cid') == gridModel.cid
        append = wrapper.find('tr:nth-child(' + (grid.row + 1) + ') td:nth-child(' + (grid.col + 1) + ')')
        retry = options.retry || 0
        isEmpty = append.find('.element-selector').length == 1
        if append.length == 1 && isEmpty
            appendEl = append
        else if append.length == 1 && !isEmpty
            responseField.set('grid.row', grid.row + 1)
            return @addOne responseField, _, options
        # workaround for unsorted input.
        else if wrapper.length == 0 && retry < 2
            options.retry = retry + 1
            addOne = window._.bind @addOne, @
            window._.delay addOne, 250, responseField, _, options
            return
        else
            options.position = null
            delete responseField.attributes['grid']


    #####
    # Calculates where to place this new field.
    #
    # Are we replacing a temporarily drag placeholder?

    if appendEl?
      appendEl.html(view.render().el)

    else if replaceEl?
      replaceEl.replaceWith(view.render().el)

    # Are we adding to the bottom?
    else if !options.position? || options.position == -1
      @$responseFields.append view.render().el

    # Are we adding to the top?
    else if options.position == 0
      @$responseFields.prepend view.render().el

    # Are we adding below an existing field?
    else if ($replacePosition = @$responseFields.find(".fb-field-wrapper").eq(options.position))[0]
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
        if ui.item.data('field-type')
          rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {$replaceEl: ui.item}
          @createAndShowEditView(rf)

        @handleFormUpdate()
        return true
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.data('field-type')

    @setDraggable()

  setDraggable: ->
    $addFieldButtons = @$el.find("[data-field-type]")

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
    @createField Formbuilder.helpers.defaultFieldAttrs(field_type, {})

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == model.cid )
    $('.fb-field-wrapper').removeClass('editing')
    $responseFieldEl.addClass('editing')

    if @editView
      if @editView.model.cid is model.cid
        @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
        @scrollLeftWrapper($responseFieldEl)
        return

      @editView.remove()

    @editView = new EditFieldView
      model: model
      parentView: @

    $newEditEl = @editView.render().$el
    fieldWrapper = @$el.find(".fb-edit-field-wrapper")
    fieldWrapper.html $newEditEl
    if @inGrid(model) then fieldWrapper.addClass('fb-edit-field-grid') else fieldWrapper.removeClass('fb-edit-field-grid')
    @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
    @scrollLeftWrapper($responseFieldEl)
    attrs = Formbuilder.helpers.defaultFieldAttrs(model.get('field_type'))
    if attrs.definition.onEdit != undefined
        attrs.definition.onEdit model
    @$el.find("input, textarea, [contenteditable=true]").filter(':visible').first().focus()
    return @

  inGrid: (model) ->
    grid = model.attributes.grid || false
    grid != false && grid.cid != undefined

  gridAttr: (model) ->
    if @inGrid(model)
        return model.get('grid')
    null

  ensureEditViewScrolled: ->
    return unless @editView
    @scrollLeftWrapper $(".fb-field-wrapper.editing")

  scrollLeftWrapper: ($responseFieldEl) ->
    @unlockLeftWrapper()
    return unless $responseFieldEl[0]
    $.scrollWindowTo ((@$el.offset().top + $responseFieldEl.offset().top) - @$responseFields.offset().top), 200, =>
      @lockLeftWrapper()

  lockLeftWrapper: ->
    @$fbLeft.data('locked', true)

  unlockLeftWrapper: ->
    @$fbLeft.data('locked', false)

  handleFormUpdate: ->
    return if @updatingBatch
    @formSaved = false
    @saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM)

  getPayload: ->
    return JSON.stringify fields: @collection.toJSON()

  saveForm: (e) ->
    return if @formSaved
    @formSaved = true
    @saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED)
    @collection.sort()
    payload = @getPayload()

    if Formbuilder.options.HTTP_ENDPOINT then @doAjaxSave(payload)
    @formBuilder.trigger 'save', payload

  doAjaxSave: (payload) ->
    $.ajax
      url: Formbuilder.options.HTTP_ENDPOINT
      type: Formbuilder.options.HTTP_METHOD
      data: payload
      contentType: "application/json"
      success: (data) =>
        @updatingBatch = true

        for datum in data
          # set the IDs of new response fields, returned from the server
          @collection.get(datum.cid)?.set({id: datum.id})
          @collection.trigger 'sync'

        @updatingBatch = undefined


class Formbuilder
  @helpers:
    defaultFieldAttrs: (field_type) ->
      attrs = {}
      attrs[Formbuilder.options.mappings.LABEL] = 'Untitled'
      attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type
      attrs[Formbuilder.options.mappings.REQUIRED] = false
      attrs['definition'] = Formbuilder.fields[field_type]
      attrs['field_options'] = {}
      Formbuilder.fields[field_type].defaultAttributes?(attrs) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')

  @options:
    BUTTON_CLASS: 'fb-button btn btn-default'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    AUTOSAVE: true
    CLEAR_FIELD_CONFIRM: false
    ENABLED_FIELDS: ['text','checkboxes','dropdown', 'paragraph', 'radio', 'date','section_break', 'signature', 'info', 'grid']

    mappings:
      SIZE: 'field_options.size'
      UNITS: 'field_options.units'
      LABEL: 'label'
      NAME: 'definition.name'
      FIELD_TYPE: 'field_type'
      REQUIRED: 'required'
      ADMIN_ONLY: 'admin_only'
      OPTIONS: 'field_options.options'
      DESCRIPTION: 'field_options.description'
      INCLUDE_OTHER: 'field_options.include_other_option'
      INCLUDE_BLANK: 'field_options.include_blank_option'
      INCLUDE_SCORING: 'field_options.include_scoring'
      INTEGER_ONLY: 'field_options.integer_only'
      TABLE:
        COLS: 'field_options.cols',
        NUMCOLS: 'field_options.num_cols',
        ROWS: 'field_options.rows',
        NUMROWS: 'field_options.num_rows'
      MIN: 'field_options.min'
      MAX: 'field_options.max'
      MINLENGTH: 'field_options.minlength'
      MAXLENGTH: 'field_options.maxlength'
      LENGTH_UNITS: 'field_options.min_max_length_units'

    change:
      INCLUDE_SCORING: ->
        @reset()

    dict:
      ALL_CHANGES_SAVED: 'All changes saved'
      SAVE_FORM: 'Save form'
      UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'

  @fields: {}
  @inputFields: {}
  @nonInputFields: {}

  markSaved: ->
    @mainView.formSaved = true

  getPayload: ->
    return @mainView.getPayload()

  @registerField: (name, opts) ->
    enabled = true
    unless _.contains(Formbuilder.options.ENABLED_FIELDS, name)
      enabled = false
    for x in ['view', 'edit']
      opts[x] = if enabled then _.template(opts[x]) else (x) -> ''

    opts.field_type = name
    opts.enabled = enabled

    Formbuilder.fields[name] = opts

    if opts.type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  constructor: (opts={}) ->
    _.extend @, Backbone.Events
    args = _.extend opts, {formBuilder: @}
    @mainView = new BuilderView args
    @mainView.collection

window.Formbuilder = Formbuilder

if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
