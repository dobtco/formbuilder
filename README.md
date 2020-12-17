Formbuilder.js
============

Formbuilder is a graphical interface for letting users build their own webforms. Think Wufoo or Google Forms, but a lightweight component that can be integrated into your application.

*Formbuilder.js only handles the client-side logic of creating a form. It will output a structured JSON representation of your form, but saving the form, rendering it on the server, and storing users' responses is all up to you. If you're using Rails, there is also [Formbuilder.rb](https://github.com/dobtco/formbuilder-rb), a Rails engine that's designed to provide this server-side functionality.*

## Demo
[Click here](http://dobtco.github.io/formbuilder/) to see Formbuilder in action.

## Add new icons to element
If you need to add/replace icon for form element, you can find all available icons from `icon-font-demo` folder
## Basic usage
```
<div id='formbuilder'></div>

<script>
var formbuilder = new Formbuilder({ selector: '#formbuilder' });
</script>
```

See more usage examples in the [wiki](https://github.com/dobtco/formbuilder/wiki).

## Design &amp; Dependencies

Formbuilder itself is a pretty small codebase (6kb gzip'd javascript) but it *does* rely on some external libraries, namely Backbone &amp; Rivets. We use bower to manage our dependencies, which can be seen [here](https://github.com/dobtco/formbuilder/blob/master/bower.json). I'd like to reduce some of these in the future, (especially font-awesome, because that's just silly,) but for now that's what you'll have to include.

Formbuilder consists of a few different components that all live in the `Formbuilder` namespace:

- `Formbuilder.templates` are compiled Underscore.js templates that are used to render the Formbuilder interface. You can see these individual files in the `./templates` directory, but if you're including `formbuilder.js`, you don't need to worry about them.

- `Formbuilder.fields` are the different kinds of inputs that users can add to their forms. We expose a simple API, `Formbuilder.registerField()`, that allows you to add more kinds of inputs.

- `Formbuilder.views`

Because of its modular nature, Formbuilder is easy to customize. Most of the configuration lives in class variables, which means you can simply override a template or method. If you have questions, feel free to open an issue -- we've tried to bridge the gap between convention and configuration, but there's no guarantee that we were successful.

## Data format

Keeping with the customizable nature of Formbuilder, you are also able to modify how Formbuilder structures its JSON output. The [default keypaths](https://github.com/dobtco/formbuilder/blob/master/coffee/main.coffee#L20) are:

```coffeescript
SIZE: 'options.size'
UNITS: 'options.units'
LABEL: 'label'
type: 'type'
REQUIRED: 'required'
ADMIN_ONLY: 'admin_only'
OPTIONS: 'options.options'
DESCRIPTION: 'options.description'
INCLUDE_OTHER: 'options.include_other_option'
INCLUDE_BLANK: 'options.include_blank_option'
INTEGER_ONLY: 'options.integer_only'
MIN: 'options.min'
MAX: 'options.max'
MINLENGTH: 'options.minlength'
MAXLENGTH: 'options.maxlength'
LENGTH_UNITS: 'options.min_max_length_units'
```

Which outputs JSON that looks something like:

```javascript
[{
    "label": "Please enter your clearance number",
    "type": "text",
    "required": true,
    "options": {},
    "cid": "c6"
}, {
    "label": "Security personnel #82?",
    "type": "radio",
    "required": true,
    "options": {
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
    "type": "file",
    "required": true,
    "options": {},
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

1. `nvm use`
2. `npm install`
3. `bower install`
4. `grunt watch`
5. Open  a new terminal and run `grunt connect`
6. open `http://localhost:9001/` and you're all set!

## Committing your changes and migrating to integral project
1. Ensure you're running `grunt watch` while developing so that your main formbuilder.js file is up to date
2. If you have made any changes to the formbuilder css, do the same for it with `grunt cssmin` (for completeness, as above)
3. Copy the changed formbuilder.js files to integral/html/js/ext ; and formbuilder.css file to integral/html/css

## License
MIT

## Currently known issues
Last time this was worked on there were issues getting a new repo set up.
* npm install was failing to install correctly:
    * running into issues with not finding xcode while trying to install gym.
    * throwing lots of deprecation, no member named 'New' in 'v8::String', and NAN_THROW_ERRORs when installing gym

Note made on the last attempt:

If node install fails with `gyp: No Xcode or CLT version detected!`
Run `xcode-select --install` and try again.
If you have a pending or recently updated xcode you may need to open the app and accept permissions.

You may also need to completely delete and re-install xcode with
~~~
sudo rm -rf $(xcode-select -print-path)
xcode-select --install
~~~

Also, you may not be able to get node install to work because node-gym is unsupported with errors like this:
~~~
 CXX(target) Release/obj.target/fse/fsevents.o
In file included from ../fsevents.cc:6:
../../nan/nan.h:213:31: warning: 'Uint32Value' is deprecated [-Wdeprecated-declarations]
      ? optionsObj->Get(opt)->Uint32Value()
                              ^
/Users/paul/Library/Caches/node-gyp/10.19.0/include/node/v8.h:2477:3: note: 'Uint32Value' has been
      explicitly marked deprecated here
  V8_DEPRECATED("Use maybe version", uint32_t Uint32Value() const);
~~~

In that case you can switch to a much earlier version of node and try again, though it may not work:
~~~
nvm install 0.8
nvm use 0.8
nvm ls
~~~

One last thing - node-gym has lots of issues. Sometimes if will completely stop after throwing all the errors, but sometimes it will continue.
If all else fails, completely uninstall it globally and nuke your node_modules folder and try again.
It worked for me last time.
~~~
sudo npm uninstall node-gyp -g
rm -rf node_modules
npm install
~~~ 
