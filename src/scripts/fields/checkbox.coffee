Formbuilder.registerField 'checkbox',
  name: 'Checkboxes'

  order: 10

  view: """
    <div class="fb-options-per-row-<%= rf.get(Formbuilder.options.mappings.OPTIONS_PER_ROW) %>">
        <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
          <div class="fb-option-wrapper">
            <label class='fb-option'>
              <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick="javascript: return false;" />
              <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
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
  """

  addButton: """
    <span class="fb-icon-checkbox"></span> Checkboxes
  """

  defaultAttributes: (attrs) ->
    attrs.answers = [
      label: "",
      checked: false,
      score: false
    ,
      label: "",
      checked: false,
      score: false
    ]

    attrs.options.options_per_row = 1

    attrs