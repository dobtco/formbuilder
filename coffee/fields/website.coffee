Formbuilder.registerField 'website',

  order: 35

  view: """
    <input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
  """

  addButton: """
    <span class="symbol"><span class="fa fa-link"></span></span> Website
  """
