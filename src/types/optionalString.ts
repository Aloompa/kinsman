import * as R from 'ramda';

const optionalString = R.compose(
    R.either(
        R.equals('String'),
        R.equals('Undefined')
    ),
    R.type
);

export default optionalString;