Formbuilder.registerField 'approval',

  name: 'Approval'

  order: 75

  view: """
    <div class='fb-approval-user'>
        <select>
           <option>
               <% if (rf.get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE) == 1) { %>
                  Any User
               <% } else { %>
                (<%- rf.getSelectedUser(rf.get(Formbuilder.options.mappings.APPROVAL.APPROVER_ID)) %>)
              <% }%>
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

  onEdit: (model) ->
    $('.fb-approval-user-select').select2()

  defaultAttributes: (attrs, formbuilder) ->
    attrs.initialize = () ->
      @on "change", (model) ->
        parent = @conditionalParent()
        if parent && parent.get('type') == 'approval'
          model.set(Formbuilder.options.mappings.CONDITIONAL_VALUES, 1)

        if parseInt(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE)) == 1
          model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_ID, undefined)
        else
          selectUser = @get('options.approver')
          if (selectUser) != undefined
            model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_ID, parseInt(selectUser))

    attrs.getApprovers = () ->
      formbuilder.attr('approvers')

    attrs.getSelectedUserName = (selectUser) ->
      if selectUser
         selectUser.full_name + ' (' + selectUser.username + ')'

    attrs.getSelectedUser = () ->
      if @options
        user_id = options.approver_id
      else
        user_id = @get(Formbuilder.options.mappings.APPROVAL.APPROVER_ID)

      approvers = @getApprovers() || []
      user = approvers.filter (item) -> parseInt(item.id) == user_id

      @getSelectedUserName(user[0])

    attrs.showApprovers = () ->
      (parseInt(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE)) == 2)

    attrs.options.approver_type = 1
    attrs



