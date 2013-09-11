(function() {
  FormBuilder.registerField('website', {
    view: "<input type='text' class='rf-size-<%= rf.get('field_options.size') %>' placeholder='http://' />",
    edit: "<%= FormBuilder.templates['edit/size']() %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-link\"></span></span> Website"
  });

}).call(this);
