import * as R from 'ramda';

const sessionAdapter = (options: any = {}) => {

    let state = {};

    const first = R.prop(0);
    const passthrough = R.defaultTo(R.tap(
        R.T
    ));

    const findOneFrom = (modelName, options) => {
        const pickAttributes = R.pick(options.attributes);
        const getNodeForModel = R.prop(modelName);
        const filterByQuery = R.filter(R.whereEq(options.where));

        return Promise.resolve(
            R.compose(
                pickAttributes,
                first,
                filterByQuery,
                getNodeForModel
            )(state)
        );
    };

    return {

        create: (modelName, { body, model }) => {
            const { idAttribute } = model;
            
            const id = R.compose(
                R.inc,
                R.length,
                R.prop(modelName)
            )(state);
            
            state[modelName].push({
                ...body,
                [idAttribute]: id
            });

            return findOneFrom(modelName, {
                where: { [idAttribute]: id },
                attributes: Object.keys(body).concat([idAttribute])
            });
        },

        update: (modelName, { body, where }) => {

            const index = R.findIndex(R.whereEq(where))(state[modelName]);
            
            state[modelName][index] = {
                ...state[modelName][index],
                ...body
            };

            return findOneFrom(modelName, {
                where,
                attributes: Object.keys(state[modelName][index])
            });
        },

        destroy: (modelName, { where }) => {
            const index = R.findIndex(R.whereEq(where))(state[modelName]);

            state[modelName] = R.without([index], state[modelName]);

            return Promise.resolve();
        },
        
        findOneFrom,

        query: (modelName, options) => {
            const pickAttributes = R.pick(options.attributes);
            const getNodeForModel = R.prop(modelName);
            const filterByQuery = options.where ? R.filter(R.whereEq(options.where)) : passthrough;

            return Promise.resolve(
                R.compose(
                    R.map(pickAttributes),
                    filterByQuery,
                    getNodeForModel
                )(state)
            );
        },

        initialize: (data) => {
            state = passthrough(options.initialize)(data);
        }

    };

};

export default sessionAdapter;