/*jshint expr:true eqnull:true */
/**
 *
 * Improves Backbone Model support when nested attributes are used.
 * get() and set() can take paths e.g. 'user.name'
 *
 *
 */
;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['underscore', 'backbone'], factory);
    } else {
        // globals
        factory(_, Backbone);
    }
}(function(_, Backbone) {

    /**
     * Takes a nested object and returns a shallow object keyed with the path names
     * e.g. { "level1.level2": "value" }
     *
     * @param  {Object}      Nested object e.g. { level1: { level2: 'value' } }
     * @return {Object}      Shallow object with path names e.g. { 'level1.level2': 'value' }
     */
    function objToPaths(obj) {
        var ret = {},
            separator = DeepModel.keyPathSeparator;

        for (var key in obj) {
            var val = obj[key];

            if (val && val.constructor === Object && !_.isEmpty(val)) {
                //Recursion for embedded objects
                var obj2 = objToPaths(val);

                for (var key2 in obj2) {
                    var val2 = obj2[key2];

                    ret[key + separator + key2] = val2;
                }
            } else {
                ret[key] = val;
            }
        }

        return ret;
    }

    /**
     * @param {Object}  Object to fetch attribute from
     * @param {String}  Object path e.g. 'user.name'
     * @return {Mixed}
     */
    function getNested(obj, path, return_exists) {
        var separator = DeepModel.keyPathSeparator;

        var fields = path.split(separator);
        var result = obj;
        return_exists || (return_exists === false);
        for (var i = 0, n = fields.length; i < n; i++) {
            if (return_exists && !_.has(result, fields[i])) {
                return false;
            }
            result = result[fields[i]];

            if (result == null && i < n - 1) {
                result = {};
            }

            if (typeof result === 'undefined') {
                if (return_exists)
                {
                    return true;
                }
                return result;
            }
        }
        if (return_exists)
        {
            return true;
        }
        return result;
    }

    /**
     * @param {Object} obj                Object to fetch attribute from
     * @param {String} path               Object path e.g. 'user.name'
     * @param {Object} [options]          Options
     * @param {Boolean} [options.unset]   Whether to delete the value
     * @param {Mixed}                     Value to set
     */
    function setNested(obj, path, val, options) {
        options = options || {};

        var separator = DeepModel.keyPathSeparator;

        var fields = path.split(separator);
        var result = obj;
        for (var i = 0, n = fields.length; i < n && result !== undefined ; i++) {
            var field = fields[i];

            //If the last in the path, set the value
            if (i === n - 1) {
                options.unset ? delete result[field] : result[field] = val;
            } else {
                //Create the child object if it doesn't exist, or isn't an object
                if (typeof result[field] === 'undefined' || ! _.isObject(result[field])) {
                    result[field] = {};
                }

                //Move onto the next part of the path
                result = result[field];
            }
        }
    }

    function deleteNested(obj, path) {
      setNested(obj, path, null, { unset: true });
    }

    var DeepModel = Backbone.Model.extend({

        // Override constructor
        // Support having nested defaults by using _.deepExtend instead of _.extend
        constructor: function(attributes, options) {
            var defaults;
            var attrs = attributes || {};
            this.cid = _.uniqueId('c');
            this.changed = {};
            this.attributes = {};
            this._changes = [];
            if (options && options.collection) this.collection = options.collection;
            if (options && options.parse) attrs = this.parse(attrs);
            if (defaults = _.result(this, 'defaults')) {
                //<custom code>
                // Replaced the call to _.defaults with _.deepExtend.
                attrs = _.deepExtend({}, defaults, attributes);
                //</custom code>
            }
            this.set(attrs, {silent: true});
            //<custom code>
            // Replaced call to _.clone with _.deepClone
            this._currentAttributes = _.deepClone(this.attributes);
            this._previousAttributes = _.deepClone(this.attributes);
            //</custom code>
            this.initialize.apply(this, arguments);
        },

        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
          return _.deepClone(this.attributes);
        },

        // Clear all attributes on the model, firing `"change"` unless you choose
        // to silence it.
        clear: function(options) {
          var attrs = {};
          var shallowAttributes = objToPaths(this.attributes);
          for (var key in shallowAttributes) attrs[key] = void 0;
          return this.set(attrs, _.extend({}, options, {unset: true}));
        },

        // Override get
        // Supports nested attributes via the syntax 'obj.attr' e.g. 'author.user.name'
        get: function(attr) {
            return getNested(this.attributes, attr);
        },

        // Override set
        // Supports nested attributes via the syntax 'obj.attr' e.g. 'author.user.name'
        set: function(key, val, options) {
            if(options === undefined) options = {};
            var attr, attrs;
            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (_.isObject(key)) {
              attrs = key;
              options = val || {};
            } else {
              (attrs = {})[key] = val;
            }

            // Extract attributes and options.
            var silent = options && options.silent;
            var unset = options && options.unset;

            // Run validation.
            if (!this._validate(attrs, options)) return false;

            // Check for changes of `id`.
            if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

            var now = this.attributes;

            //<custom code>
            attrs = objToPaths(attrs);
            //</custom code>

            // For each `set` attribute...
            for (attr in attrs) {
              val = attrs[attr];

              // Update or delete the current value.
              //<custom code>
              unset ? deleteNested(now, attr) : setNested(now, attr, val);
              //</custom code>
              this._changes.push(attr, val);
            }

            // Signal that the model's state has potentially changed, and we need
            // to recompute the actual changes.
            this._hasComputed = false;

            // Fire the `"change"` events.
            if (!silent) this.change(options);
            return this;
        },

        // Looking at the built up list of `set` attribute changes, compute how
        // many of the attributes have actually changed. If `loud`, return a
        // boiled-down list of only the real changes.
        _computeChanges: function(loud) {
          this.changed = {};
          var already = {};
          var triggers = [];
          var current = this._currentAttributes;
          var changes = this._changes;

          // Loop through the current queue of potential model changes.
          for (var i = changes.length - 2; i >= 0; i -= 2) {
            var key = changes[i], val = changes[i + 1];
            if (already[key]) continue;
            already[key] = true;

            // Check if the attribute has been modified since the last change,
            // and update `this.changed` accordingly. If we're inside of a `change`
            // call, also add a trigger to the list.
            //<custom code>
          if (!_.isEqual(getNested(current, key), val)) {
              this.changed[key] = val;
              if (!loud) continue;

              setNested(current, key, (_.isArray(val) ? _.deepClone(val) : val));

              var separator = DeepModel.keyPathSeparator;
              var fields = key.split(separator);
              for(var n = 1; n < fields.length; n++) {
                var parentkey = _.first(fields, n).join(separator);

                if (already[parentkey]) continue;
                already[parentkey] = true;

                var parentval = getNested(current, parentkey);
                parentkey += separator + '*';
                triggers.push(parentkey, parentval);
              }
              triggers.push(key, val);
            }
            //</custom code>
          }
          if (loud) this._changes = [];

          // Signals `this.changed` is current to prevent duplicate calls from `this.hasChanged`.
          this._hasComputed = true;
          return triggers;
        },

        // Call this method to manually fire a `"change"` event for this model and
        // a `"change:attribute"` event for each changed attribute.
        // Calling this will cause all objects observing the model to update.
        change: function(options) {
          var changing = this._changing;
          this._changing = true;

          // Generate the changes to be triggered on the model.
          var triggers = this._computeChanges(true);

          this._pending = !!triggers.length;

          for (var i = triggers.length - 2; i >= 0; i -= 2) {
            this.trigger('change:' + triggers[i], this, triggers[i + 1], options);
          }

          if (changing) return this;

          // Trigger a `change` while there have been changes.
          while (this._pending) {
            this._pending = false;
            this.trigger('change', this, options);
            //<custom code>
            this._previousAttributes = _.deepClone(this.attributes);
            //</custom code>
          }

          this._changing = false;
          //<custom code>
          this.changed = false;
          //</custom code>
          return this;
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
          if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
          //<custom code>
          diff = objToPaths(diff);
          var old = objToPaths(this._previousAttributes);
          //</custom code>
          var val, changed = false;
          for (var attr in diff) {
            if (_.isEqual(old[attr], (val = diff[attr]))) continue;
            (changed || (changed = {}))[attr] = val;
          }
          return changed;
        }
    });


    //Config; override in your app to customise
    DeepModel.keyPathSeparator = '.';


    //Exports
    Backbone.DeepModel = DeepModel;

    //For use in NodeJS
    if (typeof module != 'undefined') module.exports = DeepModel;

    return Backbone;

}));