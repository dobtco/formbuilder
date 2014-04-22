Formbuilder.registerField 'dropdown',
  name: 'Dropdown'

  order: 24

  view: """
    <select>
      <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>
        <option value=''></option>
      <% } %>

      <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
        <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </option>
      <% } %>
    </select>
  """

  edit: """
    <%= Formbuilder.templates['edit/scoring']() %>
    <%= Formbuilder.templates['edit/options']({ rf: rf }) %>
  """

  addButton: """
    <span class="icon-dropdown"></span> Dropdown
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false,
      score: false
    ,
      label: "",
      checked: false,
      score: false
    ]

    attrs.field_options.include_blank_option = false

    attrs