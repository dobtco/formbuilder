Formbuilder.registerField 'price',

  name: 'Price'

  order: 45

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
    <span class="icon-price"></span> Price
  """
