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

  edit: ""

  addButton: """
    <span class="fb-icon-time"></span> Time
  """
