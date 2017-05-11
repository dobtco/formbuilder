rivets.binders.append =
  routine: (el, value) ->
    el.checked =  _.find(value, (item) -> String(item) == String(el.value)) != undefined
  bind: (el) ->

    @callback = () =>
      currentValue = _.clone(@model.get(@keypath)) || []
      if _.contains(currentValue, el.value)
        newValue = _.without(currentValue, el.value)
        @model.set(@keypath, newValue)
      else
        currentValue.push(el.value)
        @model.set(@keypath, currentValue)
    $(el).on('change', @callback)
  unbind: (el) ->
    $(el).off('change', @callback)


rivets.formatters.length = (value) ->
  if value then value.length else 0


rivets.binders.input =
  publishes: true
  routine: rivets.binders.value.routine
  bind: (el) ->
    $(el).bind('input.rivets', this.publish)
  unbind: (el) ->
    $(el).unbind('input.rivets')

rivets.configure
  prefix: "rv"
  adapter:
    subscribe: (obj, keypath, callback) ->
      callback.wrapped = (m, v) -> callback(v)
      obj.on('change:' + keypath, callback.wrapped)

    unsubscribe: (obj, keypath, callback) ->
      obj.off('change:' + keypath, callback.wrapped)

    read: (obj, keypath) ->
      if keypath is "cid" then return obj.cid
      obj.get(keypath)

    publish: (obj, keypath, value) ->
      if obj.cid
        obj.set(keypath, value);
      else
        obj[keypath] = value
