Formbuilder.registerField 'text',

  name: 'Text'

  order: 0

  view: """
    <input type='text' class='rf-size-<%- rf.get(Formbuilder.options.mappings.SIZE) %>'
      <% if (rf.get(Formbuilder.options.mappings.READ_ONLY)) { %>
        readonly="readonly"
      <% } %>
    />
  """

  edit: """
  <%= Formbuilder.templates['edit/inline_image_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/inline_action_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/populate_from']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-text"></span> Text
  """

  defaultAttributes: (attrs) ->
    attrs.options.size = 'small'
    attrs.options.read_only = false
    attrs
