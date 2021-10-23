var eardrum = require('../../dist/eardrum.js');

describe('static api', () => {
	it('should have object configuration method helpers', () => {
		expect(typeof eardrum.configure).toEqual('function');
	});
});
