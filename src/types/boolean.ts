import * as R from 'ramda';

const boolean = R.compose(
    R.equals('Boolean'),
    R.type
);

export default boolean;