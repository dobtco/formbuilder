Formbuilder.registerField 'email',

  view: """
    <input type='text' class='rf-size-<%= rf.get('field_options.size') %>' />
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-envelope-alt"></span></span> Email
  """
