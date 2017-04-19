Formbuilder.registerField 'signature',

  name: 'Signature'

  order: 65

  view: """
    <div class="fb-signature form-control">
        <div class="fb-signature-placeholder">Sign Here</div>
        <div class="fb-signature-pad"></div>
    </div>
    <button class="btn btn-default btn-xs">Clear</button>
  """

  edit: """
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-signature"></span> Signature
  """
