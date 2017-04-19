Formbuilder.registerField 'time',

  name: 'Time'

  order: 25

  view: """
  <div class="form-group">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="12:00 PM">
      <div class="input-group-addon glyphicon glyphicon-time"></div>
    </div>
  </div>
  """

  edit: """
    <%= Formbuilder.templates['edit/time']({ rf: rf }) %>
    <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-time"></span> Time
  """

  defaultAttributes: (attrs) ->
    attrs.options.default_time = false
    attrs
