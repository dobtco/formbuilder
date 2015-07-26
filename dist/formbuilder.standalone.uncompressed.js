(function() {
  var Formbuilder, buildModel, classify, optionsForResponseField, sizeMed, validators,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  classify = function(field_type) {
    return "ResponseField" + (_.str.classify(field_type));
  };

  buildModel = function(attrs) {
    return new FormRenderer.Models[classify(attrs.field_type)](attrs);
  };

  optionsForResponseField = function(model) {
    var ref;
    if ((ref = model.field_type) === 'dropdown' || ref === 'checkboxes' || ref === 'radio') {
      return _.map(model.getOptions(), function(opt) {
        return opt.label;
      });
    }
  };

  window.Formbuilder = Formbuilder = Backbone.View.extend({
    events: {
      'click .js-add-field': function() {
        return this.setLeft('add');
      },
      'mouseover .fb_left': 'lockLeftWrapper',
      'mouseout .fb_left': 'unlockLeftWrapper',
      'click .fb_add_field_wrapper a': '_addFieldViaClick',
      'click [data-change-id-level]': function() {
        return Turbolinks.visit(window.location.pathname.replace('/response_form', '/responses'));
      }
    },
    defaults: {
      selector: '[data-formbuilder]'
    },
    initialize: function(options) {
      var j, len, model, ref, rf;
      this.options = $.extend({}, this.defaults, options);
      this.state = new Backbone.Model;
      new Formbuilder.StatusIndicatorController({
        fb: this
      });
      this.setElement($(this.options.selector));
      this.$el.data('formbuilder-instance', this);
      this.fieldsForDeletion = [];
      this.collection = new Formbuilder.Collection(null, {
        parentView: this
      });
      this.collection.bind('add', this._onCollectionAdd, this);
      this.listenTo(this.collection, 'destroy', function(model) {
        if (model.get('id')) {
          this.fieldsForDeletion.push(model.get('id'));
        }
        this.ensureEditPaneScrolled();
        return this._onChange();
      });
      this.render();
      ref = this.options.bootstrapData;
      for (j = 0, len = ref.length; j < len; j++) {
        rf = ref[j];
        model = buildModel(rf);
        this.collection.add(model, {
          sort: false
        });
      }
      this.collection.bind('change add', this._onChange, this);
      this.autosaver = new Autosaver({
        fn: (function(_this) {
          return function(done) {
            var initFieldsForDeletion;
            if (!_this.isValid()) {
              return done();
            }
            _this.collection.sort();
            initFieldsForDeletion = _.clone(_this.fieldsForDeletion);
            return $.ajax({
              url: _this.options.endpoint,
              type: 'put',
              data: JSON.stringify({
                fields: _this.collection.toJSON(),
                fields_marked_for_deletion: initFieldsForDeletion,
                last_updated: _this.options.last_updated
              }),
              contentType: 'application/json',
              complete: function() {
                return done();
              },
              error: function(xhr) {
                var conflict, ref1;
                _this.state.set({
                  hasServerErrors: true
                });
                _this.trigger('refreshStatus');
                conflict = xhr.status === 409;
                DvlFlash('error', ((ref1 = xhr.responseJSON) != null ? ref1.error : void 0) || t('flash.error.generic'), conflict ? 100000000 : void 0);
                if (conflict) {
                  _this.saveDisabled = true;
                  _this.autosaver.clear();
                  return BeforeUnload.disable();
                }
              },
              success: function(data) {
                var datum, l, len1, ref1, ref2, results;
                _this.options.last_updated = data.last_updated;
                _this.state.set({
                  hasServerErrors: false
                });
                _this.trigger('refreshStatus');
                _this.fieldsForDeletion = _.difference(_this.fieldsForDeletion, initFieldsForDeletion);
                ref1 = data.response_fields;
                results = [];
                for (l = 0, len1 = ref1.length; l < len1; l++) {
                  datum = ref1[l];
                  results.push((ref2 = _this.collection.get(datum.cid)) != null ? ref2.set({
                    id: datum.id
                  }, {
                    silent: true
                  }) : void 0);
                }
                return results;
              }
            });
          };
        })(this)
      });
      this.initSortable();
      this.initDraggable();
      this.initBeforeUnload();
      return this.initLeftScroll();
    },
    render: function() {
      var idView;
      this.$el.html(JST['formbuilder/page']({
        view: this
      }));
      if (this.options.identificationFields) {
        idView = new FormRenderer.Views.ResponseFieldIdentification({
          model: new FormRenderer.Models.ResponseFieldIdentification
        });
        this.$el.find('.fb_identification_cover').after(idView.render().$el);
        Formbuilder.disableTabbing(idView.$el);
      }
      this.$fbLeft = this.$el.find('.fb_left');
      this.$leftAdd = this.$el.find('.fb_add_field_wrapper');
      this.$leftEdit = this.$el.find('.fb_edit_field_wrapper');
      this.$responseFields = this.$el.find('.fb_response_fields');
      return this;
    },
    initLeftScroll: function() {
      var scrollHandler;
      scrollHandler = _.debounce((function(_this) {
        return function() {
          var desiredMargin, difference, maxMargin, newMargin, oldMargin, transitionLength;
          if (_this.scrollingPage) {
            return;
          }
          oldMargin = parseFloat(_this.$fbLeft.css('margin-top'));
          desiredMargin = $(window).scrollTop() - _this.$el.offset().top + 60;
          maxMargin = _this.$responseFields.height();
          newMargin = Math.max(0, Math.min(maxMargin, desiredMargin));
          difference = Math.abs(oldMargin - newMargin);
          transitionLength = Math.min(difference * 1.5, 250);
          return _this.$fbLeft.animate({
            'margin-top': newMargin
          }, transitionLength);
        };
      })(this), 100);
      return $(window).on('scroll', (function(_this) {
        return function() {
          if (!_this.leftWrapperLocked) {
            return scrollHandler();
          }
        };
      })(this));
    },
    initBeforeUnload: function() {
      return BeforeUnload.enable({
        "if": (function(_this) {
          return function() {
            return _this.autosaver.isPending() || !_this.isValid();
          };
        })(this),
        cb: (function(_this) {
          return function(url) {
            if (!_this.isValid()) {
              return false;
            }
            return _this.autosaver.ensure(function() {
              return Turbolinks.visit(url);
            });
          };
        })(this)
      });
    },
    initSortable: function() {
      return new Sortable(this.$responseFields[0], {
        group: {
          name: 'responseFields',
          pull: false,
          put: true
        },
        onUpdate: (function(_this) {
          return function(_e) {
            _this._onChange();
            return _this.ensureEditPaneScrolled();
          };
        })(this),
        onAdd: (function(_this) {
          return function(e) {
            _this.addField($(e.item).data('field-type'), {
              $replaceEl: $(e.item)
            });
            return _this._onChange();
          };
        })(this)
      });
    },
    initDraggable: function() {
      var opts;
      opts = {
        group: {
          name: 'responseFields',
          pull: 'clone',
          put: false
        },
        sort: false
      };
      return $('.fb_add_field_section').each(function() {
        return new Sortable(this, opts);
      });
    },
    setLeft: function(addOrEdit) {
      if (addOrEdit === 'edit') {
        this.$leftEdit.show();
        return this.$leftAdd.hide();
      } else {
        this.removeEditPane();
        this.$leftAdd.show();
        return this.$leftEdit.hide();
      }
    },
    lockLeftWrapper: function() {
      return this.leftWrapperLocked = true;
    },
    unlockLeftWrapper: function() {
      return this.leftWrapperLocked = false;
    },
    ensureEditPaneScrolled: function() {
      if (this.editView) {
        return this.scrollToField($(".fb_field_wrapper.editing"));
      }
    },
    scrollToField: function($responseFieldEl) {
      var scrollPos;
      if ($responseFieldEl[0]) {
        this.scrollingPage = true;
        scrollPos = this.$el.offset().top + $responseFieldEl.offset().top - this.$responseFields.offset().top;
        return $.scrollWindowTo(scrollPos, 200, (function(_this) {
          return function() {
            return _this.scrollingPage = false;
          };
        })(this));
      }
    },
    allFields: function() {
      return this.$el.find('.fb_field_wrapper');
    },
    modelEl: function(model) {
      return this.allFields().filter(function(_, el) {
        return $(el).data('cid') === model.cid;
      });
    },
    modelDOMIndex: function(model) {
      return this.allFields().index(this.modelEl(model));
    },
    _onCollectionAdd: function(rf, _, options) {
      var $replacePosition, view;
      rf.set('showOther', true);
      view = new Formbuilder.Views.ViewField({
        model: rf,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position != null) && ($replacePosition = this.$responseFields.find(".fb_field_wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    },
    _addFieldViaClick: function(e) {
      var $editing, position;
      position = ($editing = this.$el.find(".fb_field_wrapper.editing"))[0] ? this.$el.find('.fb_field_wrapper').index($editing) + 1 : void 0;
      return this.addField($(e.currentTarget).data('field-type'), {
        position: position
      });
    },
    addField: function(attrs, options) {
      var model;
      if (typeof attrs === 'string') {
        attrs = Formbuilder.DEFAULT_FIELD_ATTRS(attrs);
      }
      model = buildModel(attrs);
      model.typeUnlocked = true;
      this.collection.add(model, _.extend(options || {}, {
        sort: false
      }));
      this.collection.sort();
      this.collection.validateField(model);
      return this.showEditPane(model);
    },
    removeEditPane: function() {
      var ref;
      if ((ref = this.editView) != null) {
        ref.remove();
      }
      return this.editView = void 0;
    },
    showEditPane: function(model) {
      var $responseFieldEl;
      this.unlockLeftWrapper();
      $responseFieldEl = this.modelEl(model);
      $responseFieldEl.addClass('editing').siblings('.fb_field_wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.setLeft('edit');
          this.scrollToField($responseFieldEl);
          return;
        } else {
          this.editView.remove();
        }
      }
      this.editView = new Formbuilder.Views.EditField({
        model: model,
        parentView: this
      });
      this.$el.find(".fb_edit_field_inner").html(this.editView.render().$el);
      this.setLeft('edit');
      this.$el.find('[data-rv-input="model.label"]').focus();
      this.scrollToField($responseFieldEl);
      return this;
    },
    isValid: function() {
      return this.collection.all(function(m) {
        return m.isValid;
      });
    },
    calculateValidation: function() {
      this.state.set('hasValidationErrors', !this.isValid());
      return this.trigger('refreshStatus');
    },
    _onChange: function() {
      this.autosaver.saveLater();
      return this.trigger('refreshStatus');
    }
  });

  Formbuilder.Views = {};

  Formbuilder.DEFAULT_FIELD_ATTRS = function(field_type) {
    var base;
    return _.extend({
      label: 'Untitled',
      field_type: field_type,
      required: true,
      field_options: {}
    }, (typeof (base = Formbuilder.FIELD_TYPES[field_type]).defaultAttributes === "function" ? base.defaultAttributes() : void 0) || {});
  };

  Formbuilder.DEFAULT_OPTIONS = function() {
    return [
      {
        label: 'Option 1',
        checked: false
      }, {
        label: 'Option 2',
        checked: false
      }
    ];
  };

  Formbuilder.options = {
    BUTTON_CLASS: 'button small'
  };

  Formbuilder.mappings = {
    SIZE: 'field_options.size',
    UNITS: 'field_options.units',
    LABEL: 'label',
    FIELD_TYPE: 'field_type',
    REQUIRED: 'required',
    ADMIN_ONLY: 'admin_only',
    BLIND: 'blind',
    OPTIONS: 'field_options.options',
    COLUMNS: 'field_options.columns',
    COLUMN_TOTALS: 'field_options.column_totals',
    PRESET_VALUES: 'field_options.preset_values',
    DESCRIPTION: 'field_options.description',
    INCLUDE_OTHER: 'field_options.include_other_option',
    INCLUDE_BLANK: 'field_options.include_blank_option',
    INTEGER_ONLY: 'field_options.integer_only',
    MIN: 'field_options.min',
    MAX: 'field_options.max',
    MINLENGTH: 'field_options.minlength',
    MAXLENGTH: 'field_options.maxlength',
    MINROWS: 'field_options.minrows',
    MAXROWS: 'field_options.maxrows',
    LENGTH_UNITS: 'field_options.min_max_length_units',
    DISABLE_CENTS: 'field_options.disable_cents',
    DISABLE_SECONDS: 'field_options.disable_seconds',
    DEFAULT_LAT: 'field_options.default_lat',
    DEFAULT_LNG: 'field_options.default_lng',
    ADDRESS_FORMAT: 'field_options.address_format',
    FILE_TYPES: 'field_options.file_types',
    CONDITIONS: 'field_options.conditions',
    PHONE_FORMAT: 'field_options.phone_format'
  };

  sizeMed = function() {
    return {
      field_options: {
        size: 'medium'
      }
    };
  };

  Formbuilder.FIELD_CATEGORIES = {
    'Inputs': {
      text: {
        name: 'Text',
        icon: 'font',
        defaultAttributes: sizeMed
      },
      paragraph: {
        name: 'Paragraph',
        buttonHtml: "<span class=\"symbol\">&#182;</span> Paragraph",
        defaultAttributes: sizeMed
      },
      checkboxes: {
        name: 'Checkboxes',
        icon: 'check',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS()
            }
          };
        }
      },
      radio: {
        name: 'Multiple Choice',
        icon: 'circle-o',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS()
            }
          };
        }
      },
      date: {
        name: 'Date',
        icon: 'calendar'
      },
      dropdown: {
        name: 'Dropdown',
        icon: 'caret-down',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS(),
              include_blank_option: false
            }
          };
        }
      },
      time: {
        name: 'Time',
        icon: 'clock-o',
        defaultAttributes: function() {
          return {
            field_options: {
              disable_seconds: true
            }
          };
        }
      },
      number: {
        name: 'Numeric',
        buttonHtml: "<span class=\"symbol\">123</span> Numeric"
      },
      phone: {
        name: 'Phone',
        icon: 'phone',
        defaultAttributes: function() {
          return {
            field_options: {
              phone_format: 'us'
            }
          };
        }
      },
      website: {
        name: 'Website',
        icon: 'link'
      },
      email: {
        name: 'Email',
        icon: 'envelope'
      },
      price: {
        name: 'Price',
        icon: 'usd'
      },
      address: {
        name: 'Address',
        icon: 'home'
      },
      file: {
        name: 'File',
        icon: 'cloud-upload'
      },
      table: {
        name: 'Table',
        icon: 'table',
        defaultAttributes: function() {
          return {
            field_options: {
              columns: [
                {
                  label: 'Column 1'
                }, {
                  label: 'Column 2'
                }
              ]
            }
          };
        }
      }
    },
    'Geographic': {
      map_marker: {
        name: 'Map Marker',
        icon: 'map-marker'
      }
    },
    'Non-input': {
      section_break: {
        name: 'Section Break',
        icon: 'minus',
        defaultAttributes: sizeMed
      },
      page_break: {
        name: 'Page Break',
        icon: 'file'
      },
      block_of_text: {
        name: 'Block of Text',
        icon: 'font',
        defaultAttributes: sizeMed
      }
    }
  };

  Formbuilder.FIELD_TYPES = _.extend.apply(this, _.union({}, _.values(Formbuilder.FIELD_CATEGORIES)));

  validators = {
    duplicateColumns: function(model) {
      var colNames;
      if (model.field_type !== 'table') {
        return false;
      }
      colNames = _.map(model.getColumns(), function(col) {
        return col.label;
      });
      return _.uniq(colNames).length !== colNames.length;
    },
    minMaxMismatch: function(model) {
      var max, min;
      if (model.field_type !== 'number') {
        return false;
      }
      min = parseFloat(model.get('field_options.min'));
      max = parseFloat(model.get('field_options.max'));
      if (min && max && min > max) {
        return true;
      }
    },
    minMaxLengthMismatch: function(model) {
      var max, min;
      if (!(model.field_type === 'paragraph' || model.field_type === 'text')) {
        return false;
      }
      min = parseInt(model.get('field_options.minlength'), 10);
      max = parseInt(model.get('field_options.maxlength'), 10);
      if (min && max && min > max) {
        return true;
      }
    },
    minMaxRowsMismatch: function(model) {
      var max, min;
      if (model.field_type !== 'table') {
        return false;
      }
      min = parseInt(model.get('field_options.minrows'), 10);
      max = parseInt(model.get('field_options.maxrows'), 10);
      if (min && max && min > max) {
        return true;
      }
    },
    blankOption: function(model) {
      var ref;
      if ((ref = model.field_type) !== 'radio' && ref !== 'checkboxes' && ref !== 'dropdown') {
        return false;
      }
      return _.any(model.getOptions(), function(opt) {
        return !opt.label;
      });
    },
    blankColumn: function(model) {
      if (model.field_type !== 'table') {
        return false;
      }
      return _.any(model.getColumns(), function(col) {
        return !col.label;
      });
    }
  };

  Formbuilder.Collection = Backbone.Collection.extend({
    initialize: function(_, options) {
      this.parentView = options.parentView;
      this.on('add', this.copyCidToModel);
      this.on('remove', this.removeConditionals);
      this.on('remove change:isValid', (function(_this) {
        return function() {
          return _this.parentView.calculateValidation();
        };
      })(this));
      this.on('change', (function(_this) {
        return function(model) {
          return _this.validateField(model, void 0, model.isValid);
        };
      })(this));
      return this.on('change:field_options.columns change:field_options.columns.*', (function(_this) {
        return function(model) {
          return _this.validateField(model, 'duplicateColumns');
        };
      })(this));
    },
    validateField: function(model, useValidator, silent) {
      var errs, k, validator;
      errs = $.extend({}, model.get('errors'));
      if (useValidator) {
        errs[useValidator] = validators[useValidator](model);
      } else {
        for (k in validators) {
          validator = validators[k];
          errs[k] = validator(model);
        }
      }
      model.validationErrors = errs;
      if (!silent) {
        model.set('errors', errs);
      }
      model.isValid = !_.any(_.values(errs), (function(v) {
        return v;
      }));
      if (!silent) {
        return model.set('isValid', model.isValid);
      }
    },
    comparator: function(model) {
      return this.parentView.modelDOMIndex(model);
    },
    copyCidToModel: function(model) {
      return model.attributes.cid = model.cid;
    },
    input_fields: function() {
      return this.models.filter(function(m) {
        return m.input_field;
      });
    },
    removeConditionals: function(removing) {
      return this.models.forEach((function(_this) {
        return function(m) {
          var newConditions, oldConditions, ref;
          if ((oldConditions = m.get(Formbuilder.mappings.CONDITIONS))) {
            newConditions = _.reject(oldConditions, function(condition) {
              return ("" + condition.response_field_id) === ("" + removing.id);
            });
            if (!_.isEqual(oldConditions, newConditions)) {
              m.set(Formbuilder.mappings.CONDITIONS, newConditions);
              return (ref = _this.parentView.editView) != null ? ref.render() : void 0;
            }
          }
        };
      })(this));
    }
  });

  Formbuilder.Views.ViewField = Backbone.View.extend({
    className: "fb_field_wrapper",
    events: {
      'click .cover': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click [data-hard-remove]': 'hardRemove',
      'click [data-soft-remove]': 'softRemove',
      'click [data-toggle="dropdown"]': 'setEditing'
    },
    initialize: function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      var base;
      if (typeof (base = this.model).setExistingValue === "function") {
        base.setExistingValue(null);
      }
      this.$el.data('cid', this.model.cid).html(JST["formbuilder/view/base"]({
        hasResponses: this.parentView.options.hasResponses,
        model: this.model
      }));
      this.rendererView || (this.rendererView = new FormRenderer.Views[classify(this.model.field_type)]({
        model: this.model,
        showLabels: true
      }));
      this.toggleErrorClass();
      this.$el.append(this.rendererView.render().el);
      Formbuilder.disableTabbing(this.$el);
      this.rendererView.trigger('shown');
      return this;
    },
    toggleErrorClass: function() {
      if (this.model.get('isValid') === false) {
        return this.$el.addClass('has_errors');
      } else {
        return this.$el.removeClass('has_errors');
      }
    },
    focusEditView: function() {
      return this.parentView.showEditPane(this.model);
    },
    clearConfirmMsg: function() {
      if (this.model.input_field) {
        return "Are you sure you want to delete this field? " + "You'll also lose access to any submitted answers to this field.";
      }
    },
    setEditing: function() {
      if (!this.$el.hasClass('editing')) {
        return this.parentView.showEditPane(this.model);
      }
    },
    hardRemove: function() {
      if (this.parentView.options.hasResponses) {
        return $.rails.showConfirmDialog(this.clearConfirmMsg(), $.proxy(this.clear, this));
      } else {
        return this.clear();
      }
    },
    softRemove: function() {
      this.model.set(Formbuilder.mappings.ADMIN_ONLY, true);
      this.model.set(Formbuilder.mappings.REQUIRED, false);
      this.$el.appendTo(this.$el.closest('.fb_response_fields'));
      this.parentView._onChange();
      return this.parentView.ensureEditPaneScrolled();
    },
    clear: function() {
      return this.model.destroy();
    },
    duplicate: function() {
      var attrs, newModel;
      attrs = _.deepClone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return newModel = this.parentView.addField(attrs, {
        position: this.parentView.modelDOMIndex(this.model) + 1
      });
    }
  });

  Formbuilder.Views.EditField = Backbone.View.extend({
    className: "fb_edit_inner",
    events: {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'change .js-change-field-type': 'changeFieldType',
      'click [data-show-modal]': 'showModal',
      'blur [data-rv-input="model.field_options.minlength"]': 'auditMinLength',
      'blur [data-rv-input="model.field_options.maxlength"]': 'auditMaxLength',
      'blur [data-rv-input="model.field_options.min"]': 'auditMin',
      'blur [data-rv-input="model.field_options.max"]': 'auditMax',
      'blur [data-rv-input="model.field_options.minrows"]': 'auditMinRows',
      'blur [data-rv-input="model.field_options.maxrows"]': 'auditMaxRows',
      'blur [data-rv-input^="model.field_options.options."]': 'validateField',
      'blur [data-rv-input^="model.field_options.columns."]': 'validateField',
      'change [data-rv-value="model.field_options.min_max_length_units"]': 'setSizeToRecommendedSize',
      'click .js-add-condition': 'addCondition',
      'click .js-remove-condition': 'removeCondition',
      'click .js-set-checked': 'setChecked'
    },
    initialize: function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, 'destroy', function() {
        this.parentView.removeEditPane();
        return this.parentView.setLeft('add');
      });
      return this.listenTo(this.model, 'change:field_options.conditions.*', (function(_this) {
        return function(m) {
          var i, j, newVal, ref, ref1, results;
          results = [];
          for (i = j = 0, ref = _this.model.getConditions().length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            newVal = (ref1 = _this.conditionValueOptions(i)) != null ? ref1[0] : void 0;
            if (m.hasChanged("field_options.conditions." + i + ".response_field_id")) {
              results.push(_this.setCondition(i, {
                method: _this.conditionMethodsAtIndex(i)[0].key,
                value: newVal
              }));
            } else if (m.hasChanged("field_options.conditions." + i + ".method")) {
              results.push(_this.setCondition(i, {
                value: newVal
              }));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    },
    render: function() {
      var templateName;
      templateName = this.model.input_field ? 'base' : 'base_non_input';
      this.$el.html(JST["formbuilder/edit/" + templateName](this));
      rivets.bind(this.$el, {
        model: this.model
      });
      if (this.model.hasColumnsOrOptions()) {
        new Sortable(this.$el.find('.fb_options')[0], {
          handle: '.fa-reorder',
          onUpdate: $.proxy(this._optionsSorted, this)
        });
      }
      return this;
    },
    _optionsSorted: function() {
      var newOrder;
      newOrder = this.$el.find('.fb_options [data-index]').map(function() {
        return $(this).data('index');
      }).get();
      this.model.orderOptions(newOrder);
      return this.render();
    },
    addOption: function(e) {
      this.model.addOptionOrColumn();
      return this.render();
    },
    removeOption: function(e) {
      var i;
      i = this.$el.find(".js-remove-option").index($(e.currentTarget));
      this.model.removeOptionOrColumn(i);
      return this.render();
    },
    showModal: function(e) {
      var $el, modal;
      modal = new Formbuilder.Views[($(e.currentTarget).data('show-modal')) + "Modal"]({
        model: this.model,
        parentView: this
      });
      $el = modal.render().$el;
      $el.appendTo('body').modal('show');
      return typeof modal.shown === "function" ? modal.shown() : void 0;
    },
    changeFieldType: function(e) {
      var newAttrs, newIdx;
      newAttrs = Formbuilder.DEFAULT_FIELD_ATTRS($(e.currentTarget).val());
      _.extend(newAttrs, _.omit(this.model.attributes, 'field_type', 'field_options'));
      newAttrs.field_options = _.extend({}, newAttrs.field_options, this.model.attributes.field_options);
      delete newAttrs.value;
      newIdx = this.parentView.modelDOMIndex(this.model);
      this.model.set('id', null);
      this.model.destroy();
      return this.parentView.addField(newAttrs, {
        position: newIdx
      });
    },
    isChecked: function(i) {
      return this.model.getOptions()[i].checked;
    },
    setChecked: function(e) {
      var idx, newOpts, newVal;
      idx = $(e.currentTarget).closest('[data-index]').data('index');
      newVal = this.isChecked(idx) ? false : true;
      newOpts = $.extend(true, [], this.model.getOptions());
      if (this.model.field_type === 'checkboxes') {
        newOpts[idx].checked = newVal;
      } else {
        _.each(newOpts, function(o, i) {
          return o.checked = i === idx ? newVal : false;
        });
      }
      this.model.set(this.model.columnOrOptionKeypath(), newOpts.slice(0));
      return this.render();
    },
    validateField: function() {
      return this.parentView.collection.validateField(this.model);
    },
    auditMinLength: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MINLENGTH);
      this.setSizeToRecommendedSize();
      return this.validateField();
    },
    auditMaxLength: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MAXLENGTH);
      return this.validateField();
    },
    auditMin: function() {
      this.normalizeFloat(Formbuilder.mappings.MIN);
      return this.validateField();
    },
    auditMax: function() {
      this.normalizeFloat(Formbuilder.mappings.MAX);
      return this.validateField();
    },
    auditMinRows: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MINROWS);
      return this.validateField();
    },
    auditMaxRows: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MAXROWS);
      return this.validateField();
    },
    normalizePositiveInteger: function(map) {
      var parsed, val;
      val = this.model.get(map);
      parsed = parseInt(val, 10);
      if (_.isNaN(parsed) || parsed < 1) {
        return this.model.unset(map);
      } else {
        return this.model.set(map, "" + parsed);
      }
    },
    normalizeFloat: function(map) {
      var parsed, val;
      val = this.model.get(map);
      parsed = parseFloat(val);
      if (_.isNaN(parsed)) {
        return this.model.unset(map);
      } else {
        return this.model.set(map, "" + parsed);
      }
    },
    setSizeToRecommendedSize: function() {
      var rec;
      if ((rec = this.recommendedParagraphSize())) {
        this.model.set(Formbuilder.mappings.SIZE, rec);
        return this.render();
      }
    },
    recommendedParagraphSize: function() {
      var parsed, words;
      parsed = parseInt(this.model.get(Formbuilder.mappings.MINLENGTH));
      words = this.model.get(Formbuilder.mappings.LENGTH_UNITS) === 'words';
      if ((words && parsed > 60) || (!words && parsed > 1000)) {
        return 'large';
      } else if ((words && parsed > 30) || (!words && parsed > 350)) {
        return 'medium';
      }
    },
    blankCondition: function() {
      var ref, rf;
      rf = this.conditionFieldOptions()[0];
      return {
        action: 'show',
        response_field_id: rf.id,
        method: _.first(this.conditionMethodsForType(rf.field_type)).key,
        value: (ref = optionsForResponseField(rf)) != null ? ref[0] : void 0
      };
    },
    addCondition: function() {
      var conditions;
      conditions = this.model.getConditions().slice(0);
      conditions.push(this.blankCondition());
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions);
      return this.render();
    },
    removeCondition: function(e) {
      var conditions, i;
      i = $(e.currentTarget).data('index');
      conditions = this.model.getConditions().slice(0);
      conditions.splice(i, 1);
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions);
      return this.render();
    },
    conditionField: function(i) {
      var id;
      if ((id = this.model.getConditionAt(i).response_field_id)) {
        return this.parentView.collection.find(function(m) {
          return ("" + m.id) === ("" + id);
        });
      }
    },
    conditionMethod: function(i) {
      return this.model.getConditionAt(i).method;
    },
    conditionFieldOptions: function() {
      var thisIdx;
      thisIdx = this.parentView.collection.indexOf(this.model);
      return this.parentView.collection.filter((function(_this) {
        return function(field, index) {
          return field.input_field && _this.conditionMethodsForType(field.field_type).length && index < thisIdx;
        };
      })(this));
    },
    conditionMethodsForType: function(field_type) {
      return _.filter(Formbuilder.CONDITION_METHODS, function(method) {
        return indexOf.call(method.field_types, field_type) >= 0;
      });
    },
    conditionMethodsAtIndex: function(i) {
      var field_type, ref;
      if ((field_type = (ref = this.conditionField(i)) != null ? ref.field_type : void 0)) {
        return this.conditionMethodsForType(field_type);
      } else {
        return [];
      }
    },
    conditionValueOptions: function(i) {
      return optionsForResponseField(this.conditionField(i));
    },
    canAddConditions: function() {
      return this.conditionFieldOptions().length > 0;
    },
    setCondition: function(i, attrs) {
      var conditions;
      conditions = this.model.getConditions().slice(0);
      _.extend(conditions[i], attrs);
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions, {
        silent: true
      });
      return this.render();
    }
  });

  FormRenderer.Models.ResponseField.prototype.getConditionAt = function(i) {
    return this.getConditions()[i] || {};
  };

  FormRenderer.Models.ResponseField.prototype.columnOrOptionKeypath = function() {
    switch (this.field_type) {
      case 'table':
        return 'field_options.columns';
      case 'checkboxes':
      case 'radio':
      case 'dropdown':
        return 'field_options.options';
    }
  };

  FormRenderer.Models.ResponseField.prototype.hasColumnsOrOptions = function() {
    return !!this.columnOrOptionKeypath();
  };

  FormRenderer.Models.ResponseField.prototype.addOptionOrColumn = function(i) {
    var newOpt, newOpts, opts;
    opts = this.field_type === 'table' ? this.getColumns() : this.getOptions();
    newOpts = opts.slice(0);
    newOpt = {
      label: (this.field_type === 'table' ? 'Column' : 'Option') + " " + (opts.length + 1)
    };
    if (this.field_type !== 'table') {
      newOpt.checked = false;
    }
    newOpts.push(newOpt);
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  FormRenderer.Models.ResponseField.prototype.removeOptionOrColumn = function(i) {
    var newOpts, opts;
    opts = this.get(this.columnOrOptionKeypath());
    newOpts = opts.slice(0);
    newOpts.splice(i, 1);
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  FormRenderer.Models.ResponseField.prototype.orderOptions = function(newOrder) {
    var newOpts, opts;
    opts = this.get(this.columnOrOptionKeypath());
    newOpts = _.sortBy(opts.slice(0), function(_opt, i) {
      return _.indexOf(newOrder, i);
    });
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  Formbuilder.CONDITION_METHODS = [
    {
      key: 'eq',
      label: 'is',
      field_types: ['date', 'dropdown', 'email', 'number', 'paragraph', 'price', 'radio', 'text', 'time', 'website']
    }, {
      key: 'contains',
      label: 'contains',
      field_types: ['checkboxes', 'text', 'paragraph', 'website', 'email', 'address', 'table']
    }, {
      key: 'lt',
      label: 'is less than',
      field_types: ['number', 'price']
    }, {
      key: 'gt',
      label: 'is greater than',
      field_types: ['number', 'price']
    }, {
      key: 'shorter',
      label: 'is shorter than',
      field_types: ['text', 'paragraph']
    }, {
      key: 'longer',
      label: 'is longer than',
      field_types: ['text', 'paragraph']
    }
  ];

  Formbuilder.Views.BaseModal = Backbone.View.extend({
    className: 'modal',
    events: {
      'click button': function() {
        this.save();
        return this.hideAndRemove();
      },
      'hidden.bs.modal': 'remove'
    },
    initialize: function(options) {
      return this.parentView = options.parentView, options;
    },
    hideAndRemove: function() {
      this.$el.modal('hide');
      return this.remove();
    }
  });

  Formbuilder.Views.PresetValuesModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["formbuilder/edit/preset_values_modal"]({
        rf: this.model
      }));
      return this;
    },
    save: function() {
      return this.model.set(Formbuilder.mappings.PRESET_VALUES, this.getValues());
    },
    getValues: function() {
      return _.tap({}, (function(_this) {
        return function(h) {
          var column, k, ref, results;
          ref = _this.model.getColumns();
          results = [];
          for (k in ref) {
            column = ref[k];
            results.push(h[column.label] = _this.$el.find("[data-col=" + k + "]").map(function() {
              return $(this).val();
            }).get());
          }
          return results;
        };
      })(this));
    }
  });

  Formbuilder.Views.DefaultLocationModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["formbuilder/edit/default_location_modal"]({
        rf: this.model
      }));
      this.initMap();
      return this;
    },
    initMap: function() {
      this.$mapEl = this.$el.find('.fb_default_location_modal_map');
      return this.map = L.mapbox.map(this.$mapEl[0], App.MAPBOX_TILE_ID, {
        center: this.model.defaultLatLng() || App.DEFAULT_LAT_LNG,
        zoom: 13
      });
    },
    save: function() {
      this.model.set(Formbuilder.mappings.DEFAULT_LAT, this.map.getCenter().lat.toFixed(7));
      return this.model.set(Formbuilder.mappings.DEFAULT_LNG, this.map.getCenter().lng.toFixed(7));
    },
    shown: function() {
      return this.map._onResize();
    }
  });

  Formbuilder.Views.BulkAddOptionsModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["formbuilder/edit/bulk_add_options_modal"]({
        rf: this.model
      }));
      return this;
    },
    save: function() {
      return this.addOptions();
    },
    addOptions: function() {
      var j, len, opt, options, ref, val;
      val = this.$el.find('textarea').val();
      if (!val) {
        return;
      }
      options = _.reject(this.model.getOptions(), function(o) {
        return !o.label;
      });
      ref = val.split("\n");
      for (j = 0, len = ref.length; j < len; j++) {
        opt = ref[j];
        options.push({
          label: opt,
          checked: false
        });
      }
      this.model.set(Formbuilder.mappings.OPTIONS, options);
      return this.parentView.render();
    }
  });

  Formbuilder.StatusIndicatorController = (function() {
    function StatusIndicatorController(options) {
      _.extend(this, Backbone.Events);
      this.fb = options.fb;
      this.$el = $('.save_status');
      this.$btn = $('.bottom_status_bar_buttons .continue_button');
      this.listenTo(this.fb, 'refreshStatus', this.updateClass);
    }

    StatusIndicatorController.prototype.updateClass = function() {
      this.$el.removeClass('is_error is_saving is_invalid');
      this.$btn.removeClass('disabled');
      if (this.fb.state.get('hasServerErrors')) {
        return this.$el.addClass('is_error');
      } else if (this.fb.state.get('hasValidationErrors')) {
        this.$btn.addClass('disabled');
        return this.$el.addClass('is_invalid');
      } else if (this.fb.autosaver.isPending()) {
        return this.$el.addClass('is_saving');
      }
    };

    return StatusIndicatorController;

  })();

  Formbuilder.disableTabbing = function($el) {
    return $el.find('a, button, :input').attr('tabindex', '-1');
  };

}).call(this);

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/base"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var name;
    
      _print(_safe(JST['formbuilder/edit/common'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/checkboxes'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(typeof JST[name = "formbuilder/edit/fields/" + (this.model.get(Formbuilder.mappings.FIELD_TYPE))] === "function" ? JST[name](this) : void 0));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/conditional'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/base_non_input"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var name;
    
      _print(_safe(typeof JST[name = "formbuilder/edit/fields/" + (this.model.get(Formbuilder.mappings.FIELD_TYPE))] === "function" ? JST[name](this) : void 0));
    
      _print(_safe('\n\n'));
    
      if (this.model.field_type !== 'page_break') {
        _print(_safe('\n  '));
        _print(_safe(JST['formbuilder/edit/conditional'](this)));
        _print(_safe('\n'));
      }
    
      _print(_safe('\n\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/bulk_add_options_modal"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'modal_dialog\'>\n  <div class=\'modal_content\'>\n    <div class=\'modal_header\'>\n      <a class=\'close\' data-dismiss=\'modal\'>&times;</a>\n      <h3>Add options in bulk</h3>\n    </div>\n    <div class=\'modal_body\'>\n      <textarea rows=\'10\'></textarea>\n      <div class=\'form_hint\'>\n        One option per line\n      </div>\n    </div>\n    <div class=\'modal_footer\'>\n      <div class=\'modal_footer_primary\'>\n        <button class=\'button info\'>Add options</button>\n      </div>\n    </div>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/checkboxes"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section fb_edit_section_boxes\'>\n  <label class=\'control\'>\n    <input type=\'checkbox\' data-rv-checked=\'model.'));
    
      _print(Formbuilder.mappings.REQUIRED);
    
      _print(_safe('\' />\n    Required\n  </label>\n\n  <label class=\'control\'>\n    <input type=\'checkbox\' data-rv-checked=\'model.'));
    
      _print(Formbuilder.mappings.ADMIN_ONLY);
    
      _print(_safe('\' />\n    Hidden\n  </label>\n\n  <label class=\'control\'>\n    <input type=\'checkbox\' data-rv-checked=\'model.'));
    
      _print(Formbuilder.mappings.BLIND);
    
      _print(_safe('\' />\n    Blind\n  </label>\n</div>\n\n<p class=\'fb_edit_help\'>\n  <strong>Hidden</strong> fields aren\'t shown to respondents.\n</p>\n\n<p class=\'fb_edit_help\'>\n  <strong>Blind</strong> fields will be hidden during review.\n</p>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/columns"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var i, j, len, option, ref;
    
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <label>Columns</label>\n\n  <div class=\'fb_options\'>\n    '));
    
      ref = this.model.getColumns();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        option = ref[i];
        _print(_safe('\n      <fieldset class=\'option drag_list_item\' data-index="'));
        _print(i);
        _print(_safe('">\n        <span class=\'drag_list_item_box\'>\n          <i class=\'fa fa-reorder drag_list_reorder\'></i>\n          <span class=\'drag_list_item_input\'>\n            <input type="text" data-rv-input="model.field_options.columns.'));
        _print(i);
        _print(_safe('.label" />\n          </span>\n        </span>\n        '));
        if (!(this.model.getColumns().length < 2)) {
          _print(_safe('\n          <a class="js-remove-option drag_list_remove" title="Remove Column"><i class=\'fa fa-minus-circle\'></i></a>\n        '));
        }
        _print(_safe('\n      </fieldset>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'form_error\' data-rv-show=\'model.errors.duplicateColumns\'>You can\'t have columns with duplicate names.</div>\n  <div class=\'form_error\' data-rv-show=\'model.errors.blankColumn\'>Please enter a label for each column.</div>\n\n  <div class=\'fb_bottom_add\'>\n    <a class="js-add-option '));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('">Add column</a>\n  </div>\n\n  <label class=\'control\'>\n    <input type="checkbox" data-rv-checked="model.'));
    
      _print(Formbuilder.mappings.COLUMN_TOTALS);
    
      _print(_safe('" />\n    Display column totals for numeric fields\n  </label>\n</div>\n\n<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz fb_edit_section_num_rows fb_edit_section_between\'>\n  <label># of rows</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <span>Between</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MINROWS);
    
      _print(_safe('" />\n    <span>and</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MAXROWS);
    
      _print(_safe('" />\n  </div>\n</div>\n\n<div class=\'form_error\' data-rv-show=\'model.errors.minMaxRowsMismatch\'>Please enter a maximum larger than the minimum.</div>\n\n<p class=\'fb_edit_help\'>\n  Respondents will be able to add/remove rows within these contraints.\n  You can leave these blank for no limits.\n</p>\n</div>\n\n<hr />\n\n<a class=\''));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('\' data-show-modal=\'PresetValues\'>Define preset values</a>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/common"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/label'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/field_type'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/description'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/conditional"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var condition, i, j, k, l, len, len1, len2, len3, m, method, model, optionLabel, ref, ref1, ref2, ref3, ref4, ref5;
    
      _print(_safe('<hr />\n\n'));
    
      if (this.canAddConditions() || this.model.isConditional()) {
        _print(_safe('\n  <div class=\'fb_edit_section fb_edit_section_conditions\'>\n    <label>Rules</label>\n\n    '));
        ref = this.model.getConditions();
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          condition = ref[i];
          _print(_safe('\n      <div class=\'fb_edit_section_horiz\'>\n        <label>\n          '));
          if (i === 0) {
            _print(_safe('\n            Only show this field if...\n          '));
          } else {
            _print(_safe('\n            And...\n          '));
          }
          _print(_safe('\n        </label>\n\n        <div class=\'fb_edit_section_horiz_content\'>\n          <div class=\'fb_conditional_opt\'>\n            <select data-width="100%" data-rv-value=\'model.'));
          _print(Formbuilder.mappings.CONDITIONS);
          _print(_safe('.'));
          _print(i);
          _print(_safe('.response_field_id\'>\n              '));
          ref1 = this.conditionFieldOptions();
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            model = ref1[k];
            _print(_safe('\n                <option value="'));
            _print(model.id);
            _print(_safe('">'));
            _print(model.get(Formbuilder.mappings.LABEL));
            _print(_safe('</option>\n              '));
          }
          _print(_safe('\n            </select>\n          </div>\n\n          <div class=\'fb_conditional_opt\'>\n            '));
          if (this.conditionField(i)) {
            _print(_safe('\n              <select data-width="100%" data-rv-value=\'model.'));
            _print(Formbuilder.mappings.CONDITIONS);
            _print(_safe('.'));
            _print(i);
            _print(_safe('.method\'>\n                '));
            ref2 = this.conditionMethodsAtIndex(i);
            for (l = 0, len2 = ref2.length; l < len2; l++) {
              method = ref2[l];
              _print(_safe('\n                  <option value="'));
              _print(method.key);
              _print(_safe('">'));
              _print(method.label);
              _print(_safe('</option>\n                '));
            }
            _print(_safe('\n              </select>\n            '));
          }
          _print(_safe('\n          </div>\n\n          <div class=\'fb_conditional_opt\'>\n            '));
          if (this.conditionMethod(i)) {
            _print(_safe('\n              '));
            if ((ref3 = this.conditionField(i).field_type) === 'dropdown' || ref3 === 'checkboxes' || ref3 === 'radio') {
              _print(_safe('\n                <select data-width=\'100%\' data-rv-value="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n                  '));
              ref4 = this.conditionValueOptions(i);
              for (m = 0, len3 = ref4.length; m < len3; m++) {
                optionLabel = ref4[m];
                _print(_safe('\n                    <option value=\''));
                _print(optionLabel);
                _print(_safe('\'>'));
                _print(optionLabel);
                _print(_safe('</option>\n                  '));
              }
              _print(_safe('\n                </select>\n              '));
            } else if ((ref5 = this.conditionMethod(i)) === 'shorter' || ref5 === 'longer') {
              _print(_safe('\n                <div class=\'input_group\'>\n                  <input type=\'text\' data-rv-input="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n                  <span class=\'input_group_text\'>'));
              _print(this.conditionField(i).getLengthValidationUnits());
              _print(_safe('</span>\n                </div>\n              '));
            } else {
              _print(_safe('\n                <input type=\'text\' data-rv-input="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n              '));
            }
            _print(_safe('\n            '));
          }
          _print(_safe('\n          </div>\n        </div>\n      </div>\n\n      <div class=\'fb_condition_remove\'>\n        <a class=\'js-remove-condition\' data-index="'));
          _print(i);
          _print(_safe('">Remove this rule</a>\n      </div>\n\n      <hr />\n    '));
        }
        _print(_safe('\n\n    '));
        if (this.canAddConditions()) {
          _print(_safe('\n      <a class=\''));
          _print(Formbuilder.options.BUTTON_CLASS);
          _print(_safe(' info js-add-condition\'>Add a rule</a>\n    '));
        }
        _print(_safe('\n  </div>\n'));
      } else {
        _print(_safe('\n  <div class=\'fb_edit_section\'>\n    <label>Want to add a rule?</label>\n    <p class=\'fb_edit_help\'>Select another field to show and hide it based on the answer to this one.</p>\n  </div>\n'));
      }
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/default_location"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <a class=\''));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('\' data-show-modal=\'DefaultLocation\'>Set default location</a>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/default_location_modal"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'modal_dialog\'>\n  <div class=\'modal_content\'>\n    <div class=\'modal_header\'>\n      <a class=\'close\' data-dismiss=\'modal\'>&times;</a>\n      <h3>Set default location</h3>\n    </div>\n    <div class=\'modal_body\'>\n      <div class=\'fb_default_location_modal_map\'></div>\n      <p class=\'margin_th\'>Drag the map to set your new default location.</p>\n    </div>\n    <div class=\'modal_footer\'>\n      <div class=\'modal_footer_primary\'>\n        <button class=\'button info\'>Save and close</button>\n      </div>\n    </div>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/description"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section\'>\n  <label>Add a description</label>\n  <textarea data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.DESCRIPTION);
    
      _print(_safe('\'></textarea>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/disable_cents"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <label class=\'control\'>\n    <input type="checkbox" data-rv-checked="model.'));
    
      _print(Formbuilder.mappings.DISABLE_CENTS);
    
      _print(_safe('" />\n    Hide the \'cents\' field\n  </label>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/disable_seconds"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <label class=\'control\'>\n    <input type="checkbox" data-rv-checked="model.'));
    
      _print(Formbuilder.mappings.DISABLE_SECONDS);
    
      _print(_safe('" />\n    Hide the \'seconds\' field\n  </label>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/field_type"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var field, k, ref;
    
      _print(_safe('<div class=\'fb_edit_section\'>\n  '));
    
      if (this.model.typeUnlocked) {
        _print(_safe('\n    <label>Type</label>\n    <select data-width=\'100%\' class=\'js-change-field-type\'>\n      '));
        ref = Formbuilder.FIELD_TYPES;
        for (k in ref) {
          field = ref[k];
          _print(_safe('\n        <option value=\''));
          _print(k);
          _print(_safe('\' '));
          if (this.model.field_type === k) {
            _print(_safe('selected'));
          }
          _print(_safe('>\n          '));
          _print(field.name);
          _print(_safe('\n        </option>\n      '));
        }
        _print(_safe('\n    </select>\n  '));
      } else {
        _print(_safe('\n    <div class=\'label\'>\n      '));
        _print(Formbuilder.FIELD_TYPES[this.model.field_type].name);
        _print(_safe('\n    </div>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/address"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Format</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-width=\'auto\' data-rv-value="model.'));
    
      _print(Formbuilder.mappings.ADDRESS_FORMAT);
    
      _print(_safe('">\n      <option value=\'\'>All fields</option>\n      <option value=\'city_state\'>City and State only</option>\n      <option value=\'city_state_zip\'>City, State and ZIP Code only</option>\n      <option value=\'country\'>Country only</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/block_of_text"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section fb_edit_section_label\'>\n  <label>Text</label>\n  <textarea data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.DESCRIPTION);
    
      _print(_safe('\'></textarea>\n</div>\n\n'));
    
      _print(_safe(JST['formbuilder/edit/field_type'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/size'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/checkboxes"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/options'](_.extend(this, {
        includeOther: true
      }))));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/dropdown"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/options'](_.extend(this, {
        includeBlank: true
      }))));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/file"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Allow users to upload...</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-rv-value="model.'));
    
      _print(Formbuilder.mappings.FILE_TYPES);
    
      _print(_safe('" data-width="70%">\n      <option value=\'\'>Any type of file</option>\n      <option value=\'images\'>Images only</option>\n      <option value=\'audio\'>Audio files only</option>\n      <option value=\'videos\'>Videos only</option>\n      <option value=\'docs\'>Documents only</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/map_marker"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/default_location']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/number"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/min_max']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/units']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/integer_only']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/page_break"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      if (this.model.typeUnlocked) {
        _print(_safe('\n  '));
        _print(_safe(JST['formbuilder/edit/field_type'](this)));
        _print(_safe('\n'));
      } else {
        _print(_safe('\n  <p class=\'fb_edit_help\'>No options available</p>\n'));
      }
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/paragraph"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/size']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/min_max_length']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/phone"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Format</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-width="100%" data-rv-value="model.'));
    
      _print(Formbuilder.mappings.PHONE_FORMAT);
    
      _print(_safe('">\n      <option value="us">US (10-digit)</option>\n      <option value="intl">International</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/price"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/disable_cents']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/radio"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/options'](_.extend(this, {
        includeOther: true
      }))));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/section_break"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/common'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/size'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/table"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/columns'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/text"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/size']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/edit/min_max_length']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/fields/time"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/edit/disable_seconds']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/integer_only"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <label class=\'control\'>\n    <input type=\'checkbox\' data-rv-checked=\'model.'));
    
      _print(Formbuilder.mappings.INTEGER_ONLY);
    
      _print(_safe('\' />\n    Only accept integers\n  </label>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/label"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section fb_edit_section_label\'>\n  <label>Label</label>\n  <input type=\'text\' data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.LABEL);
    
      _print(_safe('\' />\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/min_max"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz fb_edit_section_min_max fb_edit_section_between\'>\n  <label>Min / Max</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <span>Between</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MIN);
    
      _print(_safe('" />\n    <span>and</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MAX);
    
      _print(_safe('" />\n  </div>\n</div>\n\n<div class=\'form_error\' data-rv-show=\'model.errors.minMaxMismatch\'>Please enter a maximum larger than the minimum.</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/min_max_length"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz fb_edit_section_min_max_length fb_edit_section_between\'>\n  <label>Min / Max Length</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <span>Between</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MINLENGTH);
    
      _print(_safe('" />\n    <span>and</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MAXLENGTH);
    
      _print(_safe('" />\n    <select data-rv-value="model.'));
    
      _print(Formbuilder.mappings.LENGTH_UNITS);
    
      _print(_safe('" data-width="100%">\n      <option value="characters">characters</option>\n      <option value="words">words</option>\n    </select>\n  </div>\n</div>\n\n<div class=\'form_error\' data-rv-show=\'model.errors.minMaxLengthMismatch\'>Please enter a maximum length larger than the minimum.</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/options"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var fieldType, i, j, len, option, ref;
    
      fieldType = this.model.field_type === 'checkboxes' ? 'checkbox' : 'radio';
    
      _print(_safe('\n\n<hr />\n\n<div class=\'fb_edit_section\'>\n  <label>Options</div>\n\n  '));
    
      if (this.includeBlank != null) {
        _print(_safe('\n    <div class=\'fb_option_blank\'>\n      <label class=\'control\'>\n        <input type=\'checkbox\' data-rv-checked=\'model.'));
        _print(Formbuilder.mappings.INCLUDE_BLANK);
        _print(_safe('\' />\n        Include blank\n      </label>\n    </div>\n  '));
      }
    
      _print(_safe('\n\n  <div class=\'fb_options\'>\n    '));
    
      ref = this.model.getOptions();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        option = ref[i];
        _print(_safe('\n      <fieldset class=\'option drag_list_item drag_list_item_checkbox\' data-index="'));
        _print(i);
        _print(_safe('">\n        <span class=\'drag_list_item_box\'>\n          <i class=\'fa fa-reorder drag_list_reorder\'></i>\n          <label class="control">\n            <input type="'));
        _print(fieldType);
        _print(_safe('" class=\'js-set-checked\' '));
        _print(this.isChecked(i) ? 'checked' : void 0);
        _print(_safe(' />\n          </label>\n          <span class=\'drag_list_item_input\'>\n            <input type="text" data-rv-input="model.field_options.options.'));
        _print(i);
        _print(_safe('.label" />\n          </span>\n        </span>\n        '));
        if (!(this.model.getOptions().length < 2)) {
          _print(_safe('\n          <a class="js-remove-option drag_list_remove" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n        '));
        }
        _print(_safe('\n      </fieldset>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'form_error\' data-rv-show=\'model.errors.blankOption\'>Please enter text for each option.</div>\n\n  <div class=\'fb_bottom_add\'>\n    <a class="js-add-option button_uppercase align_left"><i class="fa fa-plus-circle"></i> Add an option</a>\n\n    <div class=\'font_smaller align_right\'>\n      <a data-show-modal=\'BulkAddOptions\'>Add in bulk</a>\n    </div>\n  </div>\n\n  '));
    
      if (this.includeOther != null) {
        _print(_safe('\n    <div class="fb_option_other">\n      <label class=\'control\'>\n        <input type=\'checkbox\' data-rv-checked=\'model.'));
        _print(Formbuilder.mappings.INCLUDE_OTHER);
        _print(_safe('\' />\n        Include "other"\n      </label>\n    </div>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/preset_values_modal"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var i, j, k, l, len, len1, len2, len3, m, n, ref, ref1, ref2, ref3;
    
      _print(_safe('<div class=\'modal_dialog\'>\n  <div class=\'modal_content\'>\n    <div class=\'modal_header\'>\n      <a class=\'close\' data-dismiss=\'modal\'>&times;</a>\n      <h3>Preset values</h3>\n    </div>\n    <div class=\'modal_body\'>\n      <p>\n      These cells will be pre-populated when displaying the form, and will not be editable by the user.\n      </p>\n      <table class=\'border border_all\'>\n        <thead>\n          <tr>\n            '));
    
      ref = rf.get(Formbuilder.mappings.COLUMNS) || [];
      for (k = 0, len = ref.length; k < len; k++) {
        i = ref[k];
        _print(_safe('\n              <th>'));
        _print(rf.get(Formbuilder.mappings.COLUMNS)[i].label);
        _print(_safe('</th>\n            '));
      }
    
      _print(_safe('\n          </tr>\n        </thead>\n        <tbody>\n          '));
    
      ref1 = rf.numRows;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        j = ref1[l];
        _print(_safe('\n            <tr>\n              '));
        ref2 = rf.get(Formbuilder.mappings.COLUMNS) || [];
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          i = ref2[m];
          _print(_safe('\n                <td><input type=\'text\' data-col=\''));
          _print(i);
          _print(_safe('\' value=\''));
          _print(rf.getPresetValue(rf.get(Formbuilder.mappings.COLUMNS)[i].label, j));
          _print(_safe('\' /></th>\n              '));
        }
        _print(_safe('\n            </tr>\n          '));
      }
    
      _print(_safe('\n        </tbody>\n        '));
    
      if (rf.get(Formbuilder.mappings.COLUMN_TOTALS)) {
        _print(_safe('\n          <tfoot>\n            <tr>\n              '));
        ref3 = rf.get(Formbuilder.mappings.COLUMNS) || [];
        for (n = 0, len3 = ref3.length; n < len3; n++) {
          i = ref3[n];
          _print(_safe('\n                <td>[total]</td>\n              '));
        }
        _print(_safe('\n            </tr>\n          </tfoot>\n        '));
      }
    
      _print(_safe('\n      </table>\n    </div>\n    <div class=\'modal_footer\'>\n      <div class=\'modal-footer-actions\'>\n        <button class=\'button info\'>Save and close</button>\n      </div>\n    </div>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/size"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Size</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-width="100%" data-rv-value="model.'));
    
      _print(Formbuilder.mappings.SIZE);
    
      _print(_safe('">\n      <option value="small">Small</option>\n      <option value="medium">Medium</option>\n      <option value="large">Large</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/edit/units"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz fb_edit_section_units\'>\n  <label>Units</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.UNITS);
    
      _print(_safe('" />\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/page"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['formbuilder/partials/left_side'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['formbuilder/partials/right_side'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/partials/left_side"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var field, fields, key, ref, sectionName;
    
      _print(_safe('<div class=\'fb_left\'>\n  <div class=\'fb_add_field_wrapper\'>\n    <div class=\'fb_left_header\'>\n      <h4>Add a new field</h4>\n    </div>\n\n    '));
    
      ref = Formbuilder.FIELD_CATEGORIES;
      for (sectionName in ref) {
        fields = ref[sectionName];
        _print(_safe('\n      <h5>'));
        _print(sectionName);
        _print(_safe('</h5>\n      <div class=\'fb_add_field_section\'>\n        '));
        for (key in fields) {
          field = fields[key];
          _print(_safe('\n          <a data-field-type="'));
          _print(key);
          _print(_safe('" class="'));
          _print(Formbuilder.options.BUTTON_CLASS);
          _print(_safe('">\n            '));
          if (field.buttonHtml) {
            _print(_safe('\n              '));
            _print(_safe(field.buttonHtml));
            _print(_safe('\n            '));
          } else {
            _print(_safe('\n              <span class="symbol"><span class="fa fa-'));
            _print(field.icon);
            _print(_safe('"></span></span>\n              '));
            _print(field.name);
            _print(_safe('\n            '));
          }
          _print(_safe('\n          </a>\n        '));
        }
        _print(_safe('\n      </div>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'fb_edit_field_wrapper\' style=\'display:none;\'>\n    <div class=\'fb_left_header\'>\n      <h4>Edit field</h4>\n      <a class=\'js-add-field button small info\'>Add a new field</a>\n    </div>\n\n    <div class=\'fb_edit_field_inner\'></div>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/partials/right_side"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_right\'>\n  <div class=\'fb_identification_field_wrapper\'>\n    <div class=\'fb_identification_cover\'></div>\n    <div class=\'fb_identification_hint\'>\n      '));
    
      if (this.view.options.identificationFields) {
        _print(_safe('\n        Automatically collected for signed-in users.\n      '));
      } else {
        _print(_safe('\n        Since this form doesn\'t collect names or email addresses, responses will be anonymous.\n        You won\'t be able to collect signatures or follow up with respondents.\n      '));
      }
    
      _print(_safe('\n      <a data-change-id-level>Change identification level?</a>\n    </div>\n  </div>\n  <div class=\'fb_response_fields\'></div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/view/base"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'cover\'></div>\n'));
    
      _print(_safe(JST['formbuilder/view/duplicate_remove'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["formbuilder/view/duplicate_remove"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'actions_wrapper\'>\n  <button class="js-duplicate fb_button_success '));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('" title="Duplicate Field"><i class=\'fa fa-plus-circle\'></i></button>\n\n  '));
    
      if (this.hasResponses && this.model.input_field) {
        _print(_safe('\n    <span class=\'dropdown\'>\n      <a class="js-clear fb_button_warn '));
        _print(Formbuilder.options.BUTTON_CLASS);
        _print(_safe('" data-toggle="dropdown" title="Remove field...">\n        <i class=\'fa fa-minus-circle\'></i>\n      </a>\n      <div class=\'dropdown_menu dropdown_right\'>\n        <ul class=\'dropdown_body\'>\n          '));
        if (!this.model.get('admin_only')) {
          _print(_safe('\n            <li><a data-soft-remove>Hide this field</a></li>\n          '));
        }
        _print(_safe('\n          <li><a data-hard-remove>Delete this field and its answers</a></li>\n        </ul>\n      </div>\n    </span>\n  '));
      } else {
        _print(_safe('\n    <a class="js-clear fb_button_warn '));
        _print(Formbuilder.options.BUTTON_CLASS);
        _print(_safe('" data-hard-remove title="Remove field...">\n      <i class=\'fa fa-minus-circle\'></i>\n    </a>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
