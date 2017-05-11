Formbuilder.registerField 'file',

  name: 'File'

  order: 55

  view: """
    <canvas />
  """

  edit: """
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-file"></span> File
  """
