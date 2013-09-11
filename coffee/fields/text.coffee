Formbuilder.registerField 'text',

  view: """
    <input type='text' class='rf-size-<%= rf.get('field_options.size') %>' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class='symbol'><span class='icon-font'></span></span> Text
  """
