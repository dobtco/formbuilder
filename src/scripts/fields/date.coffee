Formbuilder.registerField 'date',

  name: 'Date'

  order: 20

  view: """
    <div class='input-line'>
      <input type="text" placeholder=" DD/MM/YYYY " />
    </div>
  """

  edit: "<%= Formbuilder.templates['edit/date']({ rf: rf }) %>"

  addButton: """
    <span class="fb-icon-date"></span> Date
  """
  defaultAttributes: (attrs) ->
    attrs.options.default_date = false
    attrs