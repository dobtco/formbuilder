rivets.configure
  prefix: 'rv'

rivets.binders.input =
  publishes: true
  routine: rivets.binders.value.routine
  bind: (el) ->
    el.addEventListener('input', this.publish)
  unbind: (el) ->
    el.removeEventListener('input', this.publish)
