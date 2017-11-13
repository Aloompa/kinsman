const initialState = {
    Person: [{
        id: 1,
        name: 'Luke Skywalker',
        height: 6,
        gender: 'male',
        bogus: true,
        home_planet_id: 1,
        vehicle_ids: [1, 3],
    }, {
        id: 2,
        name: 'Han Solo',
        height: 6.1,
        gender: 'male',
        home_planet_id: 2,
        vehicle_ids: [1],
    }, {
        id: 3,
        name: 'Princess Leia',
        height: 5.6,
        gender: 'female',
        home_planet_id: undefined,
        vehicle_ids: [],
    }],
    Planet: [{
        id: 1,
        name: 'Tatooine',
        featured_person_id: 1
    }, {
        id: 2,
        name: 'Corellia',
        featured_person_id: 2
    }],
    Vehicle: [{
        id: 1,
        name: 'Landspeeder',
        crew: 2
    }, {
        id: 2,
        name: 'Millennium Falcon',
        crew: 2
    }, {
        id: 3,
        name: 'X-Wing',
        crew: 1
    }]
};

export default initialState;