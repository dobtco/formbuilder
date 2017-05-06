Formbuilder.registerField 'section',

  name: 'Section'

  order: 10

  element_type: 'non_input'

  view: """
    <label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  edit: """
  <div class="fb-edit-section-header">Details</div>
  <div class="fb-common-wrapper">
  <div class="fb-label-description">
    <input type="text" data-rv-input="model.<%= Formbuilder.options.mappings.LABEL %>">
    <textarea data-rv-input="model.<%= Formbuilder.options.mappings.DESCRIPTION %>" placeholder="Add a longer description to this field">
    </textarea>
  </div>
  </div>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-section"></span> Section Break
  """
