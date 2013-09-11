(function() {
  FormBuilder.registerField('radio', {
    view: "<% for (i in (rf.get('field_options.options') || [])) { %>\n  <div>\n    <label>\n      <input type='radio' <%= rf.get('field_options.options')[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get('field_options.options')[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get('field_options.include_other_option')) { %>\n  <div class='other-option'>\n    <label>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= FormBuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-circle-blank\"></span></span> Multiple Choice",
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
