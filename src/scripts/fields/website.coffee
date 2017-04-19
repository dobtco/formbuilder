Formbuilder.registerField 'website',

  name: 'Website'

  order: 35

  view: """
    <input type='text' placeholder='http://' />
  """

  edit: """
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-website"></span> Website
  """
