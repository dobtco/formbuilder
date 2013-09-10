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
