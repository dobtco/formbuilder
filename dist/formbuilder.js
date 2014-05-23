(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var BuilderView, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, GridFieldView, ViewFieldView, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FormbuilderModel = (function(_super) {
    __extends(FormbuilderModel, _super);

    function FormbuilderModel() {
      _ref = FormbuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(_super) {
    __extends(FormbuilderCollection, _super);

    function FormbuilderCollection() {
      _ref1 = FormbuilderCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormbuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = model.cid;
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(_super) {
    __extends(ViewFieldView, _super);

    function ViewFieldView() {
      _ref2 = ViewFieldView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "destroy", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function(e) {
      var cb, x,
        _this = this;
      e.preventDefault();
      e.stopPropagation();
      cb = function() {
        _this.parentView.handleFormUpdate();
        return _this.model.destroy();
      };
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    ViewFieldView.prototype.duplicate = function(e) {
      var attrs;
      e.preventDefault();
      e.stopPropagation();
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      delete attrs['cid'];
      attrs['label'] += ' Copy';
      this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
      return this.model.trigger("duplicate:viewfield");
    };

    return ViewFieldView;

  })(Backbone.View);

  GridFieldView = (function(_super) {
    __extends(GridFieldView, _super);

    function GridFieldView() {
      _ref3 = GridFieldView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    GridFieldView.prototype.className = "fb-field-wrapper";

    GridFieldView.prototype.events = {
      'click .response-field-grid-cell li': 'inlineAdd',
      'click .response-field-grid-cell .js-clear': 'subelementClear',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear',
      'click .subtemplate-wrapper': 'focusEditView'
    };

    GridFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.renderTable);
      this.listenTo(this.model, "destroy", this.remove);
      this.parentView.collection.bind('add', this.addSubelement, this);
      this.parentView.collection.bind('destroy', this.removeSubelement, this);
      return this.render;
    };

    GridFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).html(Formbuilder.templates["view/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      this.renderTable();
      this.renderChildren();
      return this;
    };

    GridFieldView.prototype.renderTable = function() {
      var currentCols, currentRows, numCols, numRows, rows, table, _i, _ref4, _results,
        _this = this;
      numRows = this.model.get('field_options.num_rows') || 1;
      numCols = this.model.get('field_options.num_cols') || 1;
      table = this.$el.find('table');
      currentRows = table.find('tr').length;
      currentCols = table.find("tr:nth-child(1) td").length;
      rows = $.makeArray(table.find('tr'));
      if (currentRows < numRows) {
        rows = rows.concat((function() {
          _results = [];
          for (var _i = _ref4 = rows.length; _ref4 <= numRows ? _i < numRows : _i > numRows; _ref4 <= numRows ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this));
      }
      rows = _.map(rows, function(row) {
        var cols, _j, _ref5, _results1;
        if (_.isNumber(row)) {
          row = $('<tr class="response-field-grid-row"></tr>').appendTo(table);
        }
        cols = $.makeArray($(row).find('td'));
        if (cols.length < numCols) {
          cols = cols.concat((function() {
            _results1 = [];
            for (var _j = _ref5 = cols.length; _ref5 <= numCols ? _j < numCols : _j > numCols; _ref5 <= numCols ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this));
        }
        cols = _.map(cols, function(col) {
          if (_.isNumber(col)) {
            return col = $('<td class="response-field-grid-cell"></td>').appendTo(row).html(Formbuilder.templates["view/element_selector"]());
          }
        });
        return row;
      });
      if (currentRows > numRows) {
        _.each(this.subelements(), function(subelement) {
          var grid;
          grid = _this.parentView.gridAttr(subelement);
          if (grid.row > numRows) {
            return subelement.destroy();
          }
        });
        table.find('tr').slice(numRows - currentRows).remove();
      }
      if (currentCols > numCols) {
        _.each(this.subelements(), function(subelement) {
          var grid;
          grid = _this.parentView.gridAttr(subelement);
          if (grid.col > numCols) {
            return subelement.destroy();
          }
        });
        return table.find('tr').find('td:gt(' + (numCols - 1) + ')').remove();
      }
    };

    GridFieldView.prototype.renderChildren = function() {
      var children,
        _this = this;
      children = this.model.get('children') || [];
      return _.each(children, function(child) {
        var grid;
        grid = child.grid;
        return _this.createField(child, _this.getSubelement(grid.row, grid.col));
      });
    };

    GridFieldView.prototype.focusEditView = function(e) {
      if ($(e.target).parents('table').length === 0) {
        return this.parentView.createAndShowEditView(this.model);
      }
    };

    GridFieldView.prototype.clear = function(e) {
      var cb, x,
        _this = this;
      e.preventDefault();
      e.stopPropagation();
      _.each(this.subelements(), function(model) {
        return model.destroy();
      });
      cb = function() {
        _this.parentView.handleFormUpdate();
        return _this.model.destroy();
      };
      x = Formbuilder.options.CLEAR_FIELD_CONFIRM;
      switch (typeof x) {
        case 'string':
          if (confirm(x)) {
            return cb();
          }
          break;
        case 'function':
          return x(cb);
        default:
          return cb();
      }
    };

    GridFieldView.prototype.duplicate = function() {
      var attrs, children,
        _this = this;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      delete attrs['cid'];
      attrs['label'] += ' Copy';
      children = this.subelements();
      attrs['children'] = _.map(children, function(child) {
        var childattrs;
        childattrs = _.clone(child.attributes);
        delete childattrs['id'];
        delete childattrs['cid'];
        return childattrs;
      });
      return this.parentView.createField(attrs, {
        position: -1
      });
    };

    GridFieldView.prototype.addSubelement = function(model) {
      var grid;
      if (this.belongsToMe(model)) {
        grid = this.parentView.gridAttr(model);
        return model.attributes.label = 'Row: ' + (grid.row + 1) + ', Col: ' + (grid.col + 1);
      }
    };

    GridFieldView.prototype.removeSubelement = function(model) {
      var grid;
      if (this.belongsToMe(model)) {
        grid = this.parentView.gridAttr(model);
        return this.getSubelement(grid.row, grid.col).html(Formbuilder.templates["view/element_selector"]({
          rf: this.model
        }));
      }
    };

    GridFieldView.prototype.subelements = function() {
      var _this = this;
      return this.parentView.collection.filter(function(item) {
        return _this.belongsToMe(item);
      });
    };

    GridFieldView.prototype.belongsToMe = function(model) {
      return this.parentView.inGrid(model) && this.parentView.gridAttr(model).cid === this.model.cid;
    };

    GridFieldView.prototype.inlineAdd = function(e) {
      var target, type;
      e.preventDefault();
      e.stopPropagation();
      type = $(e.currentTarget).data('field-type');
      target = $(e.currentTarget).parents('.response-field-grid-cell');
      return this.createField(type, target);
    };

    GridFieldView.prototype.getSubelement = function(row, col) {
      row++;
      col++;
      return this.$el.find('tr:nth-child(' + row + ') td:nth-child(' + col + ')');
    };

    GridFieldView.prototype.createField = function(attrs, target) {
      if (_.isString(attrs)) {
        attrs = Formbuilder.helpers.defaultFieldAttrs(attrs);
      }
      attrs.grid = {
        cid: this.model.cid,
        col: target.prop('cellIndex'),
        row: target.parents('tr').prop('rowIndex')
      };
      return this.parentView.createField(attrs, {
        $appendEl: target
      });
    };

    return GridFieldView;

  })(Backbone.View);

  EditFieldView = (function(_super) {
    __extends(EditFieldView, _super);

    function EditFieldView() {
      _ref4 = EditFieldView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'input .option-label-input': 'forceRender'
    };

    EditFieldView.prototype.initialize = function(options) {
      var _this = this;
      this.parentView = options.parentView;
      this.listenTo(this.model, "destroy", this.remove);
      return _.each(Formbuilder.options.change, function(callback, key) {
        var eventName;
        eventName = 'change:' + Formbuilder.options.mappings[key];
        return _this.listenTo(_this.model, eventName, callback);
      });
    };

    EditFieldView.prototype.render = function() {
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      return this;
    };

    EditFieldView.prototype.reset = function() {
      this.parentView.editView = void 0;
      return this.parentView.createAndShowEditView(this.model);
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      this.parentView.$el.find("[data-target=\"#addField\"]").click();
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, i, newOption, options;
      $el = $(e.currentTarget);
      i = this.$el.find('.option').index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      newOption = {
        label: "",
        checked: false
      };
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, index, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      options.splice(index, 1);
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function() {
      return this.model.trigger('change');
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(_super) {
    __extends(BuilderView, _super);

    function BuilderView() {
      _ref5 = BuilderView.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.saveFormButton = $();

    BuilderView.prototype.events = {
      'click .fb-tabs a': 'showTab',
      'click .fb-add-field-types a': 'addField',
      'mouseover .fb-add-field-types': 'lockLeftWrapper',
      'mouseout .fb-add-field-types': 'unlockLeftWrapper'
    };

    BuilderView.prototype.initialize = function(options) {
      var selector;
      selector = options.selector, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData;
      if (selector != null) {
        this.setElement($(selector));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('destroy add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('destroy', this.ensureEditViewScrolled, this);
      this.render();
      this.collection.reset(this.bootstrapData);
      return this.bindSaveEvent();
    };

    BuilderView.prototype.bindSaveEvent = function() {
      var _this = this;
      this.formSaved = true;
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      if (!!Formbuilder.options.AUTOSAVE) {
        setInterval(function() {
          return _this.saveForm.call(_this);
        }, 5000);
      }
      return $(window).bind('beforeunload', function() {
        if (_this.formSaved) {
          return void 0;
        } else {
          return Formbuilder.options.dict.UNSAVED_CHANGES;
        }
      });
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      var subview, _i, _len, _ref6;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.fb-left');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      _ref6 = this.SUBVIEWS;
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        subview = _ref6[_i];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      var _this = this;
      return $(window).on('scroll', function() {
        var maxMargin, newMargin;
        if (_this.$fbLeft.data('locked') === true) {
          return;
        }
        newMargin = Math.max(0, $(window).scrollTop() - _this.$el.offset().top);
        maxMargin = _this.$responseFields.height();
        return _this.$fbLeft.css({
          'margin-top': Math.min(maxMargin, newMargin)
        });
      });
    };

    BuilderView.prototype.showTab = function(e) {
      var $el, first_model, target;
      $el = $(e.currentTarget);
      target = $el.data('target');
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      }
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, appendEl, grid, view;
      if (responseField.attributes.field_type === 'grid') {
        view = new GridFieldView({
          model: responseField,
          parentView: this
        });
      } else {
        view = new ViewFieldView({
          model: responseField,
          parentView: this
        });
      }
      grid = this.gridAttr(responseField);
      if (options.$appendEl === void 0 && (grid != null)) {
        appendEl = $('tr td:nth-child(' + (grid.col + 1) + '):has(.element-selector)').first();
        if (appendEl.length === 1) {
          options.$appendEl = appendEl;
          grid.row = appendEl.parents('tr').prop('rowIndex');
        } else {
          options.position = null;
          delete responseField.attributes['grid'];
        }
      }
      if (options.$appendEl != null) {
        return options.$appendEl.html(view.render().el);
      } else if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        placeholder: 'sortable-placeholder',
        stop: function(e, ui) {
          var rf;
          if (ui.item.data('field-type')) {
            rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          _this.handleFormUpdate();
          return true;
        },
        update: function(e, ui) {
          if (!ui.item.data('field-type')) {
            return _this.ensureEditViewScrolled();
          }
        }
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-field-type]");
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
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? 'hide' : 'show']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type, {}));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var rf;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      return this.handleFormUpdate();
    };

    BuilderView.prototype.createAndShowEditView = function(model) {
      var $newEditEl, $responseFieldEl, fieldWrapper;
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $('.fb-field-wrapper').removeClass('editing');
      $responseFieldEl.addClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl);
          return;
        }
        this.editView.remove();
      }
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      fieldWrapper = this.$el.find(".fb-edit-field-wrapper");
      fieldWrapper.html($newEditEl);
      if (this.inGrid(model)) {
        fieldWrapper.addClass('fb-edit-field-grid');
      } else {
        fieldWrapper.removeClass('fb-edit-field-grid');
      }
      this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
      this.scrollLeftWrapper($responseFieldEl);
      if (model.get('definition.onEdit')) {
        model.get('definition.onEdit')(model);
      }
      return this;
    };

    BuilderView.prototype.inGrid = function(model) {
      var grid;
      grid = model.attributes.grid || false;
      return grid !== false && grid.cid !== void 0;
    };

    BuilderView.prototype.gridAttr = function(model) {
      if (this.inGrid(model)) {
        return model.get('grid');
      }
      return null;
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
    };

    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      var _this = this;
      this.unlockLeftWrapper();
      if (!$responseFieldEl[0]) {
        return;
      }
      return $.scrollWindowTo((this.$el.offset().top + $responseFieldEl.offset().top) - this.$responseFields.offset().top, 200, function() {
        return _this.lockLeftWrapper();
      });
    };

    BuilderView.prototype.lockLeftWrapper = function() {
      return this.$fbLeft.data('locked', true);
    };

    BuilderView.prototype.unlockLeftWrapper = function() {
      return this.$fbLeft.data('locked', false);
    };

    BuilderView.prototype.handleFormUpdate = function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
    };

    BuilderView.prototype.getPayload = function() {
      return JSON.stringify({
        fields: this.collection.toJSON()
      });
    };

    BuilderView.prototype.saveForm = function(e) {
      var payload;
      if (this.formSaved) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      this.collection.sort();
      payload = this.getPayload();
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      return this.formBuilder.trigger('save', payload);
    };

    BuilderView.prototype.doAjaxSave = function(payload) {
      var _this = this;
      return $.ajax({
        url: Formbuilder.options.HTTP_ENDPOINT,
        type: Formbuilder.options.HTTP_METHOD,
        data: payload,
        contentType: "application/json",
        success: function(data) {
          var datum, _i, _len, _ref6;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref6 = _this.collection.get(datum.cid)) != null) {
              _ref6.set({
                id: datum.id
              });
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {};
        attrs[Formbuilder.options.mappings.LABEL] = 'Untitled';
        attrs[Formbuilder.options.mappings.FIELD_TYPE] = field_type;
        attrs[Formbuilder.options.mappings.REQUIRED] = false;
        attrs['definition'] = Formbuilder.fields[field_type];
        attrs['field_options'] = {};
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'fb-button btn btn-default',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      AUTOSAVE: true,
      CLEAR_FIELD_CONFIRM: false,
      ENABLED_FIELDS: ['text', 'checkboxes', 'dropdown', 'paragraph', 'radio', 'date', 'section_break', 'signature', 'info', 'grid'],
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        NAME: 'definition.name',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INCLUDE_SCORING: 'field_options.include_scoring',
        INTEGER_ONLY: 'field_options.integer_only',
        TABLE: {
          COLS: 'field_options.cols',
          NUMCOLS: 'field_options.num_cols',
          ROWS: 'field_options.rows',
          NUMROWS: 'field_options.num_rows'
        },
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        LENGTH_UNITS: 'field_options.min_max_length_units'
      },
      change: {
        INCLUDE_SCORING: function() {
          return this.reset();
        }
      },
      dict: {
        ALL_CHANGES_SAVED: 'All changes saved',
        SAVE_FORM: 'Save form',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!'
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.prototype.markSaved = function() {
      return this.mainView.formSaved = true;
    };

    Formbuilder.prototype.getPayload = function() {
      return this.mainView.getPayload();
    };

    Formbuilder.registerField = function(name, opts) {
      var enabled, x, _i, _len, _ref6;
      enabled = true;
      if (!_.contains(Formbuilder.options.ENABLED_FIELDS, name)) {
        enabled = false;
      }
      _ref6 = ['view', 'edit'];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        x = _ref6[_i];
        opts[x] = enabled ? _.template(opts[x]) : function(x) {
          return '';
        };
      }
      opts.field_type = name;
      opts.enabled = enabled;
      Formbuilder.fields[name] = opts;
      if (opts.type === 'non_input') {
        return Formbuilder.nonInputFields[name] = opts;
      } else {
        return Formbuilder.inputFields[name] = opts;
      }
    };

    function Formbuilder(opts) {
      var args;
      if (opts == null) {
        opts = {};
      }
      _.extend(this, Backbone.Events);
      args = _.extend(opts, {
        formBuilder: this
      });
      this.mainView = new BuilderView(args);
      this.mainView.collection;
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('address', {
    name: 'Address',
    order: 50,
    view: "<div class='input-line'>\n  <span class='street'>\n    <input type='text' />\n    <label>Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='city'>\n    <input type='text' />\n    <label>City</label>\n  </span>\n\n  <span class='state'>\n    <input type='text' />\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='zip'>\n    <input type='text' />\n    <label>Zipcode</label>\n  </span>\n\n  <span class='country'>\n    <select><option>United States</option></select>\n    <label>Country</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"fb-icon-address\"></span> Address"
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    name: 'Checkboxes',
    order: 10,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']({ rf: rf }) %>",
    addButton: "<span class=\"fb-icon-checkboxes\"></span> Checkboxes",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          score: false
        }, {
          label: "",
          checked: false,
          score: false
        }
      ];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date', {
    name: 'Date',
    order: 20,
    view: "<div class='input-line'>\n  <span class='month'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='day'>\n    <input type=\"text\" />\n    <label>DD</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='year'>\n    <input type=\"text\" />\n    <label>YYYY</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"fb-icon-date\"></span> Date"
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    name: 'Dropdown',
    order: 24,
    view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= Formbuilder.templates['edit/scoring']() %>\n<%= Formbuilder.templates['edit/options']({ rf: rf }) %>",
    addButton: "<span class=\"fb-icon-dropdown\"></span> Dropdown",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          score: ""
        }, {
          label: "",
          checked: false,
          score: ""
        }
      ];
      attrs.field_options.include_scoring = false;
      attrs.field_options.include_blank_option = false;
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    name: 'Section break',
    order: 0,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class=\"fb-edit-section-header\">Details</div>\n<div class=\"fb-common-wrapper\">\n<div class=\"fb-label-description\">\n  <input type=\"text\" data-rv-input=\"model.<%= Formbuilder.options.mappings.LABEL %>\">\n  <textarea data-rv-input=\"model.<%= Formbuilder.options.mappings.DESCRIPTION %>\" placeholder=\"Add a longer description to this field\">\n  </textarea>\n</div>\n</div>",
    addButton: "<span class=\"fb-icon-section\"></span> Section Break"
  });

}).call(this);

(function() {
  Formbuilder.registerField('file', {
    name: 'File',
    order: 55,
    view: "<canvas />",
    edit: "",
    addButton: "<span class=\"fb-icon-file\"></span> File"
  });

}).call(this);

(function() {
  Formbuilder.registerField('grid', {
    name: 'Grid',
    order: 0,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<table class=\"response-field-grid-table\">\n</table>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class=\"fb-edit-section-header\">Details</div>\n<div class=\"fb-common-wrapper\">\n<div class=\"fb-label-description\">\n  <input type=\"text\" data-rv-input=\"model.<%= Formbuilder.options.mappings.LABEL %>\">\n  <textarea data-rv-input=\"model.<%= Formbuilder.options.mappings.DESCRIPTION %>\" placeholder=\"Add a longer description to this field\">\n  </textarea>\n<div class='fb-edit-section-header'>Number of Columns</div>\n  <select data-rv-value=\"model.<%= Formbuilder.options.mappings.TABLE.NUMCOLS %>\">\n      <option value=\"1\">1</option>\n      <option value=\"2\">2</option>\n      <option value=\"3\">3</option>\n      <option value=\"4\">4</option>\n      <option value=\"5\">5</option>\n      <option value=\"6\">6</option>\n      <option value=\"7\">7</option>\n      <option value=\"8\">8</option>\n      <option value=\"9\">9</option>\n      <option value=\"10\">10</option>\n  </select>\n<div class='fb-edit-section-header'>Number of Rows</div>\n  <select data-rv-value=\"model.<%= Formbuilder.options.mappings.TABLE.NUMROWS %>\">\n      <option value=\"1\">1</option>\n      <option value=\"2\">2</option>\n      <option value=\"3\">3</option>\n      <option value=\"4\">4</option>\n      <option value=\"5\">5</option>\n      <option value=\"6\">6</option>\n      <option value=\"7\">7</option>\n      <option value=\"8\">8</option>\n      <option value=\"9\">9</option>\n      <option value=\"10\">10</option>\n      <option value=\"11\">11</option>\n      <option value=\"12\">12</option>\n      <option value=\"13\">13</option>\n      <option value=\"14\">14</option>\n      <option value=\"15\">15</option>\n      <option value=\"16\">16</option>\n      <option value=\"17\">17</option>\n      <option value=\"18\">18</option>\n      <option value=\"19\">19</option>\n      <option value=\"20\">20</option>\n  </select>\n</div>\n</div>",
    addButton: "<span class=\"fb-icon-grid\"></span> Grid",
    defaultAttributes: function(attrs) {
      attrs.field_options.num_cols = 1;
      attrs.field_options.num_rows = 1;
      attrs.children = [];
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('info', {
    name: 'Info',
    order: 0,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class=\"fb-edit-section-header\">Details</div>\n<div class=\"fb-common-wrapper\">\n  <div class=\"fb-label-description\">\n    <input type=\"text\" data-rv-input=\"model.<%= Formbuilder.options.mappings.LABEL %>\">\n  </div>\n  <textarea style=\"display:none;\" data-rv-input=\"model.<%= Formbuilder.options.mappings.DESCRIPTION %>\">\n  </textarea>\n  <div class=\"fb-info-editor\"></div>\n</div>",
    addButton: "<span class=\"fb-icon-info\"></span> Info",
    onEdit: function(model) {
      var update;
      update = function() {
        model.set(Formbuilder.options.mappings.DESCRIPTION, $(this).html());
        return model.trigger('change:' + Formbuilder.options.mappings.DESCRIPTION);
      };
      return $('.fb-info-editor').summernote({
        airmode: true,
        onchange: function() {
          return update.call(this);
        },
        onkeyup: function() {
          return update.call(this);
        },
        toolbar: [['style', ['bold', 'italic', 'underline']], ['table', ['table']]]
      });
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('number', {
    name: 'Number',
    order: 30,
    view: "<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "",
    addButton: "<span class=\"fb-icon-number></span> Number"
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    name: 'Paragraph',
    order: 5,
    view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
    edit: "",
    addButton: "<span class=\"fb-icon-paragraph\"></span> Paragraph",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('price', {
    name: 'Price',
    order: 45,
    view: "<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dolars'>\n    <input type='text' />\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text' />\n    <label>Cents</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"fb-icon-price\"></span> Price"
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    name: 'Radio Button',
    order: 15,
    view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/scoring']({ rf: rf }) %>\n<%= Formbuilder.templates['edit/options']({ rf: rf }) %>",
    addButton: "<span class=\"fb-icon-radio\"></span> Multiple Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          score: ""
        }, {
          label: "",
          checked: false,
          score: ""
        }
      ];
      attrs.field_options.include_scoring = false;
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    name: 'Section break',
    order: 0,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class=\"fb-edit-section-header\">Details</div>\n<div class=\"fb-common-wrapper\">\n<div class=\"fb-label-description\">\n  <input type=\"text\" data-rv-input=\"model.<%= Formbuilder.options.mappings.LABEL %>\">\n  <textarea data-rv-input=\"model.<%= Formbuilder.options.mappings.DESCRIPTION %>\" placeholder=\"Add a longer description to this field\">\n  </textarea>\n</div>\n</div>",
    addButton: "<span class=\"fb-icon-section\"></span> Section Break"
  });

}).call(this);

(function() {
  Formbuilder.registerField('signature', {
    name: 'Signature',
    order: 65,
    view: "<div class=\"fb-signature form-control\">\n    <div class=\"fb-signature-placeholder\">Sign Here</div>\n    <div class=\"fb-signature-pad\"></div>\n</div>\n<button class=\"btn btn-default btn-xs\">Clear</button>",
    edit: "",
    addButton: "<span class=\"fb-icon-signature\"></span> Signature"
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    name: 'Text',
    order: 0,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "",
    addButton: "<span class=\"fb-icon-text\"></span> Text",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('time', {
    name: 'Time',
    order: 25,
    view: "<div class='input-line'>\n  <span class='hours'>\n    <input type=\"text\" />\n    <label>HH</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='minutes'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='seconds'>\n    <input type=\"text\" />\n    <label>SS</label>\n  </span>\n\n  <span class='am_pm'>\n    <select>\n      <option>AM</option>\n      <option>PM</option>\n    </select>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"fb-icon-time\"></span> Time"
  });

}).call(this);

(function() {
  Formbuilder.registerField('website', {
    name: 'Website',
    order: 35,
    view: "<input type='text' placeholder='http://' />",
    edit: "",
    addButton: "<span class=\"fb-icon-website\"></span> Website"
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']({rf: rf}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/common']({rf: rf}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.NAME )) == null ? '' : __t) +
'\'></code>\n  <span class=\'fa fa-arrow-right pull-right\'></span>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']({rf: rf}) )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Details</div>\n\n<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']({rf: rf}) )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-common-checkboxes\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' />\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'\n  placeholder=\'Add a longer description to this field\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n';
 } ;
__p += '\n\n<div class=\'option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <input type="text" data-rv-input="option:label" placeholder="Label" class=\'option-label-input\' />\n  ';
 if (rf.get(Formbuilder.options.mappings.INCLUDE_SCORING)) { ;
__p += '\n  <input type="text" data-rv-input="option:score" placeholder="Score" class=\'option-score-input\' />\n  ';
 } ;
__p += '\n\n  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><span class=\'icon-minus\'></span></a>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/scoring"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label class="fb-scoring-wrapper">\n  <input class="js-scoring" type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_SCORING )) == null ? '' : __t) +
'\' />\n  Include Scoring\n</label>\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/right_side']() )) == null ? '' : __t) +
'\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\n  <div class=\'fb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 _.chain(Formbuilder.inputFields)
          .sortBy('order')
          .filter(function(f){ return f.enabled; })
          .each(function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 _.chain(Formbuilder.nonInputFields)
          .sortBy('order')
          .filter(function(f){ return f.enabled; })
          .each(function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\n  <div class=\'fb-edit-field-wrapper\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\n  <ul class=\'fb-tabs\'>\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\n    <li><a data-target=\'#editField\'>Edit field</a></li>\n  </ul>\n\n  <div class=\'fb-tab-content\'>\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-right panel\'>\n  <div class=\'fb-no-response-fields\'>No response fields</div>\n  <div class=\'fb-response-fields panel-body\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><span class="fb-icon-add"></span></a>\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><span class="fb-icon-minus"></span></a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/element_selector"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="element-selector btn-group">\n<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">\n    <span class="glyphicon glyphicon-plus"></span>\n    <span class="caret"></span>\n</button>\n<ul class="dropdown-menu" role="menu">\n    <li data-field-type="text"><span class="fb-icon-text"></span> Text</li>\n    <li data-field-type="paragraph"><span class="fb-icon-paragraph"></span> Paragraph</li>\n    <li data-field-type="dropdown"><span class="fb-icon-dropdown"></span> Dropdown</li>\n    <li data-field-type="checkboxes"><span class="fb-icon-checkboxes"></span> Checkboxes</li>\n    <li data-field-type="radio"><span class="fb-icon-radio"></span> Radio</li>\n    <li data-field-type="info"><span class="fb-icon-info"></span> Info</li>\n</ul>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    <abbr title=\'required\'>*</abbr>\n  ';
 } ;
__p += '\n</label>\n';

}
return __p
};