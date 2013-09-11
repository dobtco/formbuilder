FormBuilder.registerField 'number',

  view: """
    <input type='text' />
    <% if (units = rf.get('field_options.units')) { %>
      <%= units %>
    <% } %>
  """

  edit: """
    <%= FormBuilder.templates['edit/min_max']() %>
    <%= FormBuilder.templates['edit/units']() %>
    <%= FormBuilder.templates['edit/integer_only']() %>
  """

  addButton: """
    <span class="symbol"><span class="icon-number">123</span></span> Number
  """
