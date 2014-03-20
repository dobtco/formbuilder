Formbuilder.js
============

Formbuilder is a graphical interface for letting users build their own webforms. Think Wufoo or Google Forms, but a lightweight component that can be integrated into your application.

*Formbuilder.js only handles the client-side logic of creating a form. It will output a structured JSON representation of your form, but saving the form, rendering it on the server, and storing users' responses is all up to you. If you're using Rails, there is also [Formbuilder.rb](https://github.com/dobtco/formbuilder-rb), a Rails engine that's designed to provide this server-side functionality.*

## Demo
[Click here](http://dobtco.github.io/formbuilder/) to see Formbuilder in action.

## Basic usage
```
<div id='formbuilder'></div>

<script>
var formbuilder = new Formbuilder({ selector: '#formbuilder' });
</script>
```

See more usage examples in the [wiki](https://github.com/dobtco/formbuilder/wiki).

## Design &amp; Dependencies

Formbuilder itself is a pretty small codebase (6kb gzip'd javascript) but it *does* rely on some external libraries, namely Backbone &amp; Rivets. We use bower to manage our dependencies, which can be seen [here](https://github.com/dobtco/formbuilder/blob/gh-pages/bower.json). I'd like to reduce some of these in the future, (especially font-awesome, because that's just silly,) but for now that's what you'll have to include.

Formbuilder consists of a few different components that all live in the `Formbuilder` namespace:

- `Formbuilder.templates` are compiled Underscore.js templates that are used to render the Formbuilder interface. You can see these individual files in the `./templates` directory, but if you're including `formbuilder.js`, you don't need to worry about them.

- `Formbuilder.fields` are the different kinds of inputs that users can add to their forms. We expose a simple API, `Formbuilder.registerField()`, that allows you to add more kinds of inputs.

- `Formbuilder.views`

Because of its modular nature, Formbuilder is easy to customize. Most of the configuration lives in class variables, which means you can simply override a template or method. If you have questions, feel free to open an issue -- we've tried to bridge the gap between convention and configuration, but there's no guarantee that we were successful.

## Data format

Keeping with the customizable nature of Formbuilder, you are also able to modify how Formbuilder structures its JSON output. The [default keypaths](https://github.com/dobtco/formbuilder/blob/gh-pages/coffee/main.coffee#L20) are:

```coffeescript
SIZE: 'field_options.size'
UNITS: 'field_options.units'
LABEL: 'label'
FIELD_TYPE: 'field_type'
REQUIRED: 'required'
ADMIN_ONLY: 'admin_only'
OPTIONS: 'field_options.options'
DESCRIPTION: 'field_options.description'
INCLUDE_OTHER: 'field_options.include_other_option'
INCLUDE_BLANK: 'field_options.include_blank_option'
INTEGER_ONLY: 'field_options.integer_only'
MIN: 'field_options.min'
MAX: 'field_options.max'
MINLENGTH: 'field_options.minlength'
MAXLENGTH: 'field_options.maxlength'
LENGTH_UNITS: 'field_options.min_max_length_units'
```

Which outputs JSON that looks something like:

```javascript
[{
    "label": "Please enter your clearance number",
    "field_type": "text",
    "required": true,
    "field_options": {},
    "cid": "c6"
}, {
    "label": "Security personnel #82?",
    "field_type": "radio",
    "required": true,
    "field_options": {
        "options": [{
            "label": "Yes",
            "checked": false
        }, {
            "label": "No",
            "checked": false
        }],
        "include_other_option": true
    },
    "cid": "c10"
}, {
    "label": "Medical history",
    "field_type": "file",
    "required": true,
    "field_options": {},
    "cid": "c14"
}]
```

## Events
More coming soon...

#### `save`
```
var builder = new Formbuilder({ selector: '#formbuilder' });

builder.on('save', function(payload){
  ...
});
```

## Questions?

Have a question about Formbuilder? Feel free to [open a GitHub Issue](https://github.com/dobtco/formbuilder/issues/new) before emailing one of us directly. That way, folks who have the same question can see our communication.

## Developing
You'll need [node and npm](http://nodejs.org/) installed.

1. `npm install`
2. `bower install`
3. `grunt watch`
4. open `index.html` and you're all set!

## License
MIT
