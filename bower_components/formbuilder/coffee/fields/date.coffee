Formbuilder.registerField 'date',

  view: """
    <div class='input-line'>
      <span class='month'>
        <input type="text" />
        <label>MM</label>
      </span>

      <span class='above-line'>/</span>

      <span class='day'>
        <input type="text" />
        <label>DD</label>
      </span>

      <span class='above-line'>/</span>

      <span class='year'>
        <input type="text" />
        <label>YYYY</label>
      </span>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-calendar"></span></span> Date
  """
