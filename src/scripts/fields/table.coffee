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
  """

  addButton: """
    <span class="fb-icon-table"></span> Table
  """

  defaultAttributes: (attrs) ->
    attrs.options.full_width = false
    attrs.childModels = () ->
      elementsUuids = _.pluck @get('options.elements'), 'uuid'
      @collection.filter (model) ->
        _.indexOf(elementsUuids, model.get('uuid')) != -1
      , @

    attrs.elementOptions = (elementUuid) ->
      _.findWhere @get('options.elements'), {uuid:elementUuid}

    attrs.totalColumn = (elementUuid, value) ->
      elements = @get('options.elements')
      if value != undefined
        _.each elements, (element, index) ->
          if element.uuid is elementUuid
            elements[index].totalColumn = value
        @set 'options.elements', elements
      else
        @elementOptions(elementUuid).totalColumn || false

    attrs