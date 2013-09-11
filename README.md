Formbuilder.js 
============

Formbuilder is a small graphical interface for letting users build their own webforms. Think Wufoo or Google Forms, but a lightweight component that can be integrated into your application.

*As of right now, Formbuilder only handles the client-side logic of creating a form. It will output a structured JSON representation of your form, but saving the form, rendering it on the server, and storing users' responses is all up to you. I'm planning on releasing a Rails gem to handle this logic, but ETA on that is pretty up in the air. If you'd like to help, feel free to reach out.*

## Demo
[Click here](#) to see Formbuilder in action.

## Basic usage
```
<div class='fb-main'></div>

<script>
FormBuilder.options.HTTP_ENDPOINT = '/save_form';
var fb = new Formbuilder('.fb-main');
</script>
```

Some more advanced examples are covered in the [wiki](https://github.com/dobtco/formbuilder/wiki)

## Events
#### `save`
```
var fb = new FormBuilder('#fb');

fb.on('save', function(payload){
  ...
});
```

## Developing
1. `npm install`
2. `bower install`
3. `grunt watch`
4. open `example/index.html` and start developing!
