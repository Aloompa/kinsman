import Person from './models/Person';
import Planet from './models/Planet';
import Vehicle from './models/Vehicle';
import createOrm from '../index';
import sessionAdapter from '../adapters/sessionAdapter';

const orm = createOrm({
    adapter: sessionAdapter(),
    models: {
        Person,
        Vehicle,
        Planet
    }
});

export default orm;