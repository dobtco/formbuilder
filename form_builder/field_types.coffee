sizeMed = ->
  field_options:
    size: 'medium'

# Default options for checkbox/radio/dropdown fields
defaultOptions = ->
  [
    label: "#{t('formbuilder.option')} 1",
    checked: false
  ,
    label: "#{t('formbuilder.option')} 2",
    checked: false
  ]

# All fields, categorized
Formbuilder.FIELD_CATEGORIES =
  inputs:
    text:
      icon: 'font'
      defaultAttributes: sizeMed
    paragraph:
      buttonHtml: '<span class="symbol">&#182;</span>'
      defaultAttributes: sizeMed
    checkboxes:
      icon: 'check'
      defaultAttributes: ->
        field_options:
          options: defaultOptions()
    radio:
      icon: 'circle-o'
      defaultAttributes: ->
        field_options:
          options: defaultOptions()
    confirm:
      icon: 'check-circle'
    date:
      icon: 'calendar'
    dropdown:
      icon: 'caret-down'
      defaultAttributes: ->
        field_options:
          options: defaultOptions()
          include_blank_option: false
    time:
      icon: 'clock-o'
      defaultAttributes: ->
        field_options:
          disable_seconds: true
    number:
      buttonHtml: '<span class="symbol">123</span>'
    phone:
      icon: 'phone'
      defaultAttributes: ->
        field_options:
          phone_format: 'us'
    website:
      icon: 'link'
    email:
      icon: 'envelope'
    price:
      icon: 'usd'
    address:
      icon: 'home'
    file:
      icon: 'cloud-upload'
    table:
      icon: 'table'
      defaultAttributes: ->
        field_options:
          columns: [
            label: "#{t('formbuilder.column')} 1"
          ,
            label: "#{t('formbuilder.column')} 2"
          ]
  geographic:
    map_marker:
      icon: 'map-marker'
  non_input:
    section_break:
      icon: 'minus'
      defaultAttributes: sizeMed
    page_break:
      icon: 'file'
    block_of_text:
      icon: 'font'
      defaultAttributes: ->
        field_options:
          size: 'medium'
          description: t('formbuilder.enter_text_here')

# Flatten fields from above
Formbuilder.FIELD_TYPES = _.extend.apply(@,
  _.union({}, _.values(Formbuilder.FIELD_CATEGORIES))
)
