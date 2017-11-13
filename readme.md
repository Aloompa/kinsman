# Kinsman

## API

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

TODO:
- Documentation
- Custom adapters per model if declared

POTENTIAL ADAPTERS:
- DynamoDB
- Postgress
- MSSQL
- MySQL
- Front End REST
- Front End GraphQL
- Back End GraphQL
- Disk
- Mongo
- Redis
...

POTENTIAL FRAMEWORKS ON TOP:
- React
- Angular
- Express
- Serverless
...