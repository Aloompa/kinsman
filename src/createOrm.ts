import * as R from 'ramda';

import queryParser from './queryParser';

const createOrm = R.curry((options, initialState) => {

    const { adapter } = options;

    if (!adapter) {
        throw new Error('Please provide a valid adapter');
    }

    const models = Object.keys(options.models).reduce((prev, key) => ({
        ...prev,
        [key]: {
            idAttribute: 'id',
            ...options.models[key]
        }
    }), {});

    adapter.initialize(initialState);

    const validate = (modelKey, attributes) => {
        return new Promise((resolve, reject) => {
            const model = getModel(modelKey);

            const validations = Object.keys(model.attributes).map(key => {
                try {
                    if (!model.attributes[key](attributes[key])) {
                        return {
                            attribute: key,
                            message: `${key} is not valid.`
                        };
                    }
                } catch (e) {
                    return {
                        attribute: key,
                        message: `${key} is not valid.`
                    };
                }
            }).filter(err => err);

            if (validations.length) {
                return reject(validations);
            }

            return resolve();
        });
    };

    const joinRelationships = R.curry((modelKey, options, result) => {
        
        // No relationships
        if (!options.join) {
            return result;
        }

        const relationshipKeys = Object.keys(options.join);

        const promised = relationshipKeys.map(key => 
            models[modelKey].relationships[key](options.where, options.join[key], orm, modelKey)
        );

        // Resolve all the relationships and merge them together
        return Promise.all(promised).then((...args) => {
            const mix = relationshipKeys.reduce((prev, current, index) => ({
                [current]: args[index][0],
                ...prev
            }), {});

            return {
                ...result,
                ...mix
            };
        });
    });

    const getModel = modelKey => {
        return models[modelKey];
    };

    const getFilteredAttributes = (modelKey, attributes, join = {}) => {
        const model = getModel(modelKey);
        
        return attributes.filter(key => {
            return model.attributes[key]
        });
    };

    const findOneFrom = (modelKey, options) => {
        const filteredAttributes = getFilteredAttributes(modelKey, options.attributes, options.join);
        
        return adapter.findOneFrom(modelKey, {
            ...options,
            attributes: filteredAttributes
        }).then(joinRelationships(modelKey, options));
    };

    const queryAll = (modelKey, options) => {
        const filteredAttributes = getFilteredAttributes(modelKey, options.attributes);
        return adapter.query(modelKey, {
            ...options,
            attributes: filteredAttributes
        });
    };

    const convertQueryShape = queryResult => {
        return {
            attributes: queryResult.fields,
            where: queryResult.args,
            join: Object.keys(queryResult.methods).reduce((prev, current) => {
                return {
                    ...prev,
                    [current]: convertQueryShape(queryResult.methods[current])
                }
            }, {})
        };
    };

    const orm = {

        // This is only exposed for the relationships right now.
        getModel,
        
        // This probably shouldn't be exposed. Currently, it's just for relationships to access.
        // It should probably be refactored to be private
        findOneFrom,

        findOne: (query, params) => {
            const queryResult = queryParser(query, params);
            const method = Object.keys(queryResult.methods)[0];

            return findOneFrom(method, convertQueryShape(queryResult.methods[method]));
        },

        query: (query, params) => {
            const queryResult = queryParser(query, params);
            const method = Object.keys(queryResult.methods)[0];

            return queryAll(method, convertQueryShape(queryResult.methods[method]));
        },

        create: (modelKey, body, where = {}) => {
            const model = getModel(modelKey);

            return validate(modelKey, body)
                .then(() => adapter.create(modelKey, {
                    where,
                    body,
                    model
                }));
        },

        update: (modelKey, body, where = {}) => {
            const model = getModel(modelKey);

            return validate(modelKey, body)
                .then(() => adapter.update(modelKey, {
                where,
                body,
                model
            }));
        },

        destroy: (modelKey, where) => {
            return adapter.destroy(modelKey, {
                where
            });
        },

        validate
    };

    return orm;
});

export default createOrm;