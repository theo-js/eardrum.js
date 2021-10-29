/**
 * @jest-environment jsdom
 */
var eardrum = require('../../dist/eardrum.js');

describe('static api', () => {
	it('should have object configuration method helpers', () => {
		expect(typeof eardrum.watch).toEqual('function');
		expect(typeof eardrum.reset).toEqual('function');
	});

	it('should have Eardrum class', () => {
		expect(typeof eardrum.Eardrum === 'function').toBe(true);
		expect(eardrum instanceof eardrum.Eardrum).toBe(true);
	});

	it('should have EardrumRef class', () => {
		expect(typeof eardrum.EardrumRef === 'function').toBe(true);
	});

	it('stored values should be initialized correctly', () => {
		expect(eardrum.refs).toEqual([]);
		expect(eardrum.lastWatched).toEqual({ current: null });
	});
});
