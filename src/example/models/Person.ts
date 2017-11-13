import { arrayOf, hasMany, hasOne, number, optionalNumber, optionalString, string } from '../../index';

const Person = {
    attributes: {
        id: optionalNumber,
        name: string,
        height: optionalNumber,
        gender: optionalString,
        home_planet_id: optionalNumber,
        vehicle_ids: arrayOf(number)
    },
    relationships: {
        homeplanet: hasOne({
            model: 'Planet',
            mapTo: 'home_planet_id'
        }),
        vehicles: hasMany({
            model: 'Vehicle',
            mapTo: 'vehicle_ids'
        })
    }
};

export default Person;