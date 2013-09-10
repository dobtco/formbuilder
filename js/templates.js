(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/address'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/base'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='fb-field-label'>\n  <span data-rv-text=\"model.label\"></span>\n  <code class='field-type' data-rv-text='model.field_type'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</div>");
      $o.push("" + $c(FormBuilder.JST['edit/groups/common']()));
      $o.push("<div class='edit-subtemplate-wrapper'></div>");
      $o.push("" + $c(FormBuilder.JST['edit/pieces/review_this_field']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/base_non_input'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>\n  <span data-rv-text=\"model.label\"></span>\n  <code class='field-type' data-rv-text='model.field_type'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</div>\n<div class='edit-subtemplate-wrapper'></div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/checkboxes'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/options']({
        includeOther: true
      })));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/date'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/dropdown'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/options']({
        includeBlank: true
      })));
      $o.push("" + $c(FormBuilder.JST['edit/pieces/create_labels']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/email'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/file'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/groups/common'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Label</div>\n<div class='grid'>\n  <div class='grid-item two_thirds'>\n    <input type='text' data-rv-value='model.label'>\n    <textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>\n  </div>\n  <div class='grid-item one_third'>\n    <label class='checkbox'>\n      Required\n      <input type='checkbox' data-rv-checked='model.field_options.required'>\n    </label>\n    <label class='checkbox'>\n      Blind\n      <input type='checkbox' data-rv-checked='model.blind'>\n    </label>\n    <label class='checkbox'>\n      Admin only\n      <input type='checkbox' data-rv-checked='model.admin_only'>\n    </label>\n  </div>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/number'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/min_max']()));
      $o.push("" + $c(FormBuilder.JST['edit/pieces/units']()));
      $o.push("" + $c(FormBuilder.JST['edit/pieces/integer_only']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/paragraph'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/size']()));
      $o.push("" + $c(FormBuilder.JST['edit/pieces/min_max_length']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/create_labels'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Create Labels</div>\n<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.create_labels'>\n  Automatically create labels in the bid review interface based on the response to this field\n</label>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/integer_only'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Integer only</div>\n<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.integer_only'>\n  Only accept integers\n</label>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/min_max'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Minimum / Maximum</div>\nAbove\n<input type='text' data-rv-value='model.field_options.min' style='width: 30px'>\n&nbsp;&nbsp;\nBelow\n<input type='text' data-rv-value='model.field_options.max' style='width: 30px'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/min_max_length'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Length Limit</div>\nMin\n<input type='text' data-rv-value='model.field_options.minlength' style='width: 30px'>\n&nbsp;&nbsp;\nMax\n<input type='text' data-rv-value='model.field_options.maxlength' style='width: 30px'>\n&nbsp;&nbsp;\n<select data-rv-value='model.field_options.min_max_length_units' style='width: auto;'>\n  <option value='characters'>characters</option>\n  <option value='words'>words</option>\n</select>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/options'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Options</div>");
      if (this.includeBlank) {
        $o.push("<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.include_blank_option'>\n  Include blank\n</label>");
      }
      $o.push("<div class='option' data-rv-each-option='model.field_options.options'>\n  <input type='checkbox' data-rv-checked='option:checked' data-backbone-click='defaultUpdated'>\n  <input type='text' data-rv-value='option:label' data-backbone-input='forceRender'>\n  <a class='btn btn-mini btn-success' data-backbone-click='addOption' title='Add Option'>\n    <span class='icon-plus-sign'></span>\n  </a>\n  <a class='btn btn-danger btn-mini' data-backbone-click='removeOption' title='Remove Option'>\n    <span class='icon-minus-sign'></span>\n  </a>\n</div>");
      if (this.includeOther) {
        $o.push("<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.include_other_option'>\n  Include \"other\"\n</label>");
      }
      $o.push("<a class='btn btn-primary btn-small' data-backbone-click='addOption'>Add option</a>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/size'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Size</div>\n<select data-rv-value='model.field_options.size'>\n  <option value='small'>Small</option>\n  <option value='medium'>Medium</option>\n  <option value='large'>Large</option>\n</select>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/pieces/units'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Units</div>\n<input type='text' data-rv-value='model.field_options.units'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/price'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/radio'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/options']({
        includeOther: true
      })));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/section_break'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fb-edit-section-header'>Label</div>\n<div class='row-fluid'>\n  <input type='text' data-rv-value='model.label'>\n  <textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/text'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/size']()));
      $o.push("" + $c(FormBuilder.JST['edit/pieces/min_max_length']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/time'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      return $o.join("\n");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['edita/website'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("" + $c(FormBuilder.JST['edit/pieces/size']()));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['page'] = function(context) {
    return (function() {
      var $c, $e, $o, k, v, _ref, _ref1;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='response-field-save-wrapper'>\n  <button class='btn pull-right' data-backbone-click='saveForm' data-loading-text='All changes saved'>Save form</button>\n  <div class='fb-clear'></div>\n</div>\n<div class='fb-left'>\n  <ul class='fb-tabs'>\n    <li class='active'>\n      <a data-backbone-click='showTab' data-backbone-params='#addField'>Add new field</a>\n    </li>\n    <li>\n      <a data-backbone-click='showTab' data-backbone-params='#editField'>Edit field</a>\n    </li>");
      if (this.options.formOptions) {
        $o.push("    <li>\n      <a>Form options</a>\n    </li>");
      }
      $o.push("  </ul>\n  <div class='fb-tab-content'>\n    <div class='active fb-tab-pane' id='addField'>\n      <div class='fb-add-field-types'>\n        <div class='section'>");
      _ref = FormBuilder.input_fields;
      for (k in _ref) {
        v = _ref[k];
        $o.push("          <a data-backbone-click='addField' data-backbone-params='" + ($e($c(k))) + "'>" + ($c(v.addButton)) + "</a>");
      }
      $o.push("        </div>\n        <div class='section'>\n          <div class='section-header'>Non-input fields</div>");
      _ref1 = FormBuilder.non_input_fields;
      for (k in _ref1) {
        v = _ref1[k];
        $o.push("          <a data-backbone-click='addField' data-backbone-params='" + ($e($c(k))) + "'>" + ($c(v.addButton)) + "</a>");
      }
      $o.push("        </div>\n      </div>\n    </div>\n    <div class='fb-tab-pane' id='editField'>\n      <div id='edit-response-field-wrapper'></div>\n    </div>");
      if (this.options.formOptions) {
        $o.push("    <div class='tab-pane' id='formOptions'>\n      <label>Form description</label>\n      <textarea class='textarea-full' data-rv-value='formOptions.form_description'></textarea>\n      <label>Form confirmation message</label>\n      <textarea class='textarea-full' data-rv-value='formOptions.form_confirmation_message'></textarea>\n      <span class='help-block'>No confirmation message?</span>\n      <label>Submit Button Text</label>\n      <input type='text' data-rv-value='formOptions.submit_button_text'>\n      <span class='help-block'>If left blank, the default is \"Submit\"</span>\n      <div class='response-identifier-wrapper'></div>\n    </div>");
      }
      $o.push("  </div>\n</div>\n<div class='fb-right'>\n  <div class='fb-no-response-fields'>No response fields</div>\n  <div class='fb-response-fields'></div>\n</div>\n<div class='fb-clear'></div>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/address'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='input-line'>\n  <span class='street'>\n    <input type='text'>\n    <label>Address</label>\n  </span>\n</div>\n<div class='input-line'>\n  <span class='city'>\n    <input type='text'>\n    <label>City</label>\n  </span>\n  <span class='state'>\n    <input type='text'>\n    <label>State / Province / Region</label>\n  </span>\n</div>\n<div class='input-line'>\n  <span class='zip'>\n    <input type='text'>\n    <label>Zipcode</label>\n  </span>\n  <span class='country'>\n    <select></select>\n    <label>Country</label>\n  </span>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/base'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='subtemplate-wrapper' data-backbone-click='focusEditView'>\n  <div class='cover'></div>");
      $o.push("  " + $c(FormBuilder.JST['view/pieces/label'](this)));
      $o.push("  <div class='subtemplate-wrapper-inner'></div>\n  <div class='clearfix'></div>");
      $o.push("  " + $c(FormBuilder.JST['view/pieces/description'](this)));
      $o.push("</div>");
      $o.push("" + $c(FormBuilder.JST['view/pieces/duplicate_remove'](this)));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/base_non_input'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='subtemplate-wrapper' data-backbone-click='focusEditView'>\n  <div class='cover'></div>\n  <div class='subtemplate-wrapper-inner'></div>\n  <div class='clearfix'></div>\n</div>");
      $o.push("" + $c(FormBuilder.JST['view/pieces/duplicate_remove'](this)));
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/checkboxes'] = function(context) {
    return (function() {
      var $c, $e, $o, option, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      _ref = this.response_field.get('field_options.options') || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        $o.push("<div>\n  <label class='checkbox'>\n    <input type='checkbox' checked='" + ($e($c(option.checked))) + "' onclick='javascript:return false;'>");
        $o.push("    " + $e($c(option.label)));
        $o.push("  </label>\n</div>");
      }
      if (this.response_field.get('field_options.include_other_option')) {
        $o.push("<div class='other-option'>\n  <label class='checkbox'>\n    <input type='checkbox'>\n    Other\n  </label>\n  <input type='text'>\n</div>");
      }
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/date'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='input-line'>\n  <span class='month'>\n    <input type='text'>\n    <label>MM</label>\n  </span>\n  <span class='above-line'>/</span>\n  <span class='day'>\n    <input type='text'>\n    <label>DD</label>\n  </span>\n  <span class='above-line'>/</span>\n  <span class='year'>\n    <input type='text'>\n    <label>YYYY</label>\n  </span>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/dropdown'] = function(context) {
    return (function() {
      var $c, $e, $o, option, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<select>");
      if (this.response_field.get('field_options.include_blank_option')) {
        $o.push("  <option value=''></option>");
      }
      _ref = this.response_field.get('field_options.options') || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        $o.push("  <option selected='" + ($e($c(option.checked))) + "'>" + ($e($c(option.label))) + "</option>");
      }
      $o.push("</select>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/email'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<input class='rf-size-" + (this.response_field.get('field_options.size')) + "' type='text'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/file'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fileupload fileupload-new'>\n  <div class='input-append'>\n    <div class='span3 uneditable-input'>\n      <span class='fileupload-exists icon-file'></span>\n      <span class='fileupload-preview'></span>\n    </div>\n    <span class='btn btn-file'>\n      <span class='fileupload-new'>Select file</span>\n      <span class='fileupload-exists'>Change</span>\n    </span>\n  </div>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/number'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<div class='" + ($e($c(this.response_field.get('field_options.units') ? 'input-append' : void 0))) + "'>\n  <input class='span3' type='text'>");
      if (this.response_field.get('field_options.units')) {
        $o.push("  <span class='add-on'>" + ($e($c(this.response_field.get('field_options.units')))) + "</span>");
      }
      $o.push("</div>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/paragraph'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<textarea class='rf-size-" + (this.response_field.get('field_options.size')) + "'></textarea>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/pieces/description'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<span class='help-block'>" + ($c(FormBuilder.simple_format(this.response_field.get('field_options.description')))) + "</span>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/pieces/duplicate_remove'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='actions-wrapper'>\n  <a data-backbone-click='duplicate' title='Duplicate Field'>+</a>\n  <a data-backbone-click='clear' title='Remove Field'>-</a>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/pieces/label'] = function(context) {
    return (function() {
      var $c, $o;
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<label>\n  <span>" + ($c(FormBuilder.simple_format(this.response_field.get('label')))) + "</span>");
      if (this.response_field.get('field_options.required')) {
        $o.push("  <abbr title='required'>*</abbr>");
      }
      $o.push("</label>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '');
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/price'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dollars'>\n    <input type='text'>\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text'>\n    <label>Cents</label>\n  </span>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/radio'] = function(context) {
    return (function() {
      var $c, $e, $o, option, _i, _len, _ref;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      _ref = this.response_field.get('field_options.options') || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        $o.push("<div>\n  <label class='radio'>\n    <input type='radio' checked='" + ($e($c(option.checked))) + "' onclick='javascript:return false;'>");
        $o.push("    " + $e($c(option.label)));
        $o.push("  </label>\n</div>");
      }
      if (this.response_field.get('field_options.include_other_option')) {
        $o.push("<div class='other-option'>\n  <label class='radio'>\n    <input type='radio'>\n    Other\n  </label>\n  <input type='text'>\n</div>");
      }
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/section_break'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = function(text, escape) {
        return ("" + text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/\//g, '&#47;').replace(/"/g, '&quot;');
      };
      $c = function(text) {
        switch (text) {
          case null:
          case void 0:
            return '';
          case true:
          case false:
            return '' + text;
          default:
            return text;
        }
      };
      $o = [];
      $o.push("<label class='section-name'>" + ($e($c(this.response_field.get('label')))) + "</label>\n<p>" + ($e($c(this.response_field.get('field_options.description')))) + "</p>");
      return $o.join("\n").replace(/\s(\w+)='true'/mg, ' $1').replace(/\s(\w+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/text'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<input class='rf-size-" + (this.response_field.get('field_options.size')) + "' type='text'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/time'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='input-line'>\n  <span class='hours'>\n    <input type='text'>\n    <label>HH</label>\n  </span>\n  <span class='above-line'>:</span>\n  <span class='minutes'>\n    <input type='text'>\n    <label>MM</label>\n  </span>\n  <span class='above-line'>:</span>\n  <span class='seconds'>\n    <input type='text'>\n    <label>SS</label>\n  </span>\n  <span class='am_pm'>\n    <select>\n      <option>AM</option>\n      <option>PM</option>\n    </select>\n  </span>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);

(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['viewa/website'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<input class='rf-size-" + (this.response_field.get('field_options.size')) + "' type='text' placeholder='http://'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);
