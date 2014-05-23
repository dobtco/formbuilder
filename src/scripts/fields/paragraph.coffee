Formbuilder.registerField 'paragraph',

  name: 'Paragraph'

  order: 5

  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: ""

  addButton: """
    <span class="fb-icon-paragraph"></span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.size = 'small'
    attrs
