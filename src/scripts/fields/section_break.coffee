Formbuilder.registerField 'section_break',

  name: 'Section break'

  order: 0

  type: 'non_input'

  view: """
    <label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  edit: """
  <div class="fb-edit-section-header">Label</div>
  <div class="fb-common-wrapper">
  <div class="fb-label-description">
    <input type="text" data-rv-input="model.<%= Formbuilder.options.mappings.LABEL %>">
    <textarea data-rv-input="model.<%= Formbuilder.options.mappings.DESCRIPTION %>" placeholder="Add a longer description to this field">
    </textarea>
  </div>
  </div>
  """

  addButton: """
    <span class="icon-section"></span> Section Break
  """
