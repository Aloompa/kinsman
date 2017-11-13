import createOrm from '../index';
import orm from '../example';

describe('Integration tests', () => {
    it('Should require an adapter', () => {
        expect(() => createOrm({}, {})).toThrow('Please provide a valid adapter');
    });

    it('Should be a function that returns an object', () => {
        expect(orm).toBeTruthy();
    });

    it('Should be able to find a person', () => {
        return orm.findOne(`{
            Person (id=$id) {
                name,
                bogus
            }
        }`, { id: 1 }).then(result => {
            // This is on the model and is being selected
            expect(result.name).toBe('Luke Skywalker');
            
            // This exists, but we aren't selecting it so it shouldn't be available
            expect(result.height).toBe(undefined);

            // This is being selected but is not defined on the model, so it should not show up
            expect(result.bogus).toBe(undefined);
        });
    });

    it('Should be able query all people', () => {
        return orm.query(`{
            Person {
                id,
                name
            }
        }`, {}).then(results => {
            expect(results.length).toBe(3);
            expect(results[0].id).toBe(1);
            expect(results[0].name).toBe('Luke Skywalker');
            expect(results[1].id).toBe(2);
            expect(results[1].name).toBe('Han Solo');
            expect(results[2].id).toBe(3);
            expect(results[2].name).toBe('Princess Leia');
        });
    });

    it('Should be able query multiple people', () => {
        return orm.query(`{
            Person (gender=$gender) {
                id,
                name
            }
        }`, {
            gender: 'male'
        }).then(results => {
            expect(results.length).toBe(2);
            expect(results[0].id).toBe(1);
            expect(results[0].name).toBe('Luke Skywalker');
            expect(results[1].id).toBe(2);
            expect(results[1].name).toBe('Han Solo');
        });
    });

    it('Should create a person', () => {
        return orm.create('Person', {
            body: {
                name: 'Chewbacca',
                height: 8,
                gender: 'male',
                home_planet_id: undefined,
                vehicle_ids: [2]
            }
        }).then(result => {
            expect(result.name).toBe('Chewbacca');
            expect(result.id).toBe(4);
        });
    });

    it('Should not create a person if they are invalid', () => {
        return orm.create('Person', {
            body: {}
        }).catch(err => {
            expect(err[0].attribute).toBe('name');
            expect(err[0].message).toBe('name is not valid.');
        });
    });

    it('Should update a person', () => {
        return orm.update('Person', {
            where: {
                id: 4
            },
            body: {
                name: 'Yoda',
                height: 3,
                gender: 'male',
                home_planet_id: undefined,
                vehicle_ids: []
            }
        }).then(result => {
            expect(result.name).toBe('Yoda');
            expect(result.id).toBe(4);
        });
    });

    it('Should remove a person', () => {
        return orm.destroy('Person', {
            where: {
                id: 4
            }
        }).then(result => {
            expect(result).toBeFalsy();
        });
    });

    it('Should be able to find a person home planet', () => {
        return orm.findOne(`{
            Person (id=$id) {
                name,
                homeplanet {
                    name
                }
            }
        }`, { id: 1 }).then(result => {
            expect(result.name).toBe('Luke Skywalker');
            expect(result.homeplanet.name).toBe('Tatooine');
        });
    });

    it('Should be able to find deeply nested data', () => {
        return orm.findOne(`{
            Person(id=1) {
                homeplanet {
                    featured_person {
                        name
                    }
                }
            }
        }`, {}).then(result => {
            expect(result.homeplanet.featured_person.name).toBe('Luke Skywalker');
        });
    });

    it('Should be able to find the vehicles a person drives', () => {
        return orm.findOne(`{
            Person (id=$id) {
                name,
                vehicles {
                    name
                }
            }
        }`, {
            id: 1
        }).then(result => {
            expect(result.name).toBe('Luke Skywalker');
            expect(result.vehicles[0].name).toBe('Landspeeder');
            expect(result.vehicles[1].name).toBe('X-Wing');
        });
    });

    it('Should validate a person', () => {
        return orm.validate('Person', {}).catch(result => {
            expect(result).toBeTruthy();
        });
    });

    it('Should validate a person', () => {
        return orm.validate('Person', {
            id: 4,
            height: 3,
            gender: 'male',
            home_planet_id: undefined,
            vehicle_ids: []
        }).catch(result => {
            expect(result[0].attribute).toBe('name');
        });
    });

    it('Should pass validation', () => {
        return orm.validate('Person', {
            id: 4,
            name: 'Yoda',
            height: 3,
            gender: 'male',
            home_planet_id: undefined,
            vehicle_ids: []
        }).then(() => {
            // Yay
        });
    });
});