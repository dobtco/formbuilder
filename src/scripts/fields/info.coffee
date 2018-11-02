Formbuilder.registerField 'info',

  name: 'Info'

  order: 20

  element_type: 'non_input'

  view: """
    <label class='section-name'><%- rf.get(Formbuilder.options.mappings.LABEL) %></label>
    <p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>
  """

  # Info uses CK editor so we directly output HTML here

  edit: """
  <div class="fb-edit-section-header">Details</div>
  <div class="fb-common-wrapper">
    <div class="fb-label-description">
      <input type="text" data-rv-input="model.<%= Formbuilder.options.mappings.LABEL %>">
    </div>
    <textarea class="fb-info-editor" style="display:none;" data-rv-input="model.<%= Formbuilder.options.mappings.DESCRIPTION %>">
    </textarea>
  </div>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-info"></span> Info
  """

  onEdit: (model) ->
    update = ->
        model.set(Formbuilder.options.mappings.DESCRIPTION, $(@).code())
        model.trigger('change:' + Formbuilder.options.mappings.DESCRIPTION)
    $('.fb-info-editor').summernote(
        onChange: -> update.call(@)
        onKeyup: -> update.call(@)
        toolbar: [
          ['style', ['bold', 'italic', 'underline']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['insert', ['link']],
          ['table', ['table']],
          ['misc', ['codeview']]
        ]
    )
