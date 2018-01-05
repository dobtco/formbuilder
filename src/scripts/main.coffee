class FormbuilderModel extends Backbone.DeepModel
  sync: -> # noop
  indexInDOM: ->
    $wrapper = $(".fb-field-wrapper").filter ( (_, el) => $(el).data('cid') == @cid  )
    $wrapper.index ".fb-field-wrapper"
  is_input: ->
    Formbuilder.inputFields[@get(Formbuilder.options.mappings.TYPE)]?
  initialize: ->
    if not @attributes.uuid?
      @attributes.uuid = uuid.v4()
    if not @attributes.parent_uuid is undefined
      @attributes.parent_uuid = null
    @attachMethods()
  parentModel: () ->
    collention = @collection
    if collention
      @collection.findWhereUuid(@get('parent_uuid'))
  hasParent: () -> @parentModel() != undefined
  inTable: () ->
    parent = @parentModel()
    parent and parent.get('type') is 'table'
  inGrid:() ->
    parent = @parentModel()
    parent and parent.get('type') is 'grid'
  canBeConditionallyDisplayed:() -> !@inTable() and !@inGrid() and Formbuilder.conditionalFunctionality
  canShowReferenceID: () -> Formbuilder.showReferenceIDFunctionality
  conditionalParent: () ->
    parentUuid = @get(Formbuilder.options.mappings.CONDITIONAL_PARENT)
    if parentUuid
      return @collection.findWhereUuid(parentUuid)
    null

  conditionalChildren: () ->
    uuid = @attributes.uuid
    @collection.filter (item) -> uuid is item.get(Formbuilder.options.mappings.CONDITIONAL_PARENT)

  answers: () -> @get('answers') || []

  conditionalTriggerOptions: (selected) ->
    parent = @conditionalParent()
    options = []
    if parent
      options = _.clone(parent.answers())
      options.unshift({'uuid': '', 'label': '[No Selection]'})
      if selected
        triggerValues =  @get(Formbuilder.options.mappings.CONDITIONAL_VALUES) || []
        options = _.filter options, (trigger) -> trigger.uuid in triggerValues

    options

  isValid: ()->
    conditional_ele = @canBeConditionallyDisplayed()
    if !conditional_ele
      return true
    else
      options = @attributes.options
      conditional = options.conditional
      if conditional
        conditional_values = conditional.values
        conditional_parent = conditional.parent
    if ((conditional_parent && (conditional_values && conditional_values.length != 0)) || (typeof conditional_values is "undefined" && typeof conditional_parent is "undefined"))
      return true
    else
      return false

  attachMethods: ()->
    if typeof @attributes.initialize is 'function'
      @attributes.initialize.call(@)
      delete @attributes['initialize']

     #Shift function from attributes to model
    if typeof @attributes.insertion is 'function'
      @['insertion'] = @attributes['insertion']
      delete @attributes['insertion']


    _.each(@attributes, (method, name)->
       if typeof method is 'function' and @[name] is undefined
         @[name] = method
         delete @attributes[name]

     , @)

class FormbuilderCollection extends Backbone.Collection
  model: FormbuilderModel
  comparator: (model) ->
    model.indexInDOM()

  add: (model) ->
    models = model = super(model)

    if not _.isArray(model)
      models = [model]

    _.each models, (model) ->
      if typeof model.insertion is 'function'
        model.insertion.call(model)
    model

  findWhereUuid: (uuid) -> @findWhere({'uuid':uuid})
  findDataSourceFields: () -> @where({'type':'datasource'})
  findConditionalTriggers: (child) ->
    items = @filter (model) ->
      correctType = model.get('type') in ['dropdown', 'checkbox', 'radio']
      differentModel = model != child
      hasNoParent = !model.hasParent()
      correctType and differentModel and hasNoParent
    items
  clearConditionEle: (conditionalChild)->
    conditionalChild.unset(Formbuilder.options.mappings.CONDITIONAL)

class ViewFieldView extends Backbone.View
  @insert: (builder, view, responseField, _, options) ->
    parentModel = responseField.parentModel()
    if parentModel is undefined or parentModel.get('type') is 'grid' or parentModel.get('type') is 'table'
      appendEl = options.$appendEl || null
      replaceEl = options.$replaceEl || null
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
        builder.$responseFields.append view.render().el

      # Are we adding to the top?
      else if options.position == 0
        builder.$responseFields.prepend view.render().el

      # Are we adding below an existing field?
      else if ($replacePosition = builder.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]
        $replacePosition.before view.render().el

      # Catch-all: add to bottom
      else
        builder.$responseFields.append view.render().el

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
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.TYPE))
        .data('cid', @model.cid)
        .data('uuid', @model.get('uuid'))
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    return @

  focusEditView: ->
    @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    _.each @model.conditionalChildren(), (conditionalChild) ->
      conditionalChild.unset(Formbuilder.options.mappings.CONDITIONAL_PARENT)
      conditionalChild.unset(Formbuilder.options.mappings.CONDITIONAL_VALUES)


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
    attrs = Formbuilder.helpers.clone(@model.attributes);
    delete attrs['id']
    delete attrs['cid']
    delete attrs['uuid']
    attrs['label'] += ' Copy'
    if attrs.options.grid
        attrs.options.grid.row = attrs.options.grid.row + 1
    @parentView.createField attrs, { position: @model.indexInDOM() + 1 }
    @model.trigger "duplicate:viewfield"


class TableFieldView extends ViewFieldView
  className: "fb-field-wrapper"
  initialize: (options) ->
    @parentView = options.parentView
    @listenTo @model, "change", @update
    @listenTo @model, "destroy", @remove
    _.each @model.get('options.elements'), (element) ->
      childModel = @model.collection.findWhereUuid(element.uuid)
      if childModel
        @listenTo childModel, "change", @update
      else
        console.log(element.uuid)
    ,@
  events:
    'mouseenter': 'showSelectors',
    'mouseleave': 'removeSelectors'
    'click .drop-area li': 'inlineAdd'
    'click .subtemplate-wrapper': 'focusEditView'
    'click .response-field-table td.header': 'focusSubelement'
    'click .response-field-table td.element': 'focusSubelement'
    'click .js-clear': 'clear'
    'click .js-duplicate': 'duplicate'

  showSelectors: (e) ->
    @$el.find('.drop-area').html(Formbuilder.templates['view/element_selector']())

  removeSelectors: (e) ->
    @$el.find('.drop-area').html('')

  inlineAdd: (e) ->
    e.preventDefault()
    e.stopPropagation()
    childModel = new FormbuilderModel(Formbuilder.helpers.defaultFieldAttrs($(e.currentTarget).data('type')))
    childModel.set('parent_uuid', @model.get('uuid'))
    childModel.set('options.in_sequence', true)
    @listenTo childModel, "change", @update
    elements = @model.attributes.options.elements || []
    newElement = {
      'uuid': childModel.get('uuid')
    }
    elements.push(newElement)
    @model.attributes.options.elements = elements
    @parentView.collection.add childModel
    @update(childModel)

  update: (model) ->
    if model
      @render()
      @parentView.createAndShowEditView(model)

  render: () ->
     super()
     @renderElements()
     @

  focusEditView: (e) ->
    if (!$(e.target).parents('.dropdown-toggle').length && !$(e.target).hasClass('dropdown-toggle'))
      @parentView.createAndShowEditView(@model)

  focusSubelement: (e) ->
    e.preventDefault();
    e.stopPropagation();
    childUuid = $(e.currentTarget).data('uuid')
    if childUuid
      @parentView.createAndShowEditView(@parentView.modelByUuid(childUuid))
    # else
    #   @parentView.createAndShowEditView(@model)

  renderElements: () ->
    _.each @model.get('options.elements'), (element) ->
        model = @parentView.modelByUuid(element.uuid)
        @$el.find('.header-' + element.uuid).html(Formbuilder.templates["view/table_header"]({rf: model, element: element})).css('background-color', model.get(Formbuilder.options.mappings.LABEL_BACKGROUND_COLOR)).data('cid', model.cid)
        @$el.find('.element-' + element.uuid).html(Formbuilder.templates["view/table_element"]({rf: model, element: element})).data('cid', model.cid)
        @$el.find('.total-' + element.uuid).html(Formbuilder.templates["view/table_total"]({rf: model, element: element})).data('cid', model.cid)
    ,@


  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    uuid = $(e.currentTarget).parents('.element').data('uuid')

    if uuid is undefined
      models = _.each @model.get('options.elements'), (element) ->
        @parentView.modelByUuid(element.uuid).destroy()
        true
      , @
      @model.destroy()
      @$el.remove()
    else
      @parentView.modelByUuid(uuid).destroy()
      @model.set('options.elements', _.filter @model.get('options.elements'), (destroyedElement) -> destroyedElement.uuid != uuid)
      @render()

  duplicate: ->
    attrs = Formbuilder.helpers.clone(@model.attributes);
    delete attrs['id']
    delete attrs['cid']
    attrs['uuid'] = uuid.v4();
    attrs['label'] += ' Copy'
    elements = attrs['options']['elements']
    attrs['options']['elements'] = []
    attrs = _.extend({}, Formbuilder.helpers.defaultFieldAttrs('table'), attrs)
    @parentView.createField attrs, { position: -1 }
    clonedView = @parentView.viewByUuid(attrs['uuid'])
    clonedTableModel = @parentView.modelByUuid(attrs['uuid'])
    _.each elements, (child) =>
      childModel = @parentView.modelByUuid(child.uuid)
      childattrs = Formbuilder.helpers.clone(childModel);
      delete childattrs['id']
      delete childattrs['cid']
      child.uuid = childattrs['uuid'] = uuid.v4()
      childattrs['parent_uuid'] = attrs['uuid']
      childattrs = _.extend({}, Formbuilder.helpers.defaultFieldAttrs(childattrs['type']), childattrs)
      clonedModel = new FormbuilderModel(childattrs)


      if child.totalColumn
        totalColumnModel = clonedTableModel.createTotalColumnModel(childattrs['uuid'])
        child.totalColumnUuid = totalColumnModel.get('uuid')
      @parentView.collection.add(clonedModel)
      if clonedModel.expression != undefined and clonedModel.get('options.calculation_type')
        clonedModel.expression()
      clonedView.listenTo clonedModel, "change", clonedView.update
      attrs['options']['elements'].push(child)
    clonedView.render()

  @insert: (builder, view, responseField, _, options) ->
    instanceView = builder.viewByUuid(responseField.get('parent_uuid'))
    if instanceView?
      true
    else
      false



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
    super()
    @redraw()
    @renderChildren()
    return @

  #boo
  redraw: ->
    table = @$el.find('.response-field-grid-table').detach()
    @$el.addClass('response-field-' + @model.get(Formbuilder.options.mappings.TYPE))
        .data('cid', @model.cid)
        .data('uuid', @model.get('uuid'))
        .html(Formbuilder.templates["view/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    if table.length == 1
      @$el.find('.response-field-grid-table').replaceWith(table);
    @renderTable()

  # make less gross
  renderTable: ->
    numRows = @model.get('options.num_rows') || 1
    numCols = @model.get('options.num_cols') || 1
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
        subelements = @subelements()
        _.each subelements, (subelement) =>
           grid = @parentView.gridAttr(subelement)
           if grid.row > (numRows - 1) then subelement.destroy()
        table.find('tr').slice(numRows - currentRows).remove()

    if currentCols > numCols
        subelements = @subelements()
        _.each subelements, (subelement) =>
           grid = @parentView.gridAttr(subelement)
           if grid.col > (numCols - 1) then subelement.destroy()
        table.find('tr').find('td:gt('+(numCols - 1)+')').remove()

  renderChildren: ->
    children = @model.get('children') || [];
    _.each children, (child) =>
        grid = child.options.grid
        @createField child, @getSubelement(grid.row, grid.col)


  focusEditView: (e) ->
    if $(e.target).parents('table').length == 0 then  @parentView.createAndShowEditView(@model)

  clear: (e) ->
    e.preventDefault()
    e.stopPropagation()

    cb = =>
      @parentView.handleFormUpdate()
      subelements = @subelements()
      _.each @subelements(), (model) ->
        model.destroy()
        true
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
    attrs = Formbuilder.helpers.clone(@model.attributes);
    delete attrs['id']
    delete attrs['cid']
    attrs['uuid'] = uuid.v4();
    attrs['label'] += ' Copy'
    children = @subelements()
    delete attrs['children']
    @parentView.createField attrs, { position: -1 }

    attrs['children'] = _.map children, (child) =>
      childattrs = Formbuilder.helpers.clone(child.attributes);
      delete childattrs['id']
      delete childattrs['cid']
      delete childattrs['uuid']
      childattrs['parent_uuid'] = attrs['uuid']
      childattrs
      @parentView.createField childattrs, { position: -1 }



  addSubelement: (model) ->
    if @belongsToMe(model) and model.get('label').match(/Copy/)
        grid = @parentView.gridAttr(model)
        label = model.get('label').match(/(.+) Copy/)
        if label != null
          model.attributes.label = label[1] + ' ' + (grid.row + 1)
        else
          model.attributes.label = 'Row: ' + (grid.row + 1) + ', Col: ' + (grid.col + 1)

  removeSubelement: (model) ->
    grid = @parentView.gridAttr(model)
    belongsToMe = @belongsToMe(model)
    if belongsToMe && @getSubelement(grid.row, grid.col).html() == ''
        @getSubelement(grid.row, grid.col).html(Formbuilder.templates["view/element_selector"]({rf: @model}))

  subelements: ->
    @parentView.collection.filter (item) =>
        return @belongsToMe(item)

  belongsToMe: (model) ->
    @parentView.inGrid(model) && model.get('parent_uuid') == @model.get('uuid')

  inlineAdd: (e) ->
    e.preventDefault()
    e.stopPropagation()
    type = $(e.currentTarget).data('type')
    target = $(e.currentTarget).parents('.response-field-grid-cell')
    @createField(type, target)

  getSubelement: (row, col) ->
    row++
    col++
    @$el.find('tr:nth-child('+row+') td:nth-child('+col+')');

  createField: (attrs, target) ->
    if _.isString(attrs)
        attrs = Formbuilder.helpers.defaultFieldAttrs(attrs)
    attrs.options.grid =
        col: target.prop('cellIndex')
        row: target.parents('tr').prop('rowIndex')
    attrs.parent_uuid = @model.get('uuid')
    @parentView.createField attrs, { $appendEl: target }

  @insert: (builder, view, responseField, _, options) ->
    if not options.$appendEl
        row = responseField.get('options.grid.row')
        col = responseField.get('options.grid.col')
        append = builder.wrapperByUuid(responseField.get('parent_uuid'))
        append = append.find('tr:nth-child(' + (row+ 1) + ') td:nth-child(' + (col + 1) + ')')
        if append.length == 1
            options.$appendEl = append
    ViewFieldView.insert(builder, view, responseField, _, options)


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
      eventName = 'change:' + _.nested(Formbuilder.options.mappings, key)
      @listenTo @model, eventName, callback


  render: ->
    @$el.html(Formbuilder.templates[ "edit/base#{if !@model.is_input() then '_non_input' else ''}"]({rf: @model}))
    rivets.bind @$el, { model: @model }
    return @


  reset: ->
    @stopListening()
    @parentView.editView = undefined
    @parentView.createAndShowEditView(@model)

  remove: ->
    @parentView.editView = undefined
    @parentView.$el.find("[data-target=\"#addField\"]").click()
    @stopListening()
    super

  # @todo this should really be on the model, not the view
  addOption: (e) ->
    $el = $(e.currentTarget)
    i = @$el.find('.option').index($el.closest('.option'))
    options = @model.get(Formbuilder.options.mappings.OPTIONS) || []
    newOption = {uuid:uuid.v4(), label: "", checked: false}

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

    unless @model.get(Formbuilder.options.mappings.TYPE) == 'checkboxes' # checkboxes can have multiple options selected
      @$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change')

    @forceRender()

  forceRender: ->
    @model.trigger 'change', @model



class BuilderView extends Backbone.View
  SUBVIEWS: []


  saveFormButton: $()

  events:
    'click .fb-tabs a': 'showTab'
    'click .fb-add-types a': 'addField'
    'mouseover .fb-add-types': 'lockLeftWrapper'
    'mouseout .fb-add-types': 'unlockLeftWrapper'

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
    go = true
    target = $el.data('target')

    if (this.editView && !this.editView.model.isValid())
      go = false;

    if (go || (!go && target == '#editField'))
      $el.closest('li').addClass('active').siblings('li').removeClass('active')
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active')

    @unlockLeftWrapper() unless target == '#editField'

    if target == '#editField' && !@editView && (first_model = @collection.models[0])
      @createAndShowEditView(first_model)

  createView: (responseField) ->
    if responseField.attributes.type == 'grid'
        view = new GridFieldView
          model: responseField
          parentView: @
    else if responseField.attributes.type == 'table'
        view = new TableFieldView
          model: responseField
          parentView: @
    else
        view = new ViewFieldView
          model: responseField
          parentView: @
    view

  insert: (view, responseField, _, options) ->
    inserted = false
    parentModel = responseField.parentModel()
    parentType = if parentModel then parentModel.get('type') else undefined
    type = parentType || responseField.get('type')
    if type == 'grid'
        inserted = GridFieldView.insert(@, view, responseField, _, options)
    else if type == 'table'
        inserted = TableFieldView.insert(@, view, responseField, _, options)

    if not inserted
        inserted = ViewFieldView.insert(@, view, responseField, _, options)
    inserted

  addOne: (responseField, _, options) ->
    view = @createView responseField
    @$responseFields.find('> .ui-draggable').remove();
    if responseField.get('model_only') != true
      @insert(view, responseField, _, options)
    @views[responseField.get('uuid')] = view

  setSortable: ->
    @$responseFields.sortable('destroy') if @$responseFields.hasClass('ui-sortable')
    @$responseFields.sortable
      forcePlaceholderSize: true
      placeholder: 'sortable-placeholder'
      stop: (e, ui) =>
        if ui.item.data('type')
          rf = @collection.create Formbuilder.helpers.defaultFieldAttrs(ui.item.data('type')), {$replaceEl: ui.item}
          @createAndShowEditView(rf)

        @handleFormUpdate()
        return true
      update: (e, ui) =>
        # ensureEditViewScrolled, unless we're updating from the draggable
        @ensureEditViewScrolled() unless ui.item.data('type')

    @setDraggable()

  setDraggable: ->
    $addFieldButtons = @$el.find("[data-type]")

    $addFieldButtons.draggable
      connectToSortable: @$responseFields
      helper: =>
        $helper = $("<div class='response-field-draggable-helper' />")
        $helper.css
          width: @$responseFields.width() # hacky, won't get set without inline style
          height: '80px'

        $helper

  addAll: ->
    @collection.each (item, _, collection) ->
      @addOne.call(@, item, _, {})
    , @
    @setSortable()

  hideShowNoResponseFields: ->
    @$el.find(".fb-no-response-fields")[if @collection.length > 0 then 'hide' else 'show']()

  addField: (e) ->
    type = $(e.currentTarget).data('type')

    @createField Formbuilder.helpers.defaultFieldAttrs(type, {})

  createField: (attrs, options) ->
    rf = @collection.create attrs, options
    @createAndShowEditView(rf)
    @handleFormUpdate()

  createAndShowEditView: (model) ->
    $responseFieldEl = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == model.cid )
    go = true
    if @editView
      if @editView.model.cid is model.cid
        @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()
        @scrollLeftWrapper($responseFieldEl)
        return

      go = @editView.model.isValid()
      if (!go)
        $('.fb-edit-section-conditional-wrapper #warning-message').show();
      else
        @editView.remove()
    if go
      $('.fb-field-wrapper').removeClass('parent')
      $('.fb-option').removeClass('trigger-option')
      $('.fb-field-wrapper').removeClass('editing')
      $responseFieldEl.addClass('editing')

    parent = model.conditionalParent()
    if parent
      selectedTriggers = model.get(Formbuilder.options.mappings.CONDITIONAL_VALUES) || []
      $parentWrapper = @$el.find(".fb-field-wrapper").filter( -> $(@).data('cid') == parent.cid )
      $parentWrapper.addClass('parent')
      $parentWrapper.find('.fb-option')
        .filter(-> uuid = $(@).data('uuid'); $(@).data('uuid') in selectedTriggers)
            .each(-> $(@).addClass('trigger-option'))

    if go
      @editView = new EditFieldView
        model: model
        parentView: @

      $newEditEl = @editView.render().$el
      fieldWrapper = @$el.find(".fb-edit-field-wrapper")
      fieldWrapper.html $newEditEl
      if @inGrid(model) then fieldWrapper.addClass('fb-edit-field-grid') else fieldWrapper.removeClass('fb-edit-field-grid')
      if model.inTable() then $('.spectrum-colorpicker', ".fb-edit-field-wrapper").spectrum({
        allowEmpty: true,
        preferredFormat: 'hex',
        showPalette: true,
        showPaletteOnly: true,
        palette: [
          '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF',
          '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
          '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
          '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
          '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
          '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
          '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
          '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
      })

      @$el.find(".fb-tabs a[data-target=\"#editField\"]").click()

      @scrollLeftWrapper($responseFieldEl)
      attrs = Formbuilder.helpers.defaultFieldAttrs(model.get('type'))
      if attrs.definition.onEdit != undefined
          attrs.definition.onEdit model
      @$el.find("input, textarea, [contenteditable=true]").filter(':visible').first().focus()
    return @


  inGrid: (model) -> @hasParent(model) and model.get('options.grid')

  inTable: (model) -> @hasParent(model) and model.get('options.table')

  hasParent: (model) -> model.get('parent_uuid')

  modelByUuid: (uuid) -> @collection.findWhere {'uuid':uuid}

  wrapperByUuid: (uuid) -> $('.fb-field-wrapper').filter () -> $(@).data('uuid') is uuid

  viewByUuid: (uuid) -> @views[uuid]

  views: {}

  gridAttr: (model) ->
    if @inGrid(model)
        return model.get('options.grid')
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
    @collection.sort()
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
  @attrs: {}
  @instances: []
  @attr: (name, value) ->
    if value != undefined
      Formbuilder.attrs[name] = value
      _.each @instances, (instance) ->
        instance.mainView.reset()
    if Formbuilder.attrs[name] != undefined then Formbuilder.attrs[name] else undefined

  @conditionalFunctionality = true;
  @showReferenceIDFunctionality = false;
  @geolocationFunctionality = true;
  @disableField: (field) ->  @fields[field].enabled = false;


  @helpers:
    defaultFieldAttrs: (type) ->
      attrs = {}
      attrs[Formbuilder.options.mappings.LABEL] = 'Untitled'
      attrs[Formbuilder.options.mappings.TYPE] = type
      attrs[Formbuilder.options.mappings.REQUIRED] = false
      attrs['definition'] = Formbuilder.fields[type]
      attrs['options'] = {}
      Formbuilder.fields[type].defaultAttributes?(attrs, Formbuilder) || attrs

    simple_format: (x) ->
      x?.replace(/\n/g, '<br />')
    clone: (obj) ->
      JSON.parse(JSON.stringify(obj))

  @options:
    BUTTON_CLASS_SELECTOR: 'fb-button btn btn-default'
    BUTTON_CLASS_ADD: 'fb-button btn btn-xs btn-primary'
    BUTTON_CLASS_REMOVE: 'fb-button btn btn-xs btn-danger'
    HTTP_ENDPOINT: ''
    HTTP_METHOD: 'POST'
    AUTOSAVE: false
    CLEAR_FIELD_CONFIRM: false
    ENABLED_FIELDS: ['text','checkbox','dropdown', 'textarea', 'radio', 'date','section', 'signature', 'info', 'grid', 'number', 'table', 'datasource', 'time','geolocation']

    mappings:
      SIZE: 'options.size'
      UNITS: 'options.units'
      LABEL: 'label'
      NAME: 'definition.name'
      TYPE: 'type'
      REQUIRED: 'required'
      ADMIN_ONLY: 'admin_only'
      POPULATE_FROM: 'options.populate_from'
      POPULATE_UUID: 'options.populate_uuid'
      CONDITIONAL_PARENT: 'options.conditional.parent'
      CONDITIONAL_VALUES: 'options.conditional.values'
      CONDITIONAL: 'options.conditional'
      OPTIONS: 'answers'
      DESCRIPTION: 'description'
      INCLUDE_OTHER: 'options.include_other_option'
      INCLUDE_BLANK: 'options.include_blank_option'
      INCLUDE_SCORING: 'is_scored'
      INTEGER_ONLY: 'options.integer_only'
      LABEL_COLOR: 'options.label_color'
      LABEL_BACKGROUND_COLOR: 'options.label_background_color'
      READ_ONLY: 'options.read_only'
      COLUMN_WIDTH: 'options.column_width'
      DEFAULT_TIME: 'options.default_time'
      DEFAULT_DATE: 'options.default_date'
      REFERENCE_ID: 'reference_id'
      NUMERIC:
        CALCULATION_TYPE: 'options.calculation_type'
        CALCULATION_EXPRESSION: 'options.calculation_expression'
        CALCULATION_DISPLAY: 'options.calculation_display'
        TOTAL_SEQUENCE: 'options.total_sequence'
      GRID:
        COLS: 'options.cols',
        NUMCOLS: 'options.num_cols',
        ROWS: 'options.rows',
        NUMROWS: 'options.num_rows',
        FULL_WIDTH: 'options.full_width',
        FIRST_ROW_HEADINGS: 'options.first_row_headings'
      TABLE:
        COLS: 'options.cols',
        NUMCOLS: 'options.num_cols',
        ROWS: 'options.rows',
        INITIALROWS: 'options.initial_rows',
        MAXROWS: 'options.max_rows',
        FULL_WIDTH: 'options.full_width'
        COLUMNTOTALS: 'options.display_column_totals'
        ROWTOTALS: 'options.display_row_totals'
      DATA_SOURCE:
        MULTIPLE: 'options.multiple_selections'
        DATA_SOURCE: 'options.data_source'
        VALUE_TEMPLATE: 'options.value_template'
        REQUIRED_PROPERTIES: 'options.required_properties'
        FILTER: 'options.filter'
        FILTER_VALUES: 'options.filter_values'
        IS_FILTERED: 'options.is_filtered'
      MIN: 'options.min'
      MAX: 'options.max'
      OPTIONS_PER_ROW: 'options.options_per_row'
      MINLENGTH: 'options.minlength'
      MAXLENGTH: 'options.maxlength'
      LENGTH_UNITS: 'options.min_max_length_units'

    change:
      INCLUDE_SCORING: ->
        @reset()
      POPULATE_UUID: ->
        @reset()
      CONDITIONAL_PARENT: ->
        @reset()
      CONDITIONAL_VALUES: ->
        @reset()
      'DATA_SOURCE.DATA_SOURCE': ->
        @reset()
      'DATA_SOURCE.IS_FILTERED': ->
        @reset()
      'DATA_SOURCE.FILTER': ->
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

  isValid: ->
    go = true;
    if ((this.mainView.editView) && !this.mainView.editView.model.isValid())
      go = false;
    return go

  getPayload: ->
    return @mainView.getPayload()


  @registerField: (name, opts) ->
    enabled = true

    fields = Formbuilder.options.ENABLED_FIELDS
    unless _.contains(fields, name)
      enabled = false
    for x in ['view', 'edit']
      opts[x] = if enabled then _.template(opts[x]) else (x) -> ''

    opts.type = name
    opts.enabled = enabled

    Formbuilder.fields[name] = opts

    if opts.element_type == 'non_input'
      Formbuilder.nonInputFields[name] = opts
    else
      Formbuilder.inputFields[name] = opts

  constructor: (opts={}) ->
    _.extend @, Backbone.Events
    args = _.extend opts, {formBuilder: @}
    @attrs = {}
    #Move child elements to end of collection to ensure parent are created first
    partionedData = _(args.bootstrapData || [])
                          .groupBy((i) -> if i.parent_uuid is undefined then 0 else 1)
                          .toArray()
                          .value()
    partionedData = _.reduce(partionedData, (a, i) -> a.concat(i))
    args.bootstrapData = _.map(partionedData, (i) -> _.extend({}, Formbuilder.helpers.defaultFieldAttrs(i.type), i))


    @mainView = new BuilderView args
    @mainView.collection
    Formbuilder.instances.push(@)

#nested mixin
if _.nested is undefined
  _.mixin {'nested': (obj, key) ->
      if obj and key
        obj[key] || _.reduce key.split('.'), (obj, key) ->
            if obj then obj[key] else undefined;
        , obj
      else
        undefined
    }


window.Formbuilder = Formbuilder
window.FormbuilderModel = FormbuilderModel




if module?
  module.exports = Formbuilder
else
  window.Formbuilder = Formbuilder
