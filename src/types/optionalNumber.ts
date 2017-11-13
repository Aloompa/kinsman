import * as R from 'ramda';

const optionalNumber = R.compose(
    R.either(
        R.equals('Number'),
        R.equals('Undefined')
    ),
    R.type
);

export default optionalNumber;