import * as R from 'ramda';

const string = R.compose(
    R.equals('String'),
    R.type
);

export default string;