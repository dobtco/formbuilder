(function() {
  FormBuilder.registerField('checkboxes', {
    view: "<% for (i in (rf.get('field_options.options') || [])) { %>\n  <div>\n    <label>\n      <input type='checkbox' <%= rf.get('field_options.options')[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get('field_options.options')[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get('field_options.include_other_option')) { %>\n  <div class='other-option'>\n    <label>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= FormBuilder.templates.edit.options({ includeOther: true }) %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-check-empty\"></span></span> Checkboxes",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false
        }, {
          label: "",
          checked: false
        }
      ];
      return attrs;
    }
  });

}).call(this);
