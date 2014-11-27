Formbuilder.registerField 'table',

  name: 'table'

  order: 0

  element_type: 'non_input'

  view: """
    <label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <%= Formbuilder.templates["view/table_field"]({rf: rf}) %>
    <p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  edit: """
    <div class='fb-edit-section-header'>Details</div>
    <div class='fb-common-wrapper'>
      <div class='fb-label-description'>
        <%= Formbuilder.templates['edit/label_description']({rf: rf}) %>
      </div>
      <div class='fb-clear'></div>
    </div>
    <%= Formbuilder.templates['edit/table_layout']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/table_totals']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-table"></span> Table
  """

  defaultAttributes: (attrs) ->
    attrs.options.initial_rows = 1
    attrs.options.max_rows = null
    attrs.options.full_width = false
    attrs.options.display_column_totals = false
    attrs.options.display_row_totals = false
    attrs.elements = []
    attrs