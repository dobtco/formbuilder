this["FormBuilder"] = this["FormBuilder"] || {};
this["FormBuilder"]["templates"] = this["FormBuilder"]["templates"] || {};

this["FormBuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.label"></span>\n  <code class=\'field-type\' data-rv-text=\'model.field_type\'></code>\n  <span class=\'icon-arrow-right pull-right\'></span>\n</div>\n' +
((__t = ( FormBuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n\n' +
((__t = ( FormBuilder.all_fields[rf.get('field_type')].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.label"></span>\n  <code class=\'field-type\' data-rv-text=\'model.field_type\'></code>\n  <span class=\'icon-arrow-right pull-right\'></span>\n</div>\n\n' +
((__t = ( FormBuilder.all_fields[rf.get('field_type')].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'db-edit-section-header\'>Label</div>\n\n<div class=\'grid\'>\n  <div class=\'grid-item two_thirds\'>\n    <input type=\'text\' data-rv-input=\'model.label\' />\n    <textarea data-rv-input=\'model.field_options.description\' placeholder=\'Add a longer description to this field\'></textarea>\n  </div>\n  <div class=\'grid-item one_third\'>\n    <label>\n      Required\n      <input type=\'checkbox\' data-rv-checked=\'model.field_options.required\' />\n    </label>\n    <label>\n      Blind\n      <input type=\'checkbox\' data-rv-checked=\'model.field_options.blind\' />\n    </label>\n    <label>\n      Admin only\n      <input type=\'checkbox\' data-rv-checked=\'model.field_options.admin_only\' />\n    </label>\n  </div>\n</div>\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.field_options.integer_only\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-value="model.field_options.min" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-value="model.field_options.max" style="width: 30px" />\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-value="model.field_options.minlength" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-value="model.field_options.maxlength" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.field_options.min_max_length_units" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.field_options.include_blank_option\' />\n    Include blank\n  </label>\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.field_options.options\'>\n  <input type="checkbox" data-rv-checked="option:checked" data-backbone-click="defaultUpdated" />\n  <input type="text" data-rv-value="option:label" data-backbone-input="forceRender" />\n  <a data-backbone-click="addOption" title="Add Option"><i class=\'icon-plus-sign\'></i></a>\n  <a data-backbone-click="removeOption" title="Remove Option"><i class=\'icon-minus-sign\'></i></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.field_options.include_other_option\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<a data-backbone-click="addOption">Add option</a>\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.field_options.size">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["FormBuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-value="model.field_options.units" />\n';

}
return __p
};

this["FormBuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'response-field-save-wrapper\'>\n  <button class=\'js-save-form\' data-loading-text=\'All changes saved\'>Save form</button>\n</div>\n\n<div class=\'fb-left\'>\n  <ul class=\'fb-tabs\'>\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\n    <li><a data-target=\'#editField\'>Edit field</a></li>\n  </ul>\n\n  <div class=\'fb-tab-content\'>\n    <div class=\'fb-tab-pane active\' id=\'addField\'>\n      <div class=\'fb-add-field-types\'>\n        <div class=\'section\'>\n          ';
 for (i in FormBuilder.input_fields) { ;
__p += '\n            <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'">\n              ' +
((__t = ( FormBuilder.input_fields[i].addButton )) == null ? '' : __t) +
'\n            </a>\n          ';
 } ;
__p += '\n        </div>\n\n        <div class=\'section\'>\n          ';
 for (i in FormBuilder.non_input_fields) { ;
__p += '\n            <a data-field-type="' +
((__t = ( i )) == null ? '' : __t) +
'">\n              ' +
((__t = ( FormBuilder.non_input_fields[i].addButton )) == null ? '' : __t) +
'\n            </a>\n          ';
 } ;
__p += '\n        </div>\n      </div>\n    </div>\n\n    <div class=\'fb-tab-pane\' id=\'editField\'>\n      <div id=\'edit-response-field-wrapper\'></div>\n    </div>\n  </div>\n</div>\n\n<div class=\'fb-right\'>\n  <div class=\'fb-no-response-fields\'>No response fields</div>\n  <div class=\'fb-response-fields\'></div>\n</div>\n\n<div class=\'fb-clear\'></div>\n';

}
return __p
};

this["FormBuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\' data-backbone-click=\'focusEditView\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( FormBuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( FormBuilder.all_fields[rf.get('field_type')].view({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( FormBuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( FormBuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["FormBuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\' data-backbone-click=\'focusEditView\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( FormBuilder.all_fields[rf.get('field_type')].view({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( FormBuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["FormBuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>' +
((__t = ( FormBuilder.helpers.simple_format(rf.get('field_options.description')) )) == null ? '' : __t) +
'</span>\n';

}
return __p
};

this["FormBuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a data-backbone-click="duplicate" title="Duplicate Field"><i class=\'icon-plus-sign\'></i></a>\n  <a data-backbone-click="clear" title="Remove Field"><i class=\'icon-minus-sign\'></i></a>\n</div>';

}
return __p
};

this["FormBuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <span>' +
((__t = ( FormBuilder.helpers.simple_format(rf.get('label')) )) == null ? '' : __t) +
'\n  ';
 if (rf.get('field_options.required')) { ;
__p += '\n    <abbr title=\'required\'>*</abbr>\n  ';
 } ;
__p += '\n</label>\n';

}
return __p
};