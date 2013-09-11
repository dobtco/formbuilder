Formbuilder.js
============

Formbuilder is a graphical interface for letting users build their own webforms. Think Wufoo or Google Forms, but a lightweight component that can be integrated into your application.

*As of right now, Formbuilder only handles the client-side logic of creating a form. It will output a structured JSON representation of your form, but saving the form, rendering it on the server, and storing users' responses is all up to you. I'm planning on releasing a Rails gem to handle this logic, but ETA on that is pretty up in the air. If you'd like to help, feel free to reach out.*

## Demo
[Click here](#) to see Formbuilder in action.

## Basic usage
```
<div class='fb-main'></div>

<script>
Formbuilder.options.HTTP_ENDPOINT = '/save_form';
var fb = new Formbuilder('.fb-main');
</script>
```

Some more advanced examples are covered in the [wiki](https://github.com/dobtco/formbuilder/wiki)

## Design &amp; Dependencies

Formbuilder itself is a pretty small codebase (6kb gzip'd javascript) but it *does* rely on some external libraries, namely Backbone &amp; Rivets. We use bower to manage our dependencies:

```
  ...

  "dependencies": {
    "jquery": "*",
    "jquery-ui": "*",
    "jquery.scrollWindowTo": "https://gist.github.com/adamjacobbecker/6519570/raw/cd741057495d0fb19e545a0f9a098efba3bef9c8/jquery.scrollWindowTo.js",
    "underscore": "*",
    "underscore.mixin.deepExtend": "https://gist.github.com/adamjacobbecker/6519561/raw/63682037af9b10200b05c1a3d5890903397b2103/underscore.mixin.deepExtend.js",
    "backbone": "*",
    "backbone-deep-model": "*",
    "rivets": "*",
    "font-awesome": "*"
  }
  ...
```

I'd like to reduce some of these in the future, (especially font-awesome, because that's just silly,) but for now that's what you'll have to include.

Formbuilder consists of a few different components that all live in the `Formbuilder` namespace:

- `Formbuilder.templates` are compiled Underscore.js templates that are used to render the Formbuilder interface. You can see these individual files in the `./templates` directory, but if you're including `formbuilder.js`, you don't need to worry about them.

- `Formbuilder.fields` are the different kinds of inputs that users can add to their forms. We expose a simple API, `Formbuilder.registerField()`, that allows you to add more kinds of inputs.

- `Formbuilder.views`

Because of its modular nature, Formbuilder is easy to customize. Most of the configuration lives in class variables, which means you can simply override a template or method. If you have questions, feel free to open an issue. We've tried to bridge the gap between convention and configuration, but there's no guarantee that we were successful :P

## Events
More coming soon...

#### `save`
```
var fb = new Formbuilder('#fb');

fb.on('save', function(payload){
  ...
});
```

## Developing
1. `npm install`
2. `bower install`
3. `grunt watch`
4. open `example/index.html` and you're all set!
