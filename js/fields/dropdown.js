(function() {
  FormBuilder.registerField('dropdown', {
    view: "<select>\n  <% if (rf.get('field_options.include_blank_option')) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get('field_options.options') || [])) { %>\n    <option <%= rf.get('field_options.options')[i].checked && 'selected' %>>\n      <%= rf.get('field_options.options')[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= FormBuilder.templates['edit/options']({ includeBlank: true }) %>",
    addButton: "<span class=\"symbol\"><span class=\"icon-caret-down\"></span></span> Dropdown",
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
      attrs.field_options.include_blank_option = false;
      return attrs;
    }
  });

}).call(this);
