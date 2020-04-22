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
        if parseInt(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE)) == 1
          model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_ID, undefined)
          model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME, undefined)
        else
          selectUser = @get('options.approver')
          if (selectUser) != undefined
            selectUser = JSON.parse(selectUser)
            model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_ID, parseInt(selectUser.id))
            model.set(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME, selectUser.name)

    attrs.getUsers = () ->
      formbuilder.attr('users')

    attrs.getSelectedUser = () ->
      if @options then @options.approver_name else @get(Formbuilder.options.mappings.APPROVAL.APPROVER_NAME)

    attrs.showUsers = () ->
      (parseInt(@get(Formbuilder.options.mappings.APPROVAL.APPROVER_TYPE)) == 2)

    attrs.options.approver_type = 1
    attrs



