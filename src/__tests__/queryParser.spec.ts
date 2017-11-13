import queryParser from '../queryParser';

describe('The query parser', () => {
    it('Should parse a basic query string', () => {
        const result = queryParser(`{
            id,
            name
        }`, {});

        expect(result.fields[0]).toBe('id');
        expect(result.fields[1]).toBe('name');
    });

    it('Should parse a nested query string', () => {
        const result = queryParser(`{
            id,
            name,
            foo {
                bar
            }
        }`, {}); 

        expect(result.methods.foo.fields[0]).toBe('bar');
    });


    it('Should parse a deeply nested query string', () => {
        const result = queryParser(`{
            id,
            name,
            foo {
                bar,
                foobar {
                    baz
                }
            }
        }`, {}); 

        expect(result.methods.foo.methods.foobar.fields[0]).toBe('baz');
    });

    it('Should take arguments', () => {
        const result = queryParser(`{
            Person (id=1) {
                name
            }
        }`, {});

        expect(result.methods.Person.args.id).toBe(1);
    });

    it('Should take dynamic arguments', () => {
        const result = queryParser(`{
            Person (id=$id) {
                name
            }
        }`, {
            id: 2
        });

        expect(result.methods.Person.args.id).toBe(2);
    });
});