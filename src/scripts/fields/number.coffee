Formbuilder.registerField 'number',

  name: 'Number'

  order: 30

  view: """
    <input type='text' />
    <% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>
      <%= units %>
    <% } %>
  """

  edit: ""

  addButton: """
    <span class="icon-number></span> Number
  """
