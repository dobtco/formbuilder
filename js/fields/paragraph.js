(function() {
  FormBuilder.registerField('paragraph', {
    view: "<textarea class='rf-size-<%= rf.get('field_options.size') %>'></textarea>",
    edit: "<%= FormBuilder.templates['edit/size']() %>\n<%= FormBuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class=\"symbol\">&#182;</span> Paragraph"
  });

}).call(this);
