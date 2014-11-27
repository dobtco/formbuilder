Formbuilder.registerField 'number',

  name: 'Number'

  order: 30

  view: """
    <input type='text' />
    <% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>
      <%= units %>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/integer_only']() %>
    <%= Formbuilder.templates['edit/min_max']() %>
  """
  addButton: """
    <span class="fb-icon-number"></span> Number
  """
