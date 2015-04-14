Formbuilder.registerField 'datasource',

  name: 'List'

  order: 70

  view: """
    <select>
      <option>
         <%= rf.source().title %>
         (<%= rf.sourceProperty(rf.get(Formbuilder.options.mappings.DATA_SOURCE.VALUE_TEMPLATE)) %>)
      </option>
    </select>
  """

  edit: """
    <%= Formbuilder.templates['edit/data_source_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-data-source"></span> Data Source
  """

  defaultAttributes: (attrs, formbuilder) ->
    attrs.initialize = () ->

      @on "change", (model) ->
        if _.nested(model, 'changed.options.data_source') != undefined
          sourceProperties = _.keys(model.sourceProperties())
          model.set('options.required_properties', sourceProperties)
          valueTemplate = _.first(sourceProperties)
          model.set('options.value_template', valueTemplate)

      @on "destroy", (model) ->
        @collection.each (collectionModel) ->
          if collectionModel.get('options.populate_uuid') is model.get('uuid')
            collectionModel.set('options.populate_uuid', null)
            collectionModel.set('options.populate_from', null)



    attrs.source = () ->
      source = if @options then @options.data_source else @get(Formbuilder.options.mappings.DATA_SOURCE.DATA_SOURCE)
      sources = formbuilder.attr('sources')
      _.nested(sources, source) || null

    attrs.sourceProperties = () ->
      source = @source()
      _.nested(source, 'properties') || []

    attrs.filters = () ->
      source = @source()
      _.nested(source, 'filters') || null

    attrs.currentFilter = () ->
      source = @source()
      _.nested(source, 'filters.' + @get('options.filter')) || {}

    attrs.filterValues = () ->
      @currentFilter().values || {}



    attrs.sourceProperty = (property) ->
      @sourceProperties()[property] || null

    attrs.options.multiple_selections = false
    attrs.options.is_filtered = false
    attrs.options.data_source = attrs.source() || _.keys(formbuilder.attr('sources') || {})[0];
    attrs.options.required_properties = _.keys(attrs.sourceProperties(attrs.options.data_source))
    attrs.options.filter = attrs.filters()
    attrs.options.filter_values = []
    attrs.options.value_template = _.first(attrs.options.required_properties)
    attrs