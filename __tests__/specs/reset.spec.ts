/**
 * @jest-environment jsdom
 */
var eardrum = require('../../dist/eardrum.js');

describe('reset method helper', () => {
	it('should delete all references to event handlers and other stored values', () => {
		expect(eardrum.refs.length).toBe(0);

		const object = {};
		const calls = 10;
		for (let i = 0; i < calls; i++) {
			eardrum.configure({
				object,
				property: 'PROP',
				handler: jest.fn(),
				target: window
			});
		}
		expect(eardrum.refs.length).toBe(calls);
		expect(eardrum.lastConfiguredObject.current === object).toBe(true);
		
		eardrum.reset();
		expect(eardrum.refs.length).toBe(0);
		expect(eardrum.lastConfiguredObject.current === null).toBe(true);
	});

	it('should return true if ref was successfully ejected, false otherwise', () => {
		expect(eardrum.refs.length).toBe(0);
	});
});