(function() {
  var _base;

  if (window.FormBuilder == null) {
    window.FormBuilder = {};
  }

  if ((_base = window.FormBuilder).JST == null) {
    _base.JST = {};
  }

  window.FormBuilder.JST['add_field'] = function(context) {
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
      $o.push("<div class='add-field-types'>\n  <div class='section'>");
      _ref = Screendoor.Backbone.RESPONSE_FIELD_TYPES;
      for (k in _ref) {
        v = _ref[k];
        $o.push("    <a class='btn btn-small' data-backbone-click='addField' data-backbone-params='" + ($e($c(k))) + "'>" + ($c(v)) + "</a>");
      }
      $o.push("  </div>\n  <div class='section'>\n    <div class='section-header'>Non-input fields</div>");
      _ref1 = Screendoor.Backbone.RESPONSE_FIELD_NON_INPUT_TYPES;
      for (k in _ref1) {
        v = _ref1[k];
        $o.push("    <a class='btn btn-small' data-backbone-click='addField' data-backbone-params='" + ($e($c(k))) + "'>" + ($c(v)) + "</a>");
      }
      $o.push("  </div>\n</div>");
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

  window.FormBuilder.JST['edit/address'] = function(context) {
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

  window.FormBuilder.JST['edit/base'] = function(context) {
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
      $o.push("<h4>\n  <span data-rv-text=\"model.label\"></span>\n  <code class='field-type' data-rv-text='model.field_type'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</h4>");
      if (this.response_field.get('field_options.vendor_profile')) {
        $o.push("<div class='alert alert-info'>\n  This field will be pre-filled from the vendor's profile, using the\n  <code>" + (this.response_field.get('key')) + "</code> key.\n</div>");
      }
      $o.push("" + $c(JST['admin_response_field/edit/groups/common']()));
      $o.push("<div class='edit-subtemplate-wrapper'></div>");
      $o.push("" + $c(JST['admin_response_field/edit/pieces/review_this_field']()));
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

  window.FormBuilder.JST['edit/base_non_input'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<h4>\n  <span data-rv-text=\"model.label\"></span>\n  <code class='field-type' data-rv-text='model.field_type'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</h4>\n<div class='edit-subtemplate-wrapper'></div>");
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

  window.FormBuilder.JST['edit/checkboxes'] = function(context) {
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
      $o.push("<label class='header'>Options</label>");
      $o.push("" + $c(JST['admin_response_field/edit/pieces/options']({
        includeOther: true
      })));
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

  window.FormBuilder.JST['edit/date'] = function(context) {
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

  window.FormBuilder.JST['edit/dropdown'] = function(context) {
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
      $o.push("<label class='header'>Options</label>");
      $o.push("" + $c(JST['admin_response_field/edit/pieces/options']({
        includeBlank: true
      })));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/create_labels']()));
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

  window.FormBuilder.JST['edit/email'] = function(context) {
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

  window.FormBuilder.JST['edit/file'] = function(context) {
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

  window.FormBuilder.JST['edit/groups/common'] = function(context) {
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
      $o.push("<label class='header'>" + ($e($c(I18n.t('g.response_field.label')))) + "</label>\n<div class='row-fluid'>\n  <div class='span8'>\n    <input type='text' data-rv-value='model.label'>\n    <textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>\n  </div>\n  <div class='span4'>\n    <label class='checkbox'>");
      $o.push("      " + $e($c(I18n.t('g.response_field.required'))));
      $o.push("      <input type='checkbox' data-rv-checked='model.field_options.required'>\n    </label>\n    <label class='checkbox'>\n      Blind\n      <input type='checkbox' data-rv-checked='model.blind'>\n    </label>\n    <label class='checkbox'>\n      Admin only\n      <input type='checkbox' data-rv-checked='model.admin_only'>\n    </label>\n  </div>\n</div>");
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

  window.FormBuilder.JST['edit/number'] = function(context) {
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
      $o.push("" + $c(JST['admin_response_field/edit/pieces/min_max']()));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/units']()));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/integer_only']()));
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

  window.FormBuilder.JST['edit/paragraph'] = function(context) {
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
      $o.push("" + $c(JST['admin_response_field/edit/pieces/size']()));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/min_max_length']()));
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

  window.FormBuilder.JST['edit/pieces/create_labels'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<label class='header'>Create Labels</label>\n<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.create_labels'>\n  Automatically create labels in the bid review interface based on the response to this field\n</label>");
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

  window.FormBuilder.JST['edit/pieces/integer_only'] = function(context) {
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
      $o.push("<label class='header'>" + ($e($c(I18n.t('g.response_field.integer_only')))) + "</label>\n<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.integer_only'>\n  Only accept integers\n</label>");
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

  window.FormBuilder.JST['edit/pieces/min_max'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<label class='header'>Minimum / Maximum</label>\nAbove\n<input type='text' data-rv-value='model.field_options.min' style='width: 30px'>\n&nbsp;&nbsp;\nBelow\n<input type='text' data-rv-value='model.field_options.max' style='width: 30px'>");
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

  window.FormBuilder.JST['edit/pieces/min_max_length'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<label class='header'>Length Limit</label>\nMin\n<input type='text' data-rv-value='model.field_options.minlength' style='width: 30px'>\n&nbsp;&nbsp;\nMax\n<input type='text' data-rv-value='model.field_options.maxlength' style='width: 30px'>\n&nbsp;&nbsp;\n<select data-rv-value='model.field_options.min_max_length_units' style='width: auto;'>\n  <option value='characters'>characters</option>\n  <option value='words'>words</option>\n</select>");
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

  window.FormBuilder.JST['edit/pieces/options'] = function(context) {
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
      if (this.includeBlank) {
        $o.push("<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.include_blank_option'>");
        $o.push("  " + $e($c(I18n.t('g.response_field.include_blank'))));
        $o.push("</label>");
      }
      $o.push("<div class='option' data-rv-each-option='model.field_options.options'>\n  <input type='checkbox' data-rv-checked='option:checked' data-backbone-click='defaultUpdated'>\n  <input type='text' data-rv-value='option:label' data-backbone-input='forceRender'>\n  <a class='btn btn-mini btn-success' data-backbone-click='addOption' title='Add Option'>\n    <span class='icon-plus-sign'></span>\n  </a>\n  <a class='btn btn-danger btn-mini' data-backbone-click='removeOption' title='Remove Option'>\n    <span class='icon-minus-sign'></span>\n  </a>\n</div>");
      if (this.includeOther) {
        $o.push("<label class='checkbox'>\n  <input type='checkbox' data-rv-checked='model.field_options.include_other_option'>\n  Include \"other\"\n</label>");
      }
      $o.push("<a class='btn btn-primary btn-small' data-backbone-click='addOption'>" + ($e($c(I18n.t('g.response_field.add_option')))) + "</a>");
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

  window.FormBuilder.JST['edit/pieces/review_this_field'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<label class='header'>Rate this field</label>\n<div class='controls'>\n  <label class='checkbox'>\n    <input type='checkbox' data-rv-checked='model.field_options.review_this_field'>\n    Ask reviewers to rate this field\n  </label>\n</div>\n<div class='review-this-field-options' data-rv-show='model.field_options.review_this_field'>\n  <div class='controls rate-by'>\n    <label>Rate by</label>\n    <select data-rv-value='model.field_options.review_this_field_type'>\n      <option value='stars'>Stars</option>\n      <option value='ryg'>Red/Yellow/Green</option>\n      <option value='number'>Number Range</option>\n      <option value='free_response'>Free Response</option>\n    </select>\n  </div>\n  <div class='controls' data-rv-show='model.field_options.review_this_field_type | eq \"number\"'>\n    <label>Max Rating</label>\n    <input type='number' data-rv-value='model.field_options.review_this_field_max' min='1' max='100'>\n  </div>\n  <div class='controls field-description'>\n    <label>Field description</label>\n    <textarea data-rv-value='model.field_options.review_this_field_description' placeholder='e.g. \"Pay careful attention to their grammar in this response.\"'></textarea>\n  </div>\n</div>");
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

  window.FormBuilder.JST['edit/pieces/size'] = function(context) {
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
      $o.push("<label class='header'>" + ($e($c(I18n.t('g.response_field.size')))) + "</label>\n<select data-rv-value='model.field_options.size'>\n  <option value='small'>" + ($e($c(I18n.t('g.response_field.small')))) + "</option>\n  <option value='medium'>" + ($e($c(I18n.t('g.response_field.medium')))) + "</option>\n  <option value='large'>" + ($e($c(I18n.t('g.response_field.large')))) + "</option>\n</select>");
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

  window.FormBuilder.JST['edit/pieces/units'] = function(context) {
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
      $o.push("<label class='header'>" + ($e($c(I18n.t('g.response_field.units')))) + "</label>\n<input type='text' data-rv-value='model.field_options.units'>");
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

  window.FormBuilder.JST['edit/price'] = function(context) {
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

  window.FormBuilder.JST['edit/radio'] = function(context) {
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
      $o.push("<label class='header'>Options</label>");
      $o.push("" + $c(JST['admin_response_field/edit/pieces/options']({
        includeOther: true
      })));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/create_labels']()));
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

  window.FormBuilder.JST['edit/section_break'] = function(context) {
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
      $o.push("<label class='header'>" + ($e($c(I18n.t('g.response_field.label')))) + "</label>\n<div class='row-fluid'>\n  <input type='text' data-rv-value='model.label'>\n  <textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>\n</div>");
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

  window.FormBuilder.JST['edit/text'] = function(context) {
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
      $o.push("" + $c(JST['admin_response_field/edit/pieces/size']()));
      $o.push("" + $c(JST['admin_response_field/edit/pieces/min_max_length']()));
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

  window.FormBuilder.JST['edit/time'] = function(context) {
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

  window.FormBuilder.JST['edit/website'] = function(context) {
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
      $o.push("" + $c(JST['admin_response_field/edit/pieces/size']()));
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
      $o.push("<div class='response-field-save-wrapper'>\n  <button class='btn pull-right' data-backbone-click='saveForm' data-loading-text='" + ($e($c(I18n.t('g.all_changes_saved')))) + "'>");
      $o.push("    " + $e($c(I18n.t('g.save_form'))));
      $o.push("  </button>\n  <div class='clearfix'></div>\n</div>\n<div id='response-field-left-wrapper'>\n  <ul class='nav nav-tabs' id='response-field-tabs'>\n    <li class='active'>\n      <a href='#addField' data-toggle='tab'>" + ($e($c(I18n.t('g.response_field.add_new_field')))) + "</a>\n    </li>\n    <li>\n      <a href='#editField' data-toggle='tab'>" + ($e($c(I18n.t('g.response_field.edit_field')))) + "</a>\n    </li>");
      if (this.options.formOptions) {
        $o.push("    <li>\n      <a href='#formOptions' data-toggle='tab'>" + ($e($c(I18n.t('g.response_field.form_options')))) + "</a>\n    </li>");
      }
      $o.push("  </ul>\n  <div class='tab-content'>\n    <div class='active tab-pane' id='addField'></div>\n    <div class='tab-pane' id='editField'>\n      <div id='edit-response-field-wrapper'></div>\n    </div>");
      if (this.options.formOptions) {
        $o.push("    <div class='tab-pane' id='formOptions'>\n      <label>" + ($e($c(I18n.t('g.response_field.form_description')))) + "</label>\n      <textarea class='textarea-full' data-rv-value='formOptions.form_description'></textarea>\n      <label>" + ($e($c(I18n.t('g.response_field.form_confirmation_message')))) + "</label>\n      <textarea class='textarea-full' data-rv-value='formOptions.form_confirmation_message'></textarea>\n      <span class='help-block'>" + ($e($c(I18n.t('g.response_field.no_confirmation_message')))) + "</span>\n      <label>Submit Button Text</label>\n      <input type='text' data-rv-value='formOptions.submit_button_text'>\n      <span class='help-block'>If left blank, the default is \"Submit\"</span>\n      <div class='response-identifier-wrapper'></div>\n    </div>");
      }
      $o.push("  </div>\n</div>\n<div id='response-field-right-wrapper'>\n  <div id='no-response-fields'>" + ($e($c(I18n.t('g.response_field.none')))) + "</div>\n  <div id='response-fields'></div>\n</div>\n<div class='clearfix'></div>");
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

  window.FormBuilder.JST['response_identifier'] = function(context) {
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
      $o.push("<label>Response Identifier</label>\n<select data-rv-value='formOptions.response_identifier'>\n  <option></option>");
      this.response_fields.each(function(rf) {
        $o.push("  <option value='" + ($e($c(rf.get('id')))) + "'>" + ($e($c(rf.get('label')))) + "</option>");
        return '';
      });
      $o.push("</select>\n<div class='help-block'>If the responder doesn't have a Screendoor account, this field will be used to identify their response.</div>");
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

  window.FormBuilder.JST['view/address'] = function(context) {
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

  window.FormBuilder.JST['view/base'] = function(context) {
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
      $o.push("  " + $c(JST['admin_response_field/view/pieces/label'](this)));
      $o.push("  <div class='subtemplate-wrapper-inner'></div>\n  <div class='clearfix'></div>");
      $o.push("  " + $c(JST['admin_response_field/view/pieces/description'](this)));
      $o.push("</div>\n<div class='actions-wrapper'>\n  <a class='btn btn-mini btn-success' data-backbone-click='duplicate' title='Duplicate Field'>\n    <span class='icon-plus-sign'></span>\n  </a>\n  <a class='btn btn-danger btn-mini' data-backbone-click='clear' title='Remove Field'>\n    <span class='icon-minus-sign'></span>\n  </a>\n</div>");
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

  window.FormBuilder.JST['view/base_non_input'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='subtemplate-wrapper' data-backbone-click='focusEditView'>\n  <div class='cover'></div>\n  <div class='subtemplate-wrapper-inner'></div>\n  <div class='clearfix'></div>\n</div>\n<div class='actions-wrapper'>\n  <a class='btn btn-mini btn-success' data-backbone-click='duplicate' title='Duplicate Field'>\n    <span class='icon-plus-sign'></span>\n  </a>\n  <a class='btn btn-danger btn-mini' data-backbone-click='clear' title='Remove Field'>\n    <span class='icon-minus-sign'></span>\n  </a>\n</div>");
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

  window.FormBuilder.JST['view/checkboxes'] = function(context) {
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

  window.FormBuilder.JST['view/date'] = function(context) {
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

  window.FormBuilder.JST['view/dropdown'] = function(context) {
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

  window.FormBuilder.JST['view/email'] = function(context) {
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

  window.FormBuilder.JST['view/file'] = function(context) {
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

  window.FormBuilder.JST['view/number'] = function(context) {
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

  window.FormBuilder.JST['view/paragraph'] = function(context) {
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

  window.FormBuilder.JST['view/pieces/description'] = function(context) {
    return (function() {
      var $c, $o, _ref;
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
      $o.push("<span class='help-block'>" + ($c((_ref = this.response_field.get('field_options.description')) != null ? _ref.simple_format() : void 0)) + "</span>");
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

  window.FormBuilder.JST['view/pieces/label'] = function(context) {
    return (function() {
      var $c, $o, _ref;
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
      $o.push("<label>\n  <span>" + ($c((_ref = this.response_field.get('label')) != null ? _ref.simple_format() : void 0)) + "</span>");
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

  window.FormBuilder.JST['view/price'] = function(context) {
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

  window.FormBuilder.JST['view/radio'] = function(context) {
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

  window.FormBuilder.JST['view/section_break'] = function(context) {
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

  window.FormBuilder.JST['view/text'] = function(context) {
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

  window.FormBuilder.JST['view/time'] = function(context) {
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

  window.FormBuilder.JST['view/website'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<input class='rf-size-" + (this.response_field.get('field_options.size')) + "' type='text' placeholder='http://'>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(context);
  };

}).call(this);
