import * as R from 'ramda';

const number = R.compose(
    R.equals('Number'),
    R.type
);

export default number;