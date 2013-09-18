Formbuilder.registerField 'text',

  view: """
    <input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Text
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs
