Formbuilder.registerField 'radio',

  name: 'Radio Button'

  order: 15

  view: """
    <div class="fb-options-per-row-<%- rf.get(Formbuilder.options.mappings.OPTIONS_PER_ROW) %>">
        <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
          <div class="fb-option-wrapper <%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>">
            <label class='fb-option' data-uuid="<%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].uuid %>">
              <input type='radio' <%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick="javascript: return false;" />
              <%- rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
            </label>
          </div>
        <% } %>

        <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
          <div class='fb-option-wrapper other-option'>
            <label class='fb-option'>
              <input type='radio' />
              Other
            </label>

            <input type='text' />
          </div>
        <% } %>
    </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/scoring']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/options']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/options_per_row']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """


  addButton: """
    <span class="fb-icon-radio"></span> Radio Button
  """

  defaultAttributes: (attrs) ->
    # @todo
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
    attrs.options.options_per_row = 1

    attrs
