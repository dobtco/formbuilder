Formbuilder.registerField 'radio',

  name: 'Radio Button'

  order: 15

  view: """
    <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>
      <div>
        <label class='fb-option'>
          <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick="javascript: return false;" />
          <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>
        </label>
      </div>
    <% } %>

    <% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>
      <div class='other-option'>
        <label class='fb-option'>
          <input type='radio' />
          Other
        </label>

        <input type='text' />
      </div>
    <% } %>
  """

  edit: """
    <%= Formbuilder.templates['edit/scoring']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/options']({ rf: rf }) %>
  """


  addButton: """
    <span class="fb-icon-radio"></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.field_options.options = [
      label: "",
      checked: false,
      score: ""
    ,
      label: "",
      checked: false,
      score: ""
    ]

    attrs.field_options.include_scoring = false

    attrs