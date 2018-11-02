Formbuilder.registerField 'checkbox',
  name: 'Checkboxes'

  order: 10

  view: """
    <div class="fb-options-per-row-<%- rf.get(Formbuilder.options.mappings.OPTIONS_PER_ROW) %>">
        <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
          <div class="fb-option-wrapper">
            <label class='fb-option' data-uuid="<%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].uuid %>">
              <input type='checkbox' <%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick="javascript: return false;" />
              <%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
            </label>
          </div>
        <% } %>

        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
          <div class='other-option'>
            <label class='fb-option'>
              <input type='checkbox' />
              Other
            </label>

            <input type='text' />
          </div>
        <% } %>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/options']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/options_per_row']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-checkbox"></span> Checkboxes
  """

  defaultAttributes: (attrs) ->
    attrs.answers = [
      uuid: uuid.v4()
      label: "",
      checked: false,
      score: false
    ,
      uuid: uuid.v4()
      label: "",
      checked: false,
      score: false
    ]

    attrs.options.options_per_row = 1

    attrs
