module("DeepModel");

function create() {
    var model = new Backbone.DeepModel({
        id: 123,
        user: {
            type: 'Spy',
            name: {
                first: 'Sterling',
                last: 'Archer'
            }
        }
    });

    return model;
}

test("get: Gets nested attribute values", function() {
    var model = create();

    deepEqual(model.get('id'), 123);

    deepEqual(model.get('user'), {
        type: 'Spy',
        name: {
            first: 'Sterling',
            last: 'Archer'
        }
    });

    deepEqual(model.get('user.type'), 'Spy');

    deepEqual(model.get('user.name'), {
        first: 'Sterling',
        last: 'Archer'
    });

    deepEqual(model.get('user.name.first'), 'Sterling');
});


test("get: Gets nested attribute values from arrays", function() {
    var model = new Backbone.DeepModel({
        spies: [
            { name: 'Sterling' },
            { name: 'Lana' }
        ]
    });

    deepEqual(model.get('spies.0.name'), 'Sterling');

    deepEqual(model.get('spies.1.name'), 'Lana');
});


test("get: Gets attributes if empty objects", function() {
    var model = new Backbone.DeepModel({
        foo: {},
        bar: []
    });

    deepEqual(model.get('foo'), {});
    deepEqual(model.get('bar'), []);
});


test("set: Sets nested values given a path", function() {
    var model = create();

    model.set({ id: 456 });

    equal(model.attributes.id, 456);


    model.set({
        'user.name.first': 'Lana',
        'user.name.last':  'Kang'
    });

    equal(model.attributes.user.name.first, 'Lana');
    equal(model.attributes.user.name.last, 'Kang');


    model.set({
        'user.type': 'Agent'
    });

    equal(model.attributes.user.type, 'Agent');


    model.set({
        'user.name': {
            first: 'Cheryl',
            last: 'Tunt'
        }
    });

    equal(model.attributes.user.name.first, 'Cheryl');
    equal(model.attributes.user.name.last, 'Tunt');


    model.set({
        user: {
            type: 'Secretary',
            name: {
                first: 'Cheryl',
                last: 'Tunt'
            }
        }
    });

    deepEqual(model.attributes.user, {
        type: 'Secretary',
        name: {
            first: 'Cheryl',
            last: 'Tunt'
        }
    });
});


test('set: Sets a single value - not nested', function() {
    var model = create();

    model.set('id', 456);

    equal(model.attributes.id, 456);
});


test('set: Sets a single value - nested', function() {
   var model = create();

   model.set('user.type', 'Admin');
   model.set('user.name.first', 'Foo');

   equal(model.attributes.user.type, 'Admin');
   equal(model.attributes.user.name.first, 'Foo');
});

test('set: Sets a single value inside null to create an object', function() {
   var model = create();
   
   model.set('user', null);
   model.set('user.type', 'Admin');
   
   equal(model.attributes.user.type, 'Admin');
});

test('set: Sets a single value inside null to create an object when given an object', function() {
   var model = create();
   
   model.set('user', null);
   model.set({user: {type: 'Admin'}});
   
   equal(model.attributes.user.type, 'Admin');
});

test("set: Sets values when given an object", function() {
    var model = create();

    var newValues = {
        id: 456,
        user: {
            type: 'Agent',
            name: {
                first: 'Lana',
                last: 'Kang'
            }
        }
    };

    model.set(newValues);

    deepEqual(model.attributes, newValues);
});

test('set: Can set an object in place of a child non-object value', function() {
    var model = new Backbone.DeepModel({
        id: 123,
        name: ''
    });

    var newName = {
        first: 'Burt',
        last: 'Reynolds'
    };

    model.set('name', newName);

    deepEqual(model.attributes.id, 123);
    deepEqual(model.attributes.name, newName);
});


test("set: Triggers model change:[attribute] events", function() {
    (function() {
        var model = create();

        var triggered = false;

        model.bind('change:id', function(model, val) {
            equal(val, 456);

            triggered = true;
        });

        model.set({ id: 456 });

        //Check callbacks ran
        ok(triggered);
    })();


    (function() {
        var model = create();

        var triggered1 = false,
            triggered2 = false;

        model.on('change:user.name.first', function(model, val) {
            equal(val, 'Lana');

            triggered1 = true;
        });

        model.bind('change:user.name.last', function(model, val) {
            equal(val, 'Kang');

            triggered2 = true;
        });

        model.set({
            'user.name.first': 'Lana',
            'user.name.last':  'Kang'
        });

        //Check callbacks ran
        ok(triggered1);
        ok(triggered2);
    })();


    //Check only expected change events are running
    (function() {
        var model = create();

        var triggeredEvents = [];

        model.bind('all', function(changedAttr, model, val) {
            triggeredEvents.push(changedAttr);
        });

        model.set({
            'id': 456,
            'user.name.first': 'Lana'
        });

        //Check callbacks ran
        deepEqual(triggeredEvents, [
            'change:id',
            'change:user.name.first',
            'change:user.name.*',
            'change:user.*',
            'change'
        ]);
    })();
});

test("set: Correct values passed to wildcard event handlers", function() {
    var model = create();

    var triggered1 = false,
        triggered2 = false,
        triggered3 = false;

    model.on('change:user.name.first', function(model, val) {
        equal(val, 'Lana');

        triggered1 = true;
    });

    model.bind('change:user.name.*', function(model, val) {
        deepEqual(val, { first: 'Lana', last: 'Archer' } );

        triggered2 = true;
    });

    model.bind('change:user.*', function(model, val) {
        deepEqual(val, { name: { first: 'Lana', last: 'Archer' }, type: 'Spy' });

        triggered3 = true;
    });

    model.set({
        'user.name.first': 'Lana'
    });

    //Check callbacks ran
    ok(triggered1);
    ok(triggered2);
    ok(triggered3);
});

test("set: Don't convert Date objects to strings", function() {
    var model = create();

    model.set({ date: new Date });

    ok(_.isDate(model.attributes.date));
});

test("set: Don't delete property when setting it twice with the same value", function() {
    var model = new Backbone.DeepModel();
    model.set('route', {});

    model.set('route.pathName', '/some/route/path');
    equal(model.get('route.pathName'), '/some/route/path');

    model.set('route.pathName', '/some/route/path');
    equal(model.get('route.pathName'), '/some/route/path');
});

test("set: options are passed to the change:[attribute] callback", function() {
    (function() {
        var model = create();

        var triggered = false;

        model.bind('change:id', function(model, val, options) {
            equal(val, 456);

            equal(options.owner, 'Jane Doe');
            triggered = true;
        });

        model.set({ id: 456 }, {owner: 'Jane Doe'});

        //Check callbacks ran
        ok(triggered);
    })();

    (function() {
        var model = create();

        var triggered1 = false,
            triggered2 = false;

        model.on('change:user.name.first', function(model, val, options) {
            equal(val, 'Lana');

            equal(options.changeid, 871);
            triggered1 = true;
        });

        model.bind('change:user.name.last', function(model, val, options) {
            equal(val, 'Kang');

            equal(options.changeid, 872);
            triggered2 = true;
        });

        model.set({'user.name.first': 'Lana' }, {changeid: 871});
        model.set({user: { name: { last: 'Kang' } } }, {changeid: 872});

        //Check callbacks ran
        ok(triggered1);
        ok(triggered2);
    })();
});

test("has: Check if model has root key", function(){
	var model = create();

	equal(model.has('user'), true);
});

test("has: Check if model has deep key", function(){
	var model = create();

	equal(model.has('user.name.last'), true);
});

test("has: Don't find nonexistent key", function(){
	var model = create();

	equal(model.has('user.turtleneck'), false);
});

test("unset: Unset a root key", function(){
    var model = create();

    model.unset('user');

    equal(model.get('user'), undefined);

    deepEqual(model.toJSON(), {
        id: 123
    });
});

test("unset: Unset a deep key", function(){
    var model = create();

    model.unset('user.type');

    deepEqual(model.get('user'), {
            name: {
                first: 'Sterling',
                last: 'Archer'
            }
        });

    deepEqual(model.toJSON(), {
        id: 123,
        user: {
            name: {
                first: 'Sterling',
                last: 'Archer'
            }
        }
    });

});

test("unset: Unset a deeper key", function(){
    var model = create();

    model.unset('user.name.last');

    deepEqual(model.get('user'), {
            type: 'Spy',
            name: {
                first: 'Sterling'
            }
        });

    deepEqual(model.toJSON(), {
        id: 123,
        user: {
            type: 'Spy',
            name: {
                first: 'Sterling'
            }
        }
    });

});

test("unset: Triggers model change:[attribute] events", function() {
    (function() {
        var model = create();

        var triggered = false;

        model.bind('change:id', function(model, val) {
            equal(val, void 0);
            triggered = true;
        });

        model.unset('id');

        //Check callbacks ran
        ok(triggered);
    })();


    (function() {
        var model = create();

        var triggered1 = false;

        model.bind('change:user.name.first', function(model, val) {
            equal(val, void 0);

            triggered1 = true;
        });

        model.unset('user.name.first');

        //Check callbacks ran
        ok(triggered1);
    })();


    //Check only expected change events are running
    (function() {
        var model = create();

        var triggeredEvents = [];

        model.bind('all', function(changedAttr, model, val) {
            triggeredEvents.push(changedAttr);
        });

        model.unset('id');
        model.unset('user.name.first');

        //Check callbacks ran
        deepEqual(triggeredEvents, [
            'change:id',
            'change',
            'change:user.name.first',
            'change:user.name.*',
            'change:user.*',
            'change'
        ]);
    })();
});


test('hasChanged(): matches Model behaviour - when not changed', function() {
    var model = new Backbone.Model({ foo: 'bar' });
    
    var deepModel = new Backbone.DeepModel({
        foo: 'bar',
        user: {
            first: 'John',
            last: 'Smith'
        }
    });

    //Should match default Model behavior on top level
    deepEqual(model.hasChanged(), false);
    deepEqual(deepModel.hasChanged(), false);
});


test('hasChanged(): matches Model behaviour - when changed', function() {
    var model = new Backbone.Model({ foo: 'bar' });
    
    var deepModel = new Backbone.DeepModel({
        foo: 'bar',
        user: {
            first: 'John',
            last: 'Smith'
        }
    });

    model.set('foo', 'baz');
    deepModel.set('foo', 'baz');

    //Should match default Model behavior on top level
    deepEqual(model.hasChanged(), true);
    deepEqual(deepModel.hasChanged(), true);
});

test('hasChanged(attr): matches Model behaviour - when not changed', function() {
    var model = new Backbone.Model({ foo: 'bar' });
    
    var deepModel = new Backbone.DeepModel({
        foo: 'bar',
        user: {
            first: 'John',
            last: 'Smith'
        }
    });

    //Should match default Model behavior on top level
    deepEqual(model.hasChanged('foo'), false);
    deepEqual(deepModel.hasChanged('foo'), false);

    //On nested
    deepEqual(deepModel.hasChanged('user.first'), false);
});


test('hasChanged(attr): matches Model behaviour - when changed', function() {
    var model = new Backbone.Model({ foo: 'bar' });
    
    var deepModel = new Backbone.DeepModel({
        foo: 'bar',
        user: {
            first: 'John',
            last: 'Smith'
        }
    });

    //Should match default Model behavior on top level
    model.set('foo', 'baz');
    deepModel.set('foo', 'baz');

    deepEqual(model.hasChanged('foo'), true);
    deepEqual(deepModel.hasChanged('foo'), true);

    //On nested
    deepModel.set('user.first', 'Frank');

    deepEqual(deepModel.hasChanged('user.first'), true);
});



test('changedAttributes(): returns changed attributes', function() {
    var model = create();

    model.set('user.name.first', 'Lana', {silent: true});

    var changed = model.changedAttributes();

    var expected = {
        'user.name.first': 'Lana'
    }

    deepEqual(changed, expected);
});


test('changedAttributes(): returns changed attributes compared to given object', function() {
    var model = create();

    var diff = {
        id: 789,
        'user.name.last': 'Kang'
    }

    var changed = model.changedAttributes(diff);

    var expected = {
        id: 789,
        'user.name.last': 'Kang'
    }

    deepEqual(changed, expected);
});


test('changedAttributes(): behaves as Model for top level properties', function() {
    var model = new Backbone.Model({foo:1, bar:1}),
        deepModel = new Backbone.DeepModel({foo:1, bar:1});

    deepEqual(deepModel.changedAttributes(), model.changedAttributes());

    model.set({foo:2});
    deepModel.set({foo:2});

    deepEqual(model.changedAttributes(), { foo: 2 });
    deepEqual(deepModel.changedAttributes(), { foo: 2 });
});

test('changedAttributes(): with deep properties', function() {
    var deepModel = new Backbone.DeepModel({
        foo: { baz: 1 }, 
        bar: { baz: 1 }
    });

    deepEqual(deepModel.changedAttributes(), false);

    deepModel.set({'foo.bar':2});
    deepEqual(deepModel.changedAttributes(), {'foo.bar':2});
});


test('changedAttributes(diff): behaves as Model for top level properties', function() {
    var model = new Backbone.Model({foo:1, bar:1}),
        deepModel = new Backbone.DeepModel({foo:1, bar:1});

    var diff = { foo: 2 };

    deepEqual(deepModel.changedAttributes(diff), model.changedAttributes(diff));
    deepEqual(deepModel.changedAttributes(diff), { foo: 2 });

    model.set({foo:2});
    deepModel.set({foo:2});
    deepEqual(deepModel.changedAttributes(diff), model.changedAttributes(diff));
    deepEqual(deepModel.changedAttributes(diff), false);
});

test('changedAttributes(diff): with deep properties', function() {
    var deepModel = new Backbone.DeepModel({
        foo: { baz: 1 }, 
        bar: { baz: 1 }
    });

    var diff = { 'foo.baz': 2 };

    deepEqual(deepModel.changedAttributes(diff), { 'foo.baz': 2 });

    deepModel.set({'foo.baz': 2});
    deepEqual(deepModel.changedAttributes(diff), false);
});


test('hasChanged(): behaves as Model for top level attributes', function() {
    var model = new Backbone.Model({test:1}),
        deepModel = new Backbone.DeepModel({test:1});

    equal(deepModel.hasChanged(), model.hasChanged());

    //With silent
    model.set({test:2});
    deepModel.set({test:2});

    deepEqual(model.hasChanged(), true);
    deepEqual(deepModel.hasChanged(), true);
});


test('hasChanged(): with deep attributes', function() {
    var deepModel = new Backbone.DeepModel({
        foo: { bar: 1 }
    });

    equal(deepModel.hasChanged(), false);

    deepModel.set({'foo.bar':2});
    equal(deepModel.hasChanged(), true);
});


test('hasChanged(attr): behaves as Model for top level attributes', function() {
    var model = new Backbone.Model({test:1}),
        deepModel = new Backbone.DeepModel({test:1});

    equal(deepModel.hasChanged('test'), model.hasChanged('test'));

    model.set({test:2});
    deepModel.set({test:2});

    deepEqual(model.hasChanged('test'), true);
    deepEqual(deepModel.hasChanged('test'), true);
});


test('hasChanged(attr): with deep attributes', function() {
    var deepModel = new Backbone.DeepModel({
        foo: { bar: 1 }
    });

    equal(deepModel.hasChanged('foo.bar'), false);

    deepModel.set({'foo.bar':2});
    equal(deepModel.hasChanged('foo.bar'), true);
});


test("defaults: with deep attributes", function() {
    var DefaultsModel = Backbone.DeepModel.extend({
        defaults: {
            details: {
                name: {
                    last: 'Smith',
                    initial: 'J'
                }
            }
        }
    });

    var model = new DefaultsModel({
        details: { 
            name: {
                first: 'John',
                initial: 'Z'
            }
        }
    });

    equal(model.get('details.name.first'), 'John');
    equal(model.get('details.name.last'), 'Smith');
    equal(model.get('details.name.initial'), 'Z');
});


test('defaults: does not cause a problem with a collection in an attribute', function() {
    var Model = Backbone.DeepModel.extend({
        defaults: {
            foo: 'bar'
        }
    });

    var model = new Model({ collection: new Backbone.Collection });

    ok(model.get('collection') instanceof Backbone.Collection);
});
