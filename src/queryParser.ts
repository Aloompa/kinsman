import * as R from 'ramda';
import * as parser from 'graphml-parser';

const applyDynamicParams = (query, params) =>
    Object.keys(params).reduce((prev, current) => {
        const key = `$${current}`;
        return query.replace(key, params[current]);
    }, query);

const queryParser = R.curry((query, params) => {
    const result = parser.parse(`Query ${applyDynamicParams(query, params)}`);
    return result.root;
});

export default queryParser;