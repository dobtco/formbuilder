# Shared helpers for shortcuts and the form builder, since they both use
# the concept of 'response conditions.'

methods =
  date: ['eq', 'not', 'before', 'after']
  dropdown: ['eq', 'not']
  email: ['eq', 'contains', 'not', 'does_not_contain']
  number: ['eq', 'not', 'lt', 'gt']
  paragraph: ['eq', 'contains', 'not', 'does_not_contain', 'shorter', 'longer']
  price: ['eq', 'not', 'lt', 'gt']
  radio: ['eq', 'not']
  text: ['eq', 'contains', 'not', 'does_not_contain', 'shorter', 'longer']
  time: ['eq', 'not', 'before', 'after']
  website: ['eq', 'contains', 'not', 'does_not_contain']
  confirm: ['eq', 'not']
  checkboxes: ['contains', 'does_not_contain']
  address: ['contains', 'does_not_contain']
  table: ['contains', 'does_not_contain']
  phone: ['contains', 'does_not_contain']

App.ResponseConditions =
  yesNo: ['Yes', 'No']

  hasPredefinedOptions: (fieldType) ->
    fieldType in ['dropdown', 'checkboxes', 'radio', 'confirm']

  byFieldType: (checkType) ->
    if methods[checkType]
      _.tap [], (a) ->
        for i in methods[checkType]
          a.push(key: i, label: t("response_conditions.#{i}"))
    else
      []
