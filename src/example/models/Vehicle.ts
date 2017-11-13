import { number, optionalNumber, string } from '../../index';

const Vehicle = {
    attributes: {
        id: number,
        name: string,
        crew: optionalNumber
    }
};

export default Vehicle;