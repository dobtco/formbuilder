Formbuilder.Validators =
  duplicateColumns: (model) ->
    return false unless model.field_type == 'table'
    colNames = _.map model.getColumns(), (col) -> col.label
    _.uniq(colNames).length != colNames.length

  minMaxMismatch: (model) ->
    return false unless model.field_type == 'number'
    min = parseFloat(model.get('field_options.min'))
    max = parseFloat(model.get('field_options.max'))

    !!(min && max && min >= max)

  minMaxLengthMismatch: (model) ->
    unless model.field_type == 'paragraph' || model.field_type == 'text'
      return false

    min = parseInt(model.get('field_options.minlength'), 10)
    max = parseInt(model.get('field_options.maxlength'), 10)

    !!(min && max && min > max)

  minMaxRowsMismatch: (model) ->
    return false unless model.field_type == 'table'
    min = parseInt(model.get('field_options.minrows'), 10)
    max = parseInt(model.get('field_options.maxrows'), 10)

    !!(min && max && min > max)

  blankOption: (model) ->
    return false unless model.field_type in ['radio', 'checkboxes', 'dropdown']
    _.any model.getOptions(), (opt) ->
      !opt.label

  blankColumn: (model) ->
    return false unless model.field_type == 'table'
    _.any model.getColumns(), (col) ->
      !col.label
