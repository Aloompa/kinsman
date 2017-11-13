import { hasOne, number, optionalNumber, string } from '../../index';

const Planet = {
    attributes: {
        id: number,
        name: string,
        featured_person_id: optionalNumber
    },
    relationships: {
        featured_person: hasOne({
            model: 'Person',
            mapTo: 'featured_person_id'
        })
    }
};

export default Planet;