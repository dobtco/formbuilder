Formbuilder.registerField 'website',

  view: """
    <input type='text' class='rf-size-<%= rf.get('field_options.size') %>' placeholder='http://' />
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-link"></span></span> Website
  """
