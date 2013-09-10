# else
#   attrs

# switch attrs.field_type
#   when "checkboxes", "dropdown", "radio"
#     attrs.field_options.options = [
#       label: "",
#       checked: false
#     ,
#       label: "",
#       checked: false
#     ]

#   when "dropdown"
#     attrs.field_options.include_blank_option = false

#   when "text", "paragraph"
#     attrs.field_options.size = "small"

# attrs

# FormBuilder.RESPONSE_FIELD_TYPES =
#   email: ''
#   address: ''

# FormBuilder.RESPONSE_FIELD_NON_INPUT_TYPES =
#   section_break: "<span class='symbol'><span class='icon-minus'></span></span> Section Break"
