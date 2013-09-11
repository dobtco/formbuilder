Formbuilder.registerField 'section_break',

  type: 'non_input'

  view: """
    <label class='section-name'><%= rf.get('label') %></label>
    <p><%= rf.get('field_options.description') %></p>
  """

  edit: """
    <div class='fb-edit-section-header'>Label</div>
    <input type='text' data-rv-input='model.label' />
    <textarea data-rv-input='model.field_options.description' placeholder='Add a longer description to this field'></textarea>
  """

  addButton: """
    <span class='symbol'><span class='icon-minus'></span></span> Section Break
  """
