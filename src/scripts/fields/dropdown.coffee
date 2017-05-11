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
    <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-dropdown"></span> Dropdown
  """

  defaultAttributes: (attrs) ->
    attrs.answers = [
      uuid: uuid.v4()
      label: "",
      checked: false,
      score: ""
    ,
      uuid: uuid.v4()
      label: "",
      checked: false,
      score: ""
    ]

    attrs.is_scored = false
    attrs.options.include_blank_option = false

    attrs
