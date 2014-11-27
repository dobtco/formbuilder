Formbuilder.registerField 'email',

  name: 'Email'

  order: 40

  view: """
    <input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />
  """

  edit: ""

  addButton: """
    <span class="icon-email"></span> Email
  """