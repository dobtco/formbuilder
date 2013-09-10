(function() {
  FormBuilder.registerField('text', {
    type: 'input',
    view: "<input type='text' class='rf-size-<%= rf.get('field_options.size') %>' />",
    edit: "<%- FormBuilder.views.edit.pieces.size() %>\n<%- FormBuilder.views.edit.pieces.min_max_length() %>",
    addButton: "<span class='symbol'><span class='icon-font'></span></span> Text"
  });

}).call(this);
