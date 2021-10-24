var eardrum = require('../../dist/eardrum.js');

describe('configure method helper', () => {
	it('GIVEN property does not exist on object THEN should add property to object', () => {
		const object = {} as any;
		const property = 'MY_PROPERTY';
		eardrum.configure({ object, property });
		expect(property in object).toBe(true);
	});

	it('GIVEN value parameter is not defined THEN object property should be undefined', () => {
		const object1 = {} as any;
		const object2 = {} as any;
		const property = 'MY_PROPERTY';

		eardrum.configure({
			object: object1,
			property
		});
		expect(typeof object1[property] === 'undefined').toBe(true);

		eardrum.configure({
			object: object2,
			property,
			value: undefined
		});
		expect(typeof object2[property] === 'undefined').toBe(true);
	});

	it('GIVEN value parameter is defined THEN should give object property a value', () => {
		const object1 = {} as any;
		const object2 = {} as any;
		const property = 'MY_PROPERTY';
		const value = 'MY_VALUE';

		eardrum.configure({
			object: object1,
			property,
			value
		});
		expect(object1[property] === value).toBe(true);

		eardrum.configure({
			object: object2,
			property,
			value: null
		});
		expect(object2[property] === null).toBe(true);
	});
});