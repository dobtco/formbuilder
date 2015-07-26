#= require form_renderer_dependencies
#= require form_builder

describe 'Form builder', ->
  fixture.set "<div class='fb_main' data-formbuilder></div>"

  before ->
    @showEditView = (i = 0) ->
      $(".fb_field_wrapper:eq(#{i}) .cover").click()

    @countViewFieldOptions = ->
      $('.fr_response_field_checkboxes .fr_option').length

    @countEditFieldOptions = ->
      $('.fb_edit_inner .option').length

    @collectionLength = ->
      @fb.collection.length

    @firstField = ->
      @fb.collection.models[0]

    @countConditions = ->
      $('.fb_edit_section_conditions > .fb_edit_section_horiz').length

    @viewText = ->
      $('.fb_field_wrapper.editing').text()

    @selectConditionField = (id) ->
      $("[data-rv-value=\"model.field_options.conditions.0.response_field_id\"]").val("#{id}").trigger('change')

    @conditionMethods = ->
      $("[data-rv-value=\"model.field_options.conditions.0.method\"] option").map ->
        $(@).val()
      .get()

    @conditionValueOptions = ->
      $("[data-rv-value=\"model.field_options.conditions.0.value\"] option").map ->
        $(@).val()
      .get()

    @expectNoErrors = ->
      expect($('.form_error:visible').length).to.eql 0

    @expectError = (msg) ->
      expect($(".form_error:visible:contains(\"#{msg}\")").length).to.eql 1

  describe 'basic functionality', ->
    beforeEach ->
      @fb = new Formbuilder
        selector: '.fb_main'
        bootstrapData: []

    it 'starts with no fields', ->
      expect(@collectionLength()).to.be(0)

    it 'adds all fields', ->
      i = 0
      for k, field of Formbuilder.FIELD_TYPES
        $("a[data-field-type=#{k}]").click()
        expect(@collectionLength()).to.be(1 + i)
        i++

    it 'edits all fields', ->
      for k, field of Formbuilder.FIELD_TYPES
        @fb.addField(field_type: k, label: k)
        $(".fb_field_wrapper:contains(#{field.name})").click()

        if k in ['page_break', 'block_of_text'] # page_break has no label
          expect($('.js-change-field-type').val()).to.be(k)
        else
          expect($('[data-rv-input="model.label"]').val()).to.be(k)

  describe 'changing field types', ->
    it 'can change for new fields', ->
      @fb = new Formbuilder
        selector: '.fb_main'
        bootstrapData: []

      @fb.addField(field_type: 'text', label: 'Hello')
      expect(@firstField().get('field_type')).to.be 'text'
      expect($('.js-change-field-type').length).to.be(1)
      $('.js-change-field-type').val('paragraph').trigger('change')
      expect(@firstField().get('field_type')).to.be 'paragraph'

    it 'can not change for existing fields', ->
      @fb = new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          label: 'Untitled'
          field_type: 'text'
        ]

      @fb.showEditPane(@firstField())
      expect($('.js-change-field-type').length).to.be(0)

  describe 'Bulk import options', ->
    beforeEach ->
      @fb = new Formbuilder
        selector: '.fb_main'
        bootstrapData: [
          id: 123
          label: 'Untitled'
          field_type: 'checkboxes'
        ]

    it 'functions properly', ->
      @showEditView()
      expect(@countViewFieldOptions()).to.be(0)
      expect(@countEditFieldOptions()).to.be(0)
      $('[data-show-modal="BulkAddOptions"]').click()
      $('.modal.in textarea').val("foo\nbar\nbaz")
      $('button:contains("Add options")').click()
      expect(@countViewFieldOptions()).to.be(3)
      expect(@countEditFieldOptions()).to.be(3)

    it 'removes blank options', ->
      @fb.collection.models[0].set 'field_options.options', [
        { label: '', checked: true }
      ]
      @showEditView()
      expect(@countViewFieldOptions()).to.be(1)
      $('[data-show-modal="BulkAddOptions"]').click()
      $('.modal.in textarea').val("foo\nbar\nbaz")
      $('button:contains("Add options")').click()
      expect(@countViewFieldOptions()).to.be(3)
      expect(@countEditFieldOptions()).to.be(3)

  describe 'Conditionals', ->
    beforeEach ->
      @fb = new Formbuilder
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
          field_type: 'text'
        ]

    it 'adds and removes conditions', ->
      @showEditView(1)
      expect(@viewText()).to.not.have.string('Hidden until rules')
      $('a:contains("Add a rule")').click()
      expect(@countConditions()).to.be(1)
      expect(@viewText()).to.have.string('Hidden until rules')
      $('a:contains("Add a rule")').click()
      expect(@countConditions()).to.be(2)
      $('a:contains("Remove this rule")').click()
      expect(@countConditions()).to.be(1)
      $('a:contains("Remove this rule")').click()
      expect(@countConditions()).to.be(0)

    it 'cannot add conditions to the first field', ->
      @showEditView(0)
      expect(@viewText()).to.not.have.string('Hidden until rules')
      expect($('a:contains("Add a rule")').length).to.be(0)
      expect(@countConditions()).to.be(0)

    it 'allows condition methods based on the field type', ->
      @showEditView(2)
      $('a:contains("Add a rule")').click()
      expect(@conditionMethods()).to.eql ['eq', 'contains', 'shorter', 'longer']
      @selectConditionField(2)
      expect(@conditionMethods()).to.eql ['eq', 'lt', 'gt']

    it 'shows options for checkbox conditions', ->
      @showEditView(3)
      $('a:contains("Add a rule")').click()
      @selectConditionField(3)
      expect(@conditionValueOptions()).to.eql ['Option One', 'Option Two']

  describe 'Validation', ->
    it 'does not show errors when loading a blank form', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      expect(fb.state.get('hasValidationErrors')).to.eql(undefined)

    it 'shows errors when loading a form with errors', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [
        {
          field_type: 'text'
          field_options:
            minlength: 9
            maxlength: 8
        }
      ])
      expect(fb.state.get('hasValidationErrors')).to.eql(true)

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
      expect(fb.state.get('hasValidationErrors')).to.eql(undefined)

    it 'does not allow duplicate column names', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=table]").click()
      $col2label = $('[data-rv-input="model.field_options.columns.1.label"]')
      $col2label.val('Column 1').trigger('input')
      @expectError('duplicate names')
      $col2label.val('Column whatever').trigger('input')
      @expectNoErrors()

    it 'clears non-numeric length validations on blur', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('asfd').trigger('input').trigger('blur')
      expect($minlength.val()).to.eql ''

    it 'clears a validation of "0" on blur', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('0').trigger('input').trigger('blur')
      expect($minlength.val()).to.eql ''

    it 'parses to int', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=text]").click()
      $minlength = $('[data-rv-input="model.field_options.minlength"]')
      $minlength.val('4sdf').trigger('input').trigger('blur')
      expect($minlength.val()).to.eql '4'

    it 'parses to float', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=number]").click()
      $min = $('[data-rv-input="model.field_options.min"]')
      $min.val('4sdf').trigger('input').trigger('blur')
      expect($min.val()).to.eql '4'

    it 'requires at least one option to be present', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=checkboxes]").click()
      expect($('.drag_list_remove').length).to.eql 2
      $('.drag_list_remove').click()
      expect($('.drag_list_remove').length).to.eql 0

    it 'requires at least one column to be present', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=table]").click()
      expect($('.drag_list_remove').length).to.eql 2
      $('.drag_list_remove').click()
      expect($('.drag_list_remove').length).to.eql 0

    it 'shows an error if min/max is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=number]").click()
      $min = $('[data-rv-input="model.field_options.min"]')
      $max = $('[data-rv-input="model.field_options.max"]')
      $min.val('5').trigger('input')
      $max.val('4').trigger('input')
      @expectNoErrors()
      $max.trigger('blur')
      @expectError('maximum larger')
      $max.val('6').trigger('input')
      @expectNoErrors()

    it 'shows an error if min/max length is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=paragraph]").click()
      $min = $('[data-rv-input="model.field_options.minlength"]')
      $max = $('[data-rv-input="model.field_options.maxlength"]')
      $min.val('5').trigger('input').trigger('blur')
      $max.val('4').trigger('input').trigger('blur')
      @expectError('maximum length larger')
      $max.val('6').trigger('input')
      @expectNoErrors()

    it 'shows an error if min/max rows is mismatched', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=table]").click()
      $min = $('[data-rv-input="model.field_options.minrows"]')
      $max = $('[data-rv-input="model.field_options.maxrows"]')
      $min.val('5').trigger('input').trigger('blur')
      $max.val('4').trigger('input').trigger('blur')
      @expectError('maximum larger')
      $max.val('6').trigger('input')
      @expectNoErrors()

    it 'shows an error if option text is blank', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=checkboxes]").click()
      $opt = $('[data-rv-input="model.field_options.options.0.label"]')
      $opt.val('').trigger('input').trigger('blur')
      @expectError('enter text')
      $opt.val('foo').trigger('input')
      @expectNoErrors()

    it 'shows an error if column text is blank', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=table]").click()
      $col = $('[data-rv-input="model.field_options.columns.0.label"]')
      $col.val('').trigger('input').trigger('blur')
      @expectError('enter a label')
      $col.val('foo').trigger('input')
      @expectNoErrors()

    it 'clears errors when switching the field type', ->
      fb = new Formbuilder(selector: '.fb_main', bootstrapData: [])
      $("a[data-field-type=number]").click()
      $('[data-rv-input="model.field_options.min"]').val('5').trigger('input')
      $('[data-rv-input="model.field_options.max"]').val('4').trigger('input')
        .trigger('blur')
      @expectError('maximum larger')
      $('.js-change-field-type').val('text').trigger('change')
      @expectNoErrors()

