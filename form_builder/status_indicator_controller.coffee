class Formbuilder.StatusIndicatorController
  constructor: (options) ->
    _.extend @, Backbone.Events
    { @fb } = options
    @$el = $('.save_status')
    @$btn = $('.bottom_status_bar_buttons .continue_button')
    @listenTo @fb, 'refreshStatus', @updateClass

  updateClass: ->
    @$el.removeClass('is_error is_saving is_invalid')
    @$btn.removeClass('disabled')

    if @fb.state.get('hasServerErrors')
      @$el.addClass('is_error')
    else if @fb.state.get('hasValidationErrors')
      @$btn.addClass('disabled')
      @$el.addClass('is_invalid')
    else if @fb.autosaver.isPending()
      @$el.addClass('is_saving')

