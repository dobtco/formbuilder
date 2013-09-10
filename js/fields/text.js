(function() {
  FormBuilder.registerField('text', {
    view: "<input type='text' class='rf-size-<%= rf.get('field_options.size') %>' />",
    edit: "<%= FormBuilder.templates.edit.size %>\n<%= FormBuilder.templates.edit.min_max_length %>",
    addButton: "<span class='symbol'><span class='icon-font'></span></span> Text"
  });

}).call(this);
