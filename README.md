Formbuilder.js
============

Formbuilder is a graphical interface for letting users build their own webforms. Think Wufoo or Google Forms, but a lightweight component that can be integrated into your application.

*As of right now, Formbuilder only handles the client-side logic of creating a form. It will output a structured JSON representation of your form, but saving the form, rendering it on the server, and storing users' responses is all up to you. I'm planning on releasing a Rails gem to handle this logic, but the ETA on that is pretty up in the air. If you'd like to help, feel free to reach out.*

## Demo
[Click here](http://dobtco.github.io/formbuilder/) to see Formbuilder in action.

## Basic usage
```
<div id='formbuilder'></div>

<script>
var formbuilder = new Formbuilder('#formbuilder');
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

## Events
More coming soon...

#### `save`
```
var builder = new Formbuilder('#formbuilder');

builder.on('save', function(payload){
  ...
});
```

## Developing
1. `npm install`
2. `bower install`
3. `grunt watch`
4. open `example/index.html` and you're all set!

## License

MIT
