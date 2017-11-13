import { arrayOf, boolean, number, optionalNumber, optionalString, string } from '../index';

describe('Types tests', () => {
    it('Should validate a number', () => {
        expect(number(1)).toBe(true);
        expect(number('1')).toBe(false);
        expect(number(undefined)).toBe(false);
    });

    it('Should validate an optional number', () => {
        expect(optionalNumber(1)).toBe(true);
        expect(optionalNumber('1')).toBe(false);
        expect(optionalNumber(undefined)).toBe(true);
    });

    it('Should validate a string', () => {
        expect(string('1')).toBe(true);
        expect(string(1)).toBe(false);
        expect(string(undefined)).toBe(false);
    });

    it('Should validate an optional string', () => {
        expect(optionalString('1')).toBe(true);
        expect(optionalString(1)).toBe(false);
        expect(optionalString(undefined)).toBe(true);
    });

    it('Should validate a boolean', () => {
        expect(boolean(true)).toBe(true);
        expect(boolean(true)).toBe(true);
        expect(boolean(1)).toBe(false);
        expect(boolean(undefined)).toBe(false);
    });

    it('Should validate an array of numbers', () => {
        expect(arrayOf(number)([1,2,3])).toBe(true);
        expect(arrayOf(number)(['1'])).toBe(false);
        expect(arrayOf(number)([1, '1'])).toBe(false);
    });

    it('Should validate an array of strings', () => {
        expect(arrayOf(string)(['hello'])).toBe(true);
        expect(arrayOf(string)(['hello', true])).toBe(false);
    });
});