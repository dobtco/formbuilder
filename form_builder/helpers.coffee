# "before" and "after" are not yet supported in formrenderer-base
Formbuilder.conditionsByType = (type) ->
  _.reject App.ResponseConditions.byFieldType(type), (condition) ->
    condition.key in ['before', 'after']

Formbuilder.classify = (field_type) ->
  "ResponseField#{_.str.classify(field_type)}"

allFalseErrors = _.tap {}, (h) ->
  h[k] = false for k, _ of Formbuilder.Validators

Formbuilder.buildModel = (attrs) ->
  new FormRenderer.Models[Formbuilder.classify(attrs.field_type)](_.extend(
    attrs,
    errors: allFalseErrors
    isFbValid: true
  ))

Formbuilder.optionsForResponseField = (model) ->
  if model.field_type in ['dropdown', 'checkboxes', 'radio']
    _.map model.getOptions(), (opt) ->
      opt.label
  else if model.field_type == 'confirm'
    App.ResponseConditions.yesNo

Formbuilder.defaultFieldAttrs = (field_type) ->
  _.extend({
    label: t('untitled'),
    field_type: field_type,
    required: true,
    field_options: {}
  }, Formbuilder.FIELD_TYPES[field_type].defaultAttributes?() || {})

Formbuilder.disableTabbing = ($el) ->
  $el.find('a, button, :input').attr('tabindex', '-1')
