(function() {
  FormBuilder.registerField('number', {
    view: "<input type='text' />\n<% if (units = rf.get('field_options.units')) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= FormBuilder.templates.edit.min_max %>\n<%= FormBuilder.templates.edit.units %>\n<%= FormBuilder.templates.edit.integer_only %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-number\">123</span></span> Number"
  });

}).call(this);
