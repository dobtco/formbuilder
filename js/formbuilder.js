(function() {
  window.FormBuilder || (window.FormBuilder = {
    all_fields: {},
    input_fields: {},
    non_input_fields: {},
    helpers: {},
    models: {},
    views: {},
    collections: {}
  });

  FormBuilder.templates = {
    view: {
      base: _.template("<div class='subtemplate-wrapper' data-backbone-click='focusEditView'>\n  <div class='cover'></div>\n  <%= FormBuilder.templates.view.label({rf: rf}) %>\n\n  <%= FormBuilder.all_fields[rf.get('field_type')].view({rf: rf}) %>\n\n  <%= FormBuilder.templates.view.description({rf: rf}) %>\n  <%= FormBuilder.templates.view.duplicate_remove({rf: rf}) %>\n</div>"),
      label: _.template("<label>\n  <span><%= FormBuilder.helpers.simple_format(rf.get('label')) %>\n  <% if (rf.get('field_options.required')) { %>\n    <abbr title='required'>*</abbr>\n  <% } %>\n</label>"),
      description: _.template("<span class='help-block'><%= FormBuilder.helpers.simple_format(rf.get('field_options.description')) %></span>"),
      duplicate_remove: _.template("<div class='actions-wrapper'>\n  <a data-backbone-click=\"duplicate\" title=\"Duplicate Field\"><i class='icon-plus-sign'></i></a>\n  <a data-backbone-click=\"clear\" title=\"Remove Field\"><i class='icon-minus-sign'></i></a>\n</div>")
    },
    edit: {
      base: _.template("<div class='fb-field-label'>\n  <span data-rv-text=\"model.label\"></span>\n  <code class='field-type' data-rv-text='model.field_type'></code>\n  <span class='icon-arrow-right pull-right'></span>\n</div>\n<%= FormBuilder.templates.edit.common %>\n\n<%= FormBuilder.all_fields[rf.get('field_type')].edit({rf: rf}) %>"),
      common: "<div class='db-edit-section-header'>Label</div>\n\n<div class='grid'>\n  <div class='grid-item two_thirds'>\n    <input type='text' data-rv-value='model.label' />\n    <textarea data-rv-value='model.field_options.description' placeholder='Add a longer description to this field'></textarea>\n  </div>\n  <div class='grid-item one_third'>\n    <label>\n      Required\n      <input type='checkbox' data-rv-checked='model.field_options.required' />\n    </label>\n    <label>\n      Blind\n      <input type='checkbox' data-rv-checked='model.field_options.blind' />\n    </label>\n    <label>\n      Admin only\n      <input type='checkbox' data-rv-checked='model.field_options.admin_only' />\n    </label>\n  </div>\n</div>",
      size: "<div class='fb-edit-section-header'>Size</div>\n<select data-rv-value=model.field_options.size\">\n  <option value=\"small\">Small</option>\n  <option value=\"medium\">Medium</option>\n  <option value=\"large\">Large</option>\n</select>",
      min_max_length: "<div class='fb-edit-section-header'>Length Limit</div>\n\nMin\n<input type=\"text\" data-rv-value=\"model.field_options.minlength\" style=\"width: 30px\" />\n\n&nbsp;&nbsp;\n\nMax\n<input type=\"text\" data-rv-value=\"model.field_options.maxlength\" style=\"width: 30px\" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value=\"model.field_options.min_max_length_units\" style=\"width: auto;\">\n  <option value=\"characters\">characters</option>\n  <option value=\"words\">words</option>\n</select>",
      min_max: "<div class='fb-edit-section-header'>Minimum / Maximum</div>\n\nAbove\n<input type=\"text\" data-rv-value=\"model.field_options.min\" style=\"width: 30px\" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type=\"text\" data-rv-value=\"model.field_options.max\" style=\"width: 30px\" />",
      units: "<div class='fb-edit-section-header'>Units</div>\n<input type=\"text\" data-rv-value=\"model.field_options.units\" />",
      integer_only: "<div class='fb-edit-section-header'>Integer only</div>\n<label>\n  <input type='checkbox' data-rv-checked='model.field_options.integer_only' />\n  Only accept integers\n</label>",
      options: function(opts) {
        var str;
        str = " <div class='fb-edit-section-header'>Options</div> ";
        if (opts.includeBlank) {
          str += "<label>\n  <input type='checkbox' data-rv-checked='model.field_options.include_blank_option' />\n  Include blank\n</label>";
        }
        str += "<div class='option' data-rv-each-option='model.field_options.options'>\n  <input type=\"checkbox\" data-rv-checked=\"option:checked\" data-backbone-click=\"defaultUpdated\" />\n  <input type=\"text\" data-rv-value=\"option:label\" data-backbone-input=\"forceRender\" />\n  <a data-backbone-click=\"addOption\" title=\"Add Option\"><i class='icon-plus-sign'></i></a>\n  <a data-backbone-click=\"removeOption\" title=\"Remove Option\"><i class='icon-minus-sign'></i></a>\n</div>";
        if (opts.includeOther) {
          str += "<label>\n  <input type='checkbox' data-rv-checked='model.field_options.include_other_option' />\n  Include \"other\"\n</label>";
        }
        str += "<a data-backbone-click=\"addOption\">Add option</a>";
        return str;
      }
    }
  };

  FormBuilder.helpers.defaultFieldAttrs = function(field_type) {
    var attrs, _base;
    attrs = {
      label: "Untitled",
      field_type: field_type,
      field_options: {
        required: true
      }
    };
    return (typeof (_base = FormBuilder.all_fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
  };

  FormBuilder.helpers.simple_format = function(x) {
    return x != null ? x.replace(/\n/g, '<br />') : void 0;
  };

  FormBuilder.registerField = function(name, opts) {
    var x, _i, _len, _ref;
    _ref = ['view', 'edit'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      opts[x] = _.template(opts[x]);
    }
    FormBuilder.all_fields[name] = opts;
    if (opts.type === 'non_input') {
      return FormBuilder.non_input_fields[name] = opts;
    } else {
      return FormBuilder.input_fields[name] = opts;
    }
  };

  FormBuilder.views.view_field = Backbone.View.extend({
    className: "response-field-wrapper",
    initialize: function() {
      this.parentView = this.options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    },
    render: function() {
      this.$el.addClass('response-field-' + this.model.get('field_type')).data('cid', this.model.cid).html(FormBuilder.templates.view["base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    },
    focusEditView: function() {
      return this.parentView.createAndShowEditView(this.model);
    },
    clear: function() {
      this.parentView.handleFormUpdate();
      return this.model.destroy();
    },
    duplicate: function() {
      var attrs;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    }
  });

  FormBuilder.views.edit_field = Backbone.View.extend({
    className: "edit-response-field",
    initialize: function() {
      this.listenTo(this.model, "destroy", this.remove);
      return this.listenTo(this.model, "change:field_options.review_this_field", this.auditReviewThisFieldChanged);
    },
    render: function() {
      this.$el.html(FormBuilder.templates.edit["base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    },
    remove: function() {
      this.options.parentView.editView = void 0;
      this.options.parentView.$el.find("[href=\"#addField\"]").click();
      return Backbone.View.prototype.remove.call(this);
    },
    addOption: function(e, $el) {
      var i, newOption, options;
      i = this.$el.find('.option').index($el.closest('.option'));
      options = this.model.get("field_options.options") || [];
      newOption = {
        label: "",
        checked: false
      };
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      return this.model.set("field_options.options", options);
    },
    removeOption: function(e, $el) {
      var index, options;
      index = this.$el.find("[data-backbone-click=removeOption]").index($el);
      options = this.model.get("field_options.options");
      options.splice(index, 1);
      return this.model.set("field_options.options", options);
    },
    defaultUpdated: function(e, $el) {
      if (this.model.get('field_type') !== 'checkboxes') {
        this.$el.find("[data-backbone-click=defaultUpdated]").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    },
    forceRender: function() {
      return this.model.trigger('change');
    }
  });

  FormBuilder.models.response_field = Backbone.DeepModel.extend({
    sync: function() {},
    indexInDOM: function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".response-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".response-field-wrapper").index($wrapper);
    },
    is_input: function() {
      return FormBuilder.all_fields[this.get('field_type')];
    }
  });

  FormBuilder.collections.response_fields = Backbone.Collection.extend({
    model: FormBuilder.models.response_field,
    comparator: function(model) {
      return model.indexInDOM();
    },
    addCidsToModels: function() {
      return this.each(function(model) {
        return model.attributes.cid = model.cid;
      });
    }
  });

  FormBuilder.main = Backbone.View.extend({
    el: "#formBuilder",
    SUBVIEWS: [],
    initialize: function() {
      this.collection = new FormBuilder.collections.response_fields;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      this.render();
      this.collection.reset(this.options.bootstrapData);
      return this.initAutosave();
    },
    initAutosave: function() {
      var _this = this;
      this.formSaved = true;
      this.saveFormButton = this.$el.find("[data-backbone-click=saveForm]");
      this.saveFormButton.button('loading');
      setInterval(function() {
        return _this.saveForm.call(_this);
      }, 5000);
      return $(window).bind('beforeunload', function() {
        if (_this.formSaved) {
          return void 0;
        } else {
          return 'You have unsaved changes. If you leave this page, you will lose those changes!';
        }
      });
    },
    reset: function() {
      this.$responseFields.html('');
      return this.addAll();
    },
    render: function() {
      var subview, _i, _len, _ref;
      this.$el.html(FormBuilder.JST['page']({
        options: this.options
      }));
      this.$fbLeft = this.$el.find('.fb-left');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      _ref = this.SUBVIEWS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    },
    bindWindowScrollEvent: function() {
      var _this = this;
      return $(window).on('scroll', function() {
        var maxMargin, newMargin;
        if (_this.$fbLeft.data('locked') === true) {
          return;
        }
        newMargin = Math.max(0, $(window).scrollTop());
        maxMargin = _this.$responseFields.height();
        return _this.$fbLeft.css({
          'margin-top': Math.min(maxMargin, newMargin)
        });
      });
    },
    showTab: function(_, $el, target) {
      var first_model;
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      }
    },
    addOne: function(responseField, _, options) {
      var $replacePosition, view;
      view = new FormBuilder.views.view_field({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".response-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    },
    setSortable: function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: function(e, ui) {
          var field_type, pos, rf;
          if (ui.item.is('a')) {
            field_type = ui.item.data('backbone-params');
            pos = $(".response-field-wrapper").index(ui.item.next(".response-field-wrapper"));
            rf = _this.collection.create(FormBuilder.helpers.defaultFieldAttrs(field_type), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          return _this.handleFormUpdate();
        },
        update: function(e, ui) {
          if (!ui.item.hasClass('btn')) {
            return _this.ensureEditViewScrolled();
          }
        }
      });
      return this.setDraggable();
    },
    setDraggable: function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-backbone-click=addField], [data-backbone-click=addExistingField]");
      if ($addFieldButtons.hasClass('ui-draggable')) {
        $addFieldButtons.draggable('destroy');
      }
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: function() {
          var $helper;
          $helper = $("<div class='response-field-draggable-helper' />");
          $helper.css({
            width: _this.$responseFields.width(),
            height: '80px'
          });
          return $helper;
        }
      });
    },
    addAll: function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    },
    hideShowNoResponseFields: function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    },
    addField: function(_, __, field_type) {
      return this.createField(FormBuilder.helpers.defaultFieldAttrs(field_type));
    },
    createField: function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    },
    createAndShowEditView: function(model) {
      var $newEditEl, $responseFieldEl, oldPadding;
      $responseFieldEl = this.$el.find(".response-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').siblings('.response-field-wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-backbone-params=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl, (typeof oldPadding !== "undefined" && oldPadding !== null) && oldPadding);
          return;
        }
        oldPadding = this.$fbLeft.css('padding-top');
        this.editView.remove();
      }
      this.editView = new FormBuilder.views.edit_field({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find("#edit-response-field-wrapper").html($newEditEl);
      this.$el.find(".fb-tabs a[data-backbone-params=\"#editField\"]").click();
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    },
    ensureEditViewScrolled: function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".response-field-wrapper.editing"));
    },
    scrollLeftWrapper: function($responseFieldEl) {
      var _this = this;
      this.unlockLeftWrapper();
      return $.scrollWindowTo($responseFieldEl.offset().top - this.$responseFields.offset().top, 200, function() {
        return _this.lockLeftWrapper();
      });
    },
    lockLeftWrapper: function() {
      return this.$fbLeft.data('locked', true);
    },
    unlockLeftWrapper: function() {
      return this.$fbLeft.data('locked', false);
    },
    handleFormUpdate: function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.button('reset');
    },
    saveForm: function(e) {
      var _ref,
        _this = this;
      if (this.formSaved === true) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.button('loading');
      this.collection.sort();
      this.collection.addCidsToModels();
      this.collection.trigger('batchUpdate');
      return $.ajax({
        url: "/response_fields/batch?" + this.collection.urlParams,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
          response_fields: this.collection.toJSON(),
          form_options: (_ref = this.response_fieldable) != null ? _ref.toJSON() : void 0
        }),
        success: function(data) {
          var datum, _i, _len, _ref1;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref1 = _this.collection.get(datum.cid)) != null) {
              _ref1.set({
                id: datum.id
              });
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    }
  });

}).call(this);
