Formbuilder.registerField 'approval',

  name: 'Approval'

  order: 75

  view: """
    <div class='fb-approval-user'>
        <select>
           <option>
              (<%- rf.getSelectedUser(rf.get(Formbuilder.options.mappings.APPROVAL.APPROVER_ID)) %>)
          </option>
        </select>
    </div>
    <div class="fb-signature form-control">
        <div class="fb-signature-placeholder">Sign Here</div>
        <div class="fb-signature-pad"></div>
    </div>
    <button class="btn btn-default btn-xs">Clear</button>
  """

  edit: """
  <%= Formbuilder.templates['edit/approval_options']({ rf: rf }) %>
  <%= Formbuilder.templates['edit/conditional_options']({ rf: rf }) %>
  """

  addButton: """
    <span class="fb-icon-approval"></span> Approval
  """

  defaultAttributes: (attrs, formbuilder) ->
    attrs.initialize = () ->
      @on "change", (model) ->
        selectUser = @get('options.approver')
        if (selectUser) != undefined
          selectUser = JSON.parse(selectUser)
          model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_ID, parseInt(selectUser.id))
          model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME, selectUser.name)

    attrs.getUsers = () ->
      formbuilder.attr('users')

    attrs.getSelectedUser = () ->
      console.log(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME));
      if @options then @options.approver_name else @get(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME)

    attrs.showUsers = () ->
      (parseInt(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE)) == 2)

    attrs.options.approver_type = 2
    attrs



