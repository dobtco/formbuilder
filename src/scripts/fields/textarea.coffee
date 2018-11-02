Formbuilder.registerField 'textarea',

  name: 'Paragraph'

  order: 5

  view: """
    <textarea class='rf-size-<%- rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: """
  <%= Formbuilder.templates['edit/populate_from']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-textarea"></span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.options.size = 'small'
    attrs
