Formbuilder.registerField 'table',

  name: 'Table'

  order: 0

  element_type: 'non_input'

  view: """
    <label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <%= Formbuilder.templates["view/table_field"]({rf: rf}) %>
    <p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  edit: """
    <div class='fb-edit-section-header'>Details</div>
    <div class='fb-common-wrapper'>
      <div class='fb-label-description'>
        <%= Formbuilder.templates['edit/label_description']({rf: rf}) %>
      </div>
      <div class='fb-clear'></div>
    </div>
    <label class="checkbox">
      <input type='checkbox' data-rv-checked='model.<%= Formbuilder.options.mappings.GRID.FULL_WIDTH %>' /> Display full width ?
    </label>
  """

  addButton: """
    <span class="fb-icon-table"></span> Table
  """

  defaultAttributes: (attrs) ->
    attrs.options.full_width = false
    attrs.initialize = () ->
      parent = @
      _.each @childModels, (childModel) ->
        childModel.on "change", (model) ->
          if _.nested(model, 'changed.options.column_width') != undefined
            parent.columnWidth(model.get('uuid'), model.get('options.column_width'))
          model


    attrs.childModels = () ->
      elementsUuids = _.pluck @get('options.elements'), 'uuid'
      @collection.filter (model) ->
        _.indexOf(elementsUuids, model.get('uuid')) != -1
      , @

    attrs.elementOptions = (elementUuid) ->
      _.findWhere @get('options.elements'), {uuid:elementUuid}


    attrs.createTotalColumnModel = (parentUuid) ->
      totalColumnModel = new FormbuilderModel(Formbuilder.helpers.defaultFieldAttrs('number'))
      totalColumnModel.set('options.calculation_expression', 'sum(column_uuid_' + parentUuid.replace(/-/g, '_') + ')')
      totalColumnModel.set('model_only', true)
      totalColumnModel.set('parent_uuid', parentUuid)
      @collection.add totalColumnModel
      totalColumnModel

    attrs.columnWidth = (elementUuid, width) ->
      elements = @get('options.elements')
      _.each elements, (element, index) ->
        if element.uuid is elementUuid
          elements[index].columnWidth = width
      ,@

    attrs.totalColumn = (elementUuid, value) ->
      elements = @get('options.elements')
      if value != undefined
        _.each elements, (element, index) ->
          if element.uuid is elementUuid
            if element.totalColumnUuid is undefined
              totalColumnModel = @createTotalColumnModel(element.uuid)
              elements[index].totalColumnUuid = totalColumnModel.get('uuid')
            elements[index].totalColumn = value
        , @

        @set 'options.elements', elements
      else
        if @elementOptions(elementUuid)
          @elementOptions(elementUuid).totalColumn || false
        else
          false


    attrs
