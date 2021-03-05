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
  <%= Formbuilder.templates['edit/inline_image_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/inline_action_option']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-info"></span> Info
  """

  onEdit: (model) ->
    defaultProtocol = 'http://'
    update = ->
        model.set(Formbuilder.options.mappings.DESCRIPTION, $(@).summernote('code'))
        model.trigger('change:' + Formbuilder.options.mappings.DESCRIPTION)
    $('.fb-info-editor').summernote(
        callbacks: {
          onChange: -> update.call(@)
          onKeyup: -> update.call(@)
          onInit: ->
            # Bit of a hack here, the plugin currently only enforces the http protocol on a create - not on an update.
            insertLinkBtn = document.querySelector('input.note-link-btn')
            noteLinkUrl = document.querySelector('.note-link-url')
            insertLinkBtn.addEventListener('click', ->
              url = noteLinkUrl.value
              if (url.substring(0, 8) != 'https://' && url.substring(0, 7) != 'http://')
                noteLinkUrl.value = defaultProtocol + url
            )
        }
        disableDragAndDrop: true
        linkTargetBlank: true
        useProtocol: true
        defaultProtocol: defaultProtocol
        toolbar: [
          ['style', ['bold', 'italic', 'underline']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['insert', ['link']],
          ['table', ['table']],
          ['misc', ['codeview']]
        ]
    )
