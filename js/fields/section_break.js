(function() {
  FormBuilder.registerField('section_break', {
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get('label') %></label>\n<p><%= rf.get('field_options.description') %></p>",
    edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-value='model.label' />\n<textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>",
    addButton: "<span class='symbol'><span class='icon-minus'></span></span> Section Break"
  });

}).call(this);
