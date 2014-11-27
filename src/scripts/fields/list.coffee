Formbuilder.registerField 'list',

  name: 'List'

  order: 70

  view: """
    <select>
      <option>
         <%= rf.get(Formbuilder.options.mappings.LIST.DATA_SOURCE) %>
      </option>
    </select>
  """

  edit: """
    <%= Formbuilder.templates['edit/list_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-list"></span> List
  """

  defaultAttributes: (attrs, formbuilder) ->
    attrs.options.multiple_selections = false
    attrs.options.data_source = (formbuilder.attr('sources') || [null])[0]
    attrs