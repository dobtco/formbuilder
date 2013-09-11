Formbuilder.registerField 'dropdown',

  view: """
    <select>
      <% if (rf.get('field_options.include_blank_option')) { %>
        <option value=''></option>
      <% } %>

      <% for (i in (rf.get('field_options.options') || [])) { %>
        <option <%= rf.get('field_options.options')[i].checked && 'selected' %>>
          <%= rf.get('field_options.options')[i].label %>
        </option>
      <% } %>
    </select>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']({ includeBlank: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-caret-down"></span></span> Dropdown
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs.field_options.include_blank_option = false

    attrs