Formbuilder.registerField 'textarea',

  name: 'Paragraph'

  order: 5

  view: """
    <textarea class='rf-size-<%- rf.get(Formbuilder.options.mappings.SIZE) %>'
      <% if (rf.get(Formbuilder.options.mappings.READ_ONLY)) { %>
        readonly="readonly"
      <% } %>
    ></textarea>
  """

  edit: """
  <%= Formbuilder.templates['edit/inline_image_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/inline_action_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/populate_from']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-textarea"></span> Paragraph
  """

  defaultAttributes: (attrs) ->
    attrs.options.size = 'small'
    attrs.options.read_only = false
    attrs
