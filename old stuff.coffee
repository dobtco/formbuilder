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
#   checkboxes: '<span class="symbol"><span class="icon-check-empty"></span></span> Checkboxes'
#   radio: '<span class="symbol"><span class="icon-circle-blank"></span></span> Multiple Choice'
#   dropdown: '<span class="symbol"><span class="icon-caret-down"></span></span> Dropdown'
#   price: '<span class="symbol"><span class="icon-dollar"></span></span> Price'
#   number: '<span class="symbol"><span class="icon-number">123</span></span> Number'
#   date: '<span class="symbol"><span class="icon-calendar"></span></span> Date'
#   time: '<span class="symbol"><span class="icon-time"></span></span> Time'
#   website: '<span class="symbol"><span class="icon-link"></span></span> Website'
#   file: '<span class="symbol"><span class="icon-cloud-upload"></span></span> File'
#   email: '<span class="symbol"><span class="icon-envelope-alt"></span></span> Email'
#   address: '<span class="symbol"><span class="icon-home"></span></span> Address'

# FormBuilder.RESPONSE_FIELD_NON_INPUT_TYPES =
#   section_break: "<span class='symbol'><span class='icon-minus'></span></span> Section Break"
