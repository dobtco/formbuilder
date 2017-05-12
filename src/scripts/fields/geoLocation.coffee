Formbuilder.registerField 'geolocation',

  name: 'GeoLocation'

  order: 60

  element_type: 'non_input'

  view: """
    <div class="form-group">
     <button id='' class='fb-button'>Get GeoLocation</button>
    <span><%=rf.geolocationFunctionality%></span>
    </div>
  """

  edit: """
  <div class="fb-edit-section-header">Details</div>
  <div class="fb-common-wrapper">
  <div class="fb-label-description">
    <input type="text" data-rv-input="model.<%= Formbuilder.options.mappings.LABEL %>">
    <textarea data-rv-input="model.<%= Formbuilder.options.mappings.DESCRIPTION %>" placeholder="Add a longer description to this field">
    </textarea>
  </div>
  </div>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-geolocation"></span> GeoLocation
  """
