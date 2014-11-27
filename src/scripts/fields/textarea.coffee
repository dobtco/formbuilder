Formbuilder.registerField 'textarea',

  name: 'Paragraph'

  order: 5

  view: """
    <textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>
  """

  edit: ""

  addButton: """
    <span class="fb-icon-textarea"></span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.options.size = 'small'
    attrs
