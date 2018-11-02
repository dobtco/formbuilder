Formbuilder.registerField 'grid',

  name: 'Layout Grid'

  order: 30

  element_type: 'non_input'

  view: """
    <label class='section-name'><%- rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <table class="response-field-grid-table">
    </table>
    <p><%- rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  edit: """
  <div class="fb-edit-section-header">Details</div>
  <div class="fb-common-wrapper">
      <div class="fb-label-description">
        <input type="text" data-rv-input="model.<%= Formbuilder.options.mappings.LABEL %>">
        <textarea data-rv-input="model.<%= Formbuilder.options.mappings.DESCRIPTION %>" placeholder="Add a longer description to this field">
        </textarea>
      </div>
      <label class="checkbox">
         <input type='checkbox' data-rv-checked='model.<%= Formbuilder.options.mappings.GRID.FULL_WIDTH %>' /> Display full width?
      </label>
      <label class="checkbox">
         <input type='checkbox' data-rv-checked='model.<%= Formbuilder.options.mappings.GRID.FIRST_ROW_HEADINGS%>' /> First row headings?
      </label>
      <div class='fb-edit-section-header'>Number of Columns</div>
        <select data-rv-value="model.<%= Formbuilder.options.mappings.GRID.NUMCOLS %>">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
      <div class='fb-edit-section-header'>Number of Rows</div>
        <select data-rv-value="model.<%= Formbuilder.options.mappings.GRID.NUMROWS %>">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
        </select>
      </div>
  </div>
  """

  addButton: """
    <span class="fb-icon-grid"></span> Grid
  """

  defaultAttributes: (attrs) ->
    # @todo
    attrs.options.num_cols = 1
    attrs.options.num_rows = 1
    attrs.options.full_width = false
    attrs.options.first_row_headings = false
    attrs.children = []
    attrs.childModels = () ->
      @collection.filter (model) ->
        _.indexOf(@get('options.elements'), model.get('uuid')) != -1
      , @
    attrs