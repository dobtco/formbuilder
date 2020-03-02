Formbuilder.registerField 'geolocation',

  name: 'Geolocation'

  order: 60

  view: """
    <div class="form-group">
     <button class='fb-button'>Get GeoLocation</button>
    </div>
    <span><%=rf.geolocationFunctionality%></span>
  """

  edit: """
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-geolocation"></span> GeoLocation
  """

