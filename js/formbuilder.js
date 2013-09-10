(function() {
  String.prototype.simple_format = function() {
  return this.replace(/\n/g, '<br />');
};
  var ADD_FIELD_VIEW, EDIT_FIELD_VIEW, RESPONSE_FIELD_LIST, RESPONSE_FIELD_MODEL, RESPONSE_IDENTIFIER_VIEW, VIEW_FIELD_VIEW;

  _.extend(Backbone.View.prototype, {
    onClick: function(e) {
      if ($(e.currentTarget).hasClass('disabled')) {
        return;
      }
      return this.callMethodIfExists($(e.currentTarget).data('backbone-click'), e);
    },
    onSubmit: function(e) {
      e.preventDefault();
      return this.callMethodIfExists($(e.currentTarget).data('backbone-submit'), e);
    },
    onFocus: function(e) {
      return this.callMethodIfExists($(e.currentTarget).data('backbone-focus'), e);
    },
    onInput: function(e) {
      return this.callMethodIfExists($(e.currentTarget).data('backbone-input'), e);
    },
    callMethodIfExists: function(methodName, e) {
      return typeof this[methodName] === "function" ? this[methodName](e, $(e.currentTarget), $(e.currentTarget).data('backbone-params')) : void 0;
    },
    delegateEvents: function(events) {
      var delegateEventSplitter, eventName, key, match, method, selector, _results;
      delegateEventSplitter = /^(\S+)\s*(.*)$/;
      events || (events = _.result(this, "events") || {});
      _.extend(events, {
        "click [data-backbone-click]": "onClick",
        "submit [data-backbone-submit]": "onSubmit",
        "focus [data-backbone-focus]": "onFocus",
        "input [data-backbone-input]": "onInput"
      });
      this.undelegateEvents();
      _results = [];
      for (key in events) {
        method = events[key];
        if (!_.isFunction(method)) {
          method = this[events[key]];
        }
        if (!method) {
          throw new Error("Method \"" + events[key] + "\" does not exist");
        }
        match = key.match(delegateEventSplitter);
        eventName = match[1];
        selector = match[2];
        method = _.bind(method, this);
        eventName += ".delegateEvents" + this.cid;
        if (selector === "") {
          _results.push(this.$el.on(eventName, method));
        } else {
          _results.push(this.$el.on(eventName, selector, method));
        }
      }
      return _results;
    }
  });

  window.FormBuilder || (window.FormBuilder = {});

  FormBuilder.RESPONSE_FIELD_TYPES = {
    text: "<span class='symbol'><span class='icon-font'></span></span> Text",
    paragraph: '<span class="symbol">&#182;</span> Paragraph',
    checkboxes: '<span class="symbol"><span class="icon-check-empty"></span></span> Checkboxes',
    radio: '<span class="symbol"><span class="icon-circle-blank"></span></span> Multiple Choice',
    dropdown: '<span class="symbol"><span class="icon-caret-down"></span></span> Dropdown',
    price: '<span class="symbol"><span class="icon-dollar"></span></span> Price',
    number: '<span class="symbol"><span class="icon-number">123</span></span> Number',
    date: '<span class="symbol"><span class="icon-calendar"></span></span> Date',
    time: '<span class="symbol"><span class="icon-time"></span></span> Time',
    website: '<span class="symbol"><span class="icon-link"></span></span> Website',
    file: '<span class="symbol"><span class="icon-cloud-upload"></span></span> File',
    email: '<span class="symbol"><span class="icon-envelope-alt"></span></span> Email',
    address: '<span class="symbol"><span class="icon-home"></span></span> Address'
  };

  FormBuilder.RESPONSE_FIELD_NON_INPUT_TYPES = {
    section_break: "<span class='symbol'><span class='icon-minus'></span></span> Section Break"
  };

  ADD_FIELD_VIEW = Backbone.View.extend({
    el: "#addField",
    render: function() {
      this.$el.html(FormBuilder.JST['add_field']());
      return this.options.parentView.setDraggable();
    }
  });

  RESPONSE_IDENTIFIER_VIEW = Backbone.View.extend({
    el: ".response-identifier-wrapper",
    initialize: function() {
      this.listenTo(this.options.parentView.collection, 'remove', this.render);
      this.listenTo(this.options.parentView.collection, 'batchUpdate', this.render);
      return this.listenTo(this.options.parentView.collection, 'sync', this.render);
    },
    render: function() {
      this.$el.html(FormBuilder.JST['response_identifier']({
        response_fields: this.options.parentView.collection
      }));
      return rivets.bind(this.$el, {
        formOptions: this.options.parentView.response_fieldable
      });
    }
  });

  VIEW_FIELD_VIEW = Backbone.View.extend({
    className: "response-field-wrapper",
    initialize: function() {
      this.parentView = this.options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    },
    render: function() {
      this.$el.addClass('response-field-' + this.model.get('field_type'));
      this.$el.html(FormBuilder.JST["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        response_field: this.model
      }));
      this.$el.find(".subtemplate-wrapper-inner").html(FormBuilder.JST["view/" + (this.model.get('field_type'))]({
        response_field: this.model
      }));
      this.$el.data('cid', this.model.cid);
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

  EDIT_FIELD_VIEW = Backbone.View.extend({
    className: "edit-response-field",
    initialize: function() {
      this.listenTo(this.model, "destroy", this.remove);
      this.listenTo(this.model, "change:field_options.review_this_field", this.auditReviewThisFieldChanged);
      return this.parentView = this.options.parentView;
    },
    render: function() {
      this.$el.html(FormBuilder.JST["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        response_field: this.model,
        parentView: this.parentView
      }));
      this.$el.find(".edit-subtemplate-wrapper").html(FormBuilder.JST["edit/" + (this.model.get('field_type'))]({
        model: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    },
    remove: function() {
      this.parentView.editView = void 0;
      this.parentView.$el.find("[href=\"#addField\"]").click();
      return Backbone.View.prototype.remove.call(this);
    },
    auditReviewThisFieldChanged: function() {
      if (!this.model.get('field_options.review_this_field')) {
        this.model.attributes.field_options.review_this_field = true;
        if (confirm('Are you sure you want to remove the review field? You will lose all reviews.')) {
          this.model.attributes.field_options.review_this_field = false;
        } else {
          this.model.set('field_options.review_this_field', true);
        }
      }
      if (this.model.get('field_options.review_this_field_type') == null) {
        this.model.set('field_options.review_this_field_type', 'stars');
      }
      if (this.model.get('field_options.review_this_field_max') == null) {
        return this.model.set('field_options.review_this_field_max', 10);
      }
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

  RESPONSE_FIELD_MODEL = Backbone.DeepModel.extend({
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
      return FormBuilder.RESPONSE_FIELD_TYPES[this.get('field_type')];
    }
  });

  RESPONSE_FIELD_LIST = Backbone.Collection.extend({
    model: RESPONSE_FIELD_MODEL,
    comparator: function(model) {
      return model.indexInDOM();
    }
  });

  FormBuilder.formBuilder = Backbone.View.extend({
    el: "#formBuilder",
    SUBVIEWS: [ADD_FIELD_VIEW, RESPONSE_IDENTIFIER_VIEW],
    initialize: function() {
      var subview, _i, _len, _ref,
        _this = this;
      this.collection = new RESPONSE_FIELD_LIST;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.toggleNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      this.editView = void 0;
      this.addingAll = void 0;
      this.render();
      this.collection.reset(this.options.bootstrapData);
      _ref = this.SUBVIEWS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        new subview({
          parentView: this
        }).render();
      }
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
      var _this = this;
      this.$el.html(FormBuilder.JST['page']({
        options: this.options
      }));
      this.$fbLeft = this.$el.find('.fb-left');
      this.$responseFields = this.$el.find('.fb-response-fields');
      $(window).on('scroll', function() {
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
      this.toggleNoResponseFields();
      return this;
    },
    showTab: function(_, $el, target) {
      var first_model,
        _this = this;
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        this.createAndShowEditView(first_model);
      }
      if (target === '#formOptions') {
        return $.scrollWindowTo(0, 200, function() {
          return _this.lockLeftWrapper();
        });
      }
    },
    addOne: function(responseField, _, options) {
      var $replacePosition, view;
      view = new VIEW_FIELD_VIEW({
        model: responseField,
        parentView: this
      });
      if (options.$replaceEl != null) {
        options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        this.$responseFields.prepend(view.render().el);
      } else {
        $replacePosition = this.$responseFields.find(".response-field-wrapper").eq(options.position);
        if ($replacePosition.length > 0) {
          $replacePosition.before(view.render().el);
        } else {
          this.$responseFields.append(view.render().el);
        }
      }
      if (!this.addingAll) {
        return this.resetSortable();
      }
    },
    resetSortable: function() {
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
            rf = _this.collection.create(_this.defaultAttrs(field_type), {
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
      console.log('dragg');
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
      this.addingAll = true;
      this.collection.each(this.addOne, this);
      this.addingAll = false;
      return this.resetSortable();
    },
    toggleNoResponseFields: function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    },
    defaultAttrs: function(field_type) {
      var attrs;
      attrs = {
        label: "Untitled",
        field_type: field_type,
        field_options: {
          required: true
        }
      };
      switch (attrs.field_type) {
        case "checkboxes":
        case "dropdown":
        case "radio":
          attrs.field_options.options = [
            {
              label: "",
              checked: false
            }, {
              label: "",
              checked: false
            }
          ];
          break;
        case "dropdown":
          attrs.field_options.include_blank_option = false;
          break;
        case "text":
        case "paragraph":
          attrs.field_options.size = "small";
      }
      return attrs;
    },
    addField: function(_, __, field_type) {
      return this.createField(this.defaultAttrs(field_type));
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
      this.$el.find(".response-field-wrapper").removeClass('editing');
      $responseFieldEl.addClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-backbone-params=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl, (typeof oldPadding !== "undefined" && oldPadding !== null) && oldPadding);
          return;
        }
        oldPadding = this.$fbLeft.css('padding-top');
        this.editView.remove();
      }
      this.editView = new EDIT_FIELD_VIEW({
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
      return;
      if (this.formSaved === true) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.button('loading');
      this.collection.sort();
      this.collection.each((function(model) {
        return model.attributes.cid = model.cid;
      }));
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
          var datum, newReviewFieldId, _i, _len, _ref1, _ref2;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref1 = _this.collection.get(datum.cid)) != null) {
              _ref1.set({
                id: datum.id
              });
            }
            if ((newReviewFieldId = datum.field_options.review_this_field_id)) {
              if ((_ref2 = _this.collection.get(datum.cid)) != null) {
                _ref2.set('field_options.review_this_field_id', newReviewFieldId);
              }
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    }
  });

}).call(this);
