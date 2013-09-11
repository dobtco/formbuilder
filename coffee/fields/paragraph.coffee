Formbuilder.registerField 'paragraph',

  view: """
    <textarea class='rf-size-<%= rf.get('field_options.size') %>'></textarea>
  """

  edit: """
    <%= Formbuilder.templates['edit/size']() %>
    <%= Formbuilder.templates['edit/min_max_length']() %>
  """

  addButton: """
    <span class="symbol">&#182;</span> Paragraph
  """
