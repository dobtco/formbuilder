Formbuilder.registerField 'radio',

  view: """
    <% for (i in (rf.get('field_options.options') || [])) { %>
      <div>
        <label class='fb-option'>
          <input type='radio' <%= rf.get('field_options.options')[i].checked && 'checked' %> onclick="javascript: return false;" />
          <%= rf.get('field_options.options')[i].label %>
        </label>
      </div>
    <% } %>

    <% if (rf.get('field_options.include_other_option')) { %>
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
    <%= Formbuilder.templates['edit/options']({ includeOther: true }) %>
  """

  addButton: """
    <span class="symbol"><span class="icon-circle-blank"></span></span> Multiple Choice
  """

  defaultAttributes: (attrs) ->
    attrs.field_options.options = [
      label: "",
      checked: false
    ,
      label: "",
      checked: false
    ]

    attrs