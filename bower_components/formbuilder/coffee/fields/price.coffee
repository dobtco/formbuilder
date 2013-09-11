Formbuilder.registerField 'price',

  view: """
    <div class='input-line'>
      <span class='above-line'>$</span>
      <span class='dolars'>
        <input type='text' />
        <label>Dollars</label>
      </span>
      <span class='above-line'>.</span>
      <span class='cents'>
        <input type='text' />
        <label>Cents</label>
      </span>
    </div>
  """

  edit: ""

  addButton: """
    <span class="symbol"><span class="icon-dollar"></span></span> Price
  """
