#= require i18n/translations/form_builder/en
#= require form_builder

getInstance = ->
  $('.fb_main').data('formbuilder-instance')

collectionLength = ->
  getInstance().collection.length

showEditView = (i = 0) ->
  $(".fb_field_wrapper:not(.fb_field_wrapper_id):eq(#{i}) .cover").click()

countViewFieldOptions = ->
  $('.fr_response_field_checkboxes .fr_option').length

countEditFieldOptions = ->
  $('.fb_edit_inner .option').length

firstField = ->
  getInstance().collection.models[0]

countConditions = ->
  $('.fb_edit_section_conditions > .fb_condition').length

viewText = ->
  $('.fb_field_wrapper.editing').text()

selectConditionField = (id) ->
  $("[data-rv-value=\"model.field_options.conditions.0.response_field_id\"]").val("#{id}").trigger('change')

conditionMethods = ->
  $("[data-rv-value=\"model.field_options.conditions.0.method\"] option").map ->
    $(@).val()
  .get()

conditionValueOptions = ->
  $("[data-rv-value=\"model.field_options.conditions.0.value\"] option").map ->
    $(@).val()
  .get()

expectNoErrors = ->
  expect($('.form_error:visible').length).toEqual 0

expectError = (msg) ->
  expect($(".form_error:visible:contains(\"#{msg}\")").length).toEqual 1

describe 'Form builder', ->
  beforeEach ->
    $("<div class='fb_main' data-formbuilder></div>").appendTo('body')

  afterEach ->
    $('.fb_main').remove()

  describe 'basic functionality', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: []

    it 'starts with no fields', ->
      expect(collectionLength()).toEqual(0)

    it 'adds all fields', ->
      i = 0
      for k, field of Formbuilder.FIELD_TYPES
        $("[data-field-type=#{k}]").click()
        expect(collectionLength()).toEqual(1 + i)
        i++

    it 'edits all fields', ->
      for k, field of Formbuilder.FIELD_TYPES
        getInstance().addField(field_type: k, label: k)
        $(".fb_field_wrapper:contains(#{field.name})").click()

        if k in ['page_break', 'block_of_text'] # page_break has no label
          expect($('.js-change-field-type').val()).toEqual(k)
        else
          expect($('[data-rv-input="model.label"]').val()).toEqual(k)

    it 'adds fields in the correct order', ->
      $("[data-field-type=paragraph]").click()
      $('.fb_field_wrapper_id .cover').click()
      $('.js-add-field').click()
      $("[data-field-type=paragraph]").click()
      expect(
        $('.fb_response_fields .fb_field_wrapper').
          index($('.fb_field_wrapper.editing'))
      ).toEqual(0)

  describe 'tracking changed models', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          field_type: 'text'
          label: 'FooBar'
        ]

    it 'pushes when adding a field', ->
      expect(getInstance().changedModels.length).toEqual(0)
      $("[data-field-type=text]").click()
      expect(getInstance().changedModels.length).toEqual(1)

    it 'pushes when editing a field', ->
      showEditView()
      expect(getInstance().changedModels.length).toEqual(0)
      $('[data-rv-input="model.label"]').val('foo').trigger('input')
      expect(getInstance().changedModels.length).toEqual(1)

  describe 'table field', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          field_type: 'table'
          label: 'FooBar'
          field_options: {
            columns: [
              { label: 'hi' }
            ]
          }
        ]

    it 'adds columns', ->
      showEditView()
      expect(firstField().get('field_options.columns').length).toEqual(1)
      $('.js-add-option').click()
      expect(firstField().get('field_options.columns').length).toEqual(2)

    it 'adds preset values', ->
      showEditView()
      $('[data-show-modal="PresetValues"]').click()
      $('.modal [data-col=0]').first().val('preset').trigger('input')
      $('.modal-footer-actions .button').click()
      expect(firstField().get('field_options.preset_values')['hi']).
        toEqual(['preset'])

  describe 'changing field types', ->
    it 'can change for new fields', ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: []

      getInstance().addField(field_type: 'text', label: 'Hello')
      expect(firstField().get('field_type')).toEqual 'text'
      expect($('.js-change-field-type').length).toEqual(1)
      $('.js-change-field-type').val('paragraph').trigger('change')
      expect(firstField().get('field_type')).toEqual 'paragraph'

    it 'can not change for existing fields', ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          label: 'Untitled'
          field_type: 'text'
        ]

      getInstance().showEditPane(firstField())
      expect($('.js-change-field-type').length).toEqual(0)

  describe 'Bulk import options', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          label: 'Untitled'
          field_type: 'checkboxes'
        ]

    it 'functions properly', ->
      showEditView()
      expect(countViewFieldOptions()).toEqual(0)
      expect(countEditFieldOptions()).toEqual(0)
      $('[data-show-modal="BulkAddOptions"]').click()
      $('.modal.in textarea').val("foo\nbar\nbaz")
      $('button:contains("Add options")').click()
      expect(countViewFieldOptions()).toEqual(3)
      expect(countEditFieldOptions()).toEqual(3)

    it 'removes blank options', ->
      getInstance().collection.models[0].set 'field_options.options', [
        { label: '', checked: true }
      ]
      showEditView()
      expect(countViewFieldOptions()).toEqual(1)
      $('[data-show-modal="BulkAddOptions"]').click()
      $('.modal.in textarea').val("foo\nbar\nbaz")
      $('button:contains("Add options")').click()
      expect(countViewFieldOptions()).toEqual(3)
      expect(countEditFieldOptions()).toEqual(3)

  describe 'Conditionals', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 1
          label: 'Field One'
          field_type: 'text'
        ,
          id: 2
          label: 'Field Two'
          field_type: 'number'
        ,
          id: 3
          label: 'Field Three'
          field_type: 'checkboxes'
          field_options:
            options: [
              label: 'Option One'
              checked: true
            ,
              label: 'Option Two'
              checked: false
            ]
        ,
          id: 4
          label: 'Field Four'
          field_type: 'confirm'
        ,
          id: 5
          label: 'Field five'
          field_type: 'text'
        ]

    it 'adds and removes conditions', ->
      showEditView(1)
      expect(viewText()).not.toContain('Hidden until rules')
      $('a:contains("Add a rule")').click()
      expect(countConditions()).toEqual(1)
      expect(viewText()).toContain('Hidden until rules')
      $('a:contains("Add a rule")').click()
      expect(countConditions()).toEqual(2)
      $('.fb_condition_remove').click()
      expect(countConditions()).toEqual(1)
      $('.fb_condition_remove').click()
      expect(countConditions()).toEqual(0)

    it 'cannot add conditions to the first field', ->
      showEditView(0)
      expect(viewText()).not.toContain('Hidden until rules')
      expect($('a:contains("Add a rule")').length).toEqual(0)
      expect(countConditions()).toEqual(0)

    it 'allows condition methods based on the field type', ->
      showEditView(2)
      $('a:contains("Add a rule")').click()
      expect(conditionMethods()).toEqual(
        ['eq', 'contains', 'not', 'does_not_contain', 'shorter', 'longer']
      )
      selectConditionField(2)
      expect(conditionMethods()).toEqual ['eq', 'not', 'lt', 'gt']

    it 'shows options for checkbox conditions', ->
      showEditView(3)
      $('a:contains("Add a rule")').click()
      selectConditionField(3)
      expect(conditionValueOptions()).toEqual ['Option One', 'Option Two']

    it 'shows options for confirm conditions', ->
      showEditView(4)
      $('a:contains("Add a rule")').click()
      selectConditionField(4)
      expect(conditionValueOptions()).toEqual ['Yes', 'No']

  describe 'Validation', ->
    it 'does not show errors when loading a blank form', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      expect(fb.state.get('hasValidationErrors')).toEqual(undefined)

    it 'shows errors when loading a form with errors', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [
        {
          field_type: 'text'
          field_options:
            minlength: 9
            maxlength: 8
        }
      ])
      expect(fb.state.get('hasValidationErrors')).toEqual(true)

    it 'does not validate for the incorrect field type', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [
        {
          field_type: 'text'
          field_options:
            options: [
              label: ''
            ]
        }
      ])
      expect(fb.state.get('hasValidationErrors')).toEqual(undefined)

    it 'does not allow duplicate column names', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=table]").click()
      $col2label = $('[data-rv-input="model.field_options.columns.1.label"]')
      $col2label.val('Column 1').trigger('input')
      expectError('duplicate names')
      $col2label.val('Column whatever').trigger('input')
      expectNoErrors()

    it 'clears non-numeric length validations on blur', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('asfd').trigger('input').trigger('blur')
      expect($minlength.val()).toEqual ''

    it 'clears a validation of "0" on blur', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('0').trigger('input').trigger('blur')
      expect($minlength.val()).toEqual ''

    it 'parses to int', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('4sdf').trigger('input').trigger('blur')
      expect($minlength.val()).toEqual '4'

    it 'parses to float', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=number]").click()
      $min = $('[data-rv-input="model.field_options.min"]')
      $min.val('4sdf').trigger('input').trigger('blur')
      expect($min.val()).toEqual '4'

    it 'requires at least one option to be present', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=checkboxes]").click()
      expect($('.drag_list_remove').length).toEqual 2
      $('.drag_list_remove').click()
      expect($('.drag_list_remove').length).toEqual 0

    it 'requires at least one column to be present', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=table]").click()
      expect($('.drag_list_remove').length).toEqual 2
      $('.drag_list_remove').click()
      expect($('.drag_list_remove').length).toEqual 0

    it 'shows an error if min/max is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=number]").click()
      $min = $('[data-rv-input="model.field_options.min"]')
      $max = $('[data-rv-input="model.field_options.max"]')
      $min.val('5').trigger('input')
      $max.val('4').trigger('input')
      expectNoErrors()
      $max.trigger('blur')
      expectError('maximum larger')
      $max.val('6').trigger('input')
      expectNoErrors()

    it 'shows an error if min/max length is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=paragraph]").click()
      $min = $('[data-rv-input="model.field_options.minlength"]')
      $max = $('[data-rv-input="model.field_options.maxlength"]')
      $min.val('5').trigger('input').trigger('blur')
      $max.val('4').trigger('input').trigger('blur')
      expectError('maximum larger')
      $max.val('6').trigger('input')
      expectNoErrors()

    it 'shows an error if min/max rows is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=table]").click()
      $min = $('[data-rv-input="model.field_options.minrows"]')
      $max = $('[data-rv-input="model.field_options.maxrows"]')
      $min.val('5').trigger('input').trigger('blur')
      $max.val('4').trigger('input').trigger('blur')
      expectError('maximum larger')
      $max.val('6').trigger('input')
      expectNoErrors()

    it 'shows an error if option text is blank', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=checkboxes]").click()
      $opt = $('[data-rv-input="model.field_options.options.0.label"]')
      $opt.val('').trigger('input').trigger('blur')
      expectError('enter text')
      $opt.val('foo').trigger('input')
      expectNoErrors()

    it 'shows an error if column text is blank', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=table]").click()
      $col = $('[data-rv-input="model.field_options.columns.0.label"]')
      $col.val('').trigger('input').trigger('blur')
      expectError('enter a label')
      $col.val('foo').trigger('input')
      expectNoErrors()

    it 'clears errors when switching the field type', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("[data-field-type=number]").click()
      $('[data-rv-input="model.field_options.min"]').val('5').trigger('input')
      $('[data-rv-input="model.field_options.max"]').val('4').trigger('input')
        .trigger('blur')
      expectError('maximum larger')
      $('.js-change-field-type').val('text').trigger('change')
      expectNoErrors()

  describe 'Changing the identification level', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: []
        project:
          anonymous: false
          registered: false
          hide_responder_names: false

    it 'functions properly', ->
      expect($(".js-id-field-wrapper").length).toEqual 1
      $('.fb_field_wrapper_id .cover').click()
      $('[data-rv-checked="project.registered"]').click()
      expect($(".js-id-field-wrapper").length).toEqual 0
      expect($(".user_block").length).toEqual 1
      $('[data-remove-id-fields]').click()
      expect($(".user_block").length).toEqual 0
      expect($(".fb_id_blank").length).toEqual 1

  describe 'the fb_move buttons', ->
    beforeEach ->
      new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 1
          label: 'Name'
          field_type: 'text'
        ,
          id: 2
          label: 'Email'
          field_type: 'text'
        ,
          id: 3
          label: 'Occupation'
          field_type: 'text'
        ]

    expectCorrectSorterClasses = ->
      expect($('.fb_field_wrapper:eq(1) [data-sort-up]').hasClass('disabled')).
        toEqual true

      expect($('.fb_field_wrapper:eq(1) [data-sort-down]').hasClass('disabled')).
        toEqual false

      expect($('.fb_field_wrapper:eq(2) [data-sort-up]').hasClass('disabled')).
        toEqual false

      expect($('.fb_field_wrapper:eq(2) [data-sort-down]').hasClass('disabled')).
        toEqual false

      expect($('.fb_field_wrapper:eq(3) [data-sort-up]').hasClass('disabled')).
        toEqual false

      expect($('.fb_field_wrapper:eq(3) [data-sort-down]').hasClass('disabled')).
        toEqual true

    it 'renders the sorters properly', ->
      expectCorrectSorterClasses()

      # after editing a field
      showEditView()
      $('[data-rv-input="model.label"]').val('foo').trigger('input')
      expectCorrectSorterClasses()

      # after reordering
      $('.fb_field_wrapper:eq(3) [data-sort-up]').click()
      expectCorrectSorterClasses()
