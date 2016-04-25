This is a code dump of the form builder inside of Screendoor, which superseded the open-source form builder that's still available in the `gh-pages` branch.

In Screendoor, this form builder is built with the Rails asset pipeline, using `eco` for templating.

I'm dumping the code because of a generous offer to try and take this version and abstract away the Screendoor-specific parts of the codebase in order to release it as an open-source library that can integrate with Screendoor's [formrenderer-base](https://github.com/dobtco/formrenderer-base).

Response Field Schema:

```
#  id            :integer          not null, primary key
#  label         :text
#  type          :string
#  field_options :text
#  sort_order    :integer
#  required      :boolean          default(FALSE)
#  blind         :boolean          default(FALSE)
#  admin_only    :boolean          default(FALSE)
#  created_at    :datetime
#  updated_at    :datetime
#  project_id    :integer
```
