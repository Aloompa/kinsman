# Kinsman

**Why do I need an ORM?**

Have you ever started working on a project and then realized that the type of database or datastore you are using is not optimal for what you are building? If you've ever gone through the pain of switching out a tightly-coupled datasource, you know why an ORM is important to keep you out of the dreaded world of vendor lock-in. 

**Why THIS ORM?**

There are a few JavaScript ORM projects out there, but we set out to build one for the modern world. Since most of the Node ORMs were built, Facebook unvealed GraphQL which made selecting related data so much less painful than it once was. Using the same process to form queries, we were able to make an API that is super-easy to work with. We also made the intentional choice to make this ORM simple and functional with a very tiny API surface level so that adding adapters would be less of a hassle than it is in some of the other options out there right now. We also wanted a single ORM model that could run on the client-side or the server-side by just swapping out the datastore adapters. That way, we could have a server running MySQL or MongoDB behind a Redis cache using the same models as a front-end that is building up the datastore over the wire by making GraphQL or Rest requests.

## Gettings Started

Just install the NPM package and an adapter and you're off to the races!

`npm i kinsman kinsman-session-adapter -D`

## API

### Creating a Model

A Kinsman model describes the datastore attributes and its relationship to other models. Typical model stuff.

```javascript
import { optionalNumber, string } from 'kinsman';

const Person = {
    attributes: {
        id: optionalNumber,
        name: string
    }
};

export default Person;
```

Every attribute type is a function that validates whether it is what it says it is. Kinsman has many default types, but they are easy to create too. For example, if you wanted to create a function that the attribute is a string with an exclimation mark, you could do something like:

```javascript
const excitedString = value => value.includes('!');
```

Never let the lack of a built-in type keep you from creating your own!

#### Relationships

A Kinsman model can declare relationships to other models. Currently, we support `hasMany` and `hasOne` relationships out of the box. Each type of relationship should provide the model name and a field in the current model to map the related model to.

```javascript
import { hasMany, hasOne, number, arrayOf } from 'kinsman';

const Person = {
    attributes: {
        home_planet_id: number,
        vehicle_ids: arrayOf(number)
    },
    relationships: {
        homeplanet: hasOne({
            model: 'Planet',
            mapTo: 'home_planet_id'
        }),
        vehicles: hasMany({
            model: 'Vehicle',
            mapTo: 'vehicle_ids'
        })
    }
};

export default Person;
```

### Creating an ORM

A new Kinsman ORM is created by passing in an adapter, the models and an inital state. If the adapter needs any configuration, that is passed into the adapter. Instantiating the ORM intentionally has a very small surface area.

```javascript
import Person from './models/Person';
import Planet from './models/Planet';
import Vehicle from './models/Vehicle';
import kinsman from 'kinsman';
import sessionAdapter from 'kinsman-session-adapter';

const orm = kinsman({
    adapter: sessionAdapter(),
    models: {
        Person,
        Vehicle,
        Planet
    }
})({
    // ... initial state
});

export default orm;
```

### ORM Methods

### `orm.findOne(query:string, params:object):Promise`

Find a single record from the datastore. This is curried method so it can also be called as `orm.findOne('query')({})`.

Example:

```javascript
orm.findOne(`{
    Person (id=$id) {
        name
    }
}`, {
    id: 1
}).then(res => {
    // { name: 'Luke Skywalker' }
})
```

### `orm.query(query:string, params:object):Promise`

Query records from the datastore. This is curried method so it can also be called as `orm.query('query')({})`.

Example:

```javascript
orm.query(`{
    Person {
        name
    }
}`, {}).then(res => {
    // [{ name: 'Luke Skywalker' } ... ]
})
```

### `orm.update(model:string, body:object):Promise`

Create a record in the datastore.

Example:

```javascript
orm.create('Person', {
    name: 'Yoda'
}).then(res => {
    // { name: 'Yoda', id: 4 }
});
```

### `orm.update(model:string, body:object, selector:object):Promise`

Update a record in the datastore.

Example:

```javascript
orm.update('Person', {
    name: 'Yoda'
}, {
    id: 4
}).then(res => {
    // { name: 'Yoda' }
});
```

### `orm.destroy(model:string, selector:object):Promise`

Remove a record from the datastore.

Example:

```javascript
orm.destroy('Person', {
    id: 4
}).then(res => {
    // {}
});
```

## Contributing

We encourage you to contribute to Kinsman by submitting bug reports and pull requests through [Github](http//github.com).

## License

Kinsman is released under The [MIT License](http://www.opensource.org/licenses/MIT) (MIT)

Copyright (c) [2017] [Aloompa LLC]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.