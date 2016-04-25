Formbuilder.getConditionAt = (model, i) ->
  model.getConditions()[i] || {}

Formbuilder.columnOrOptionKeypath = (model) ->
  switch model.field_type
    when 'table'
      'field_options.columns'
    when 'checkboxes', 'radio', 'dropdown'
      'field_options.options'

Formbuilder.hasColumnsOrOptions = (model) ->
  !!Formbuilder.columnOrOptionKeypath(model)

Formbuilder.addOptionOrColumn = (model, i) ->
  opts = if model.field_type == 'table' then model.getColumns() else model.getOptions()
  newOpts = opts.slice(0)
  newOpt =
    label: "#{if model.field_type == 'table' then 'Column' else 'Option'} #{opts.length + 1}"
  newOpt.checked = false unless model.field_type == 'table'
  newOpts.push newOpt
  model.set Formbuilder.columnOrOptionKeypath(model), newOpts

Formbuilder.removeOptionOrColumn = (model, i) ->
  opts = model.get(Formbuilder.columnOrOptionKeypath(model))
  newOpts = opts.slice(0)
  newOpts.splice i, 1
  model.set Formbuilder.columnOrOptionKeypath(model), newOpts

Formbuilder.orderOptions = (model, newOrder) ->
  opts = model.get(Formbuilder.columnOrOptionKeypath(model))
  newOpts = _.sortBy opts.slice(0), (_opt, i) ->
    _.indexOf(newOrder, i)
  model.set Formbuilder.columnOrOptionKeypath(model), newOpts

