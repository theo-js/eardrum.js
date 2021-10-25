/**
 * @jest-environment jsdom
 */
import EardrumRef from '../../src/core/Ref';

describe('EardrumRef', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('GIVEN create EardrumRef instance THEN should have necessary properties and methods', () => {
        const object = {};
        const property = 'FOO';
        const handler = jest.fn();
        const eventType = 'click';
        const target = window;

        const ref = new EardrumRef({
            object,
            property,
            handler,
            eventType,
            target,
            eardrumInstanceRefs: []
        });
        expect(ref.object === object).toBe(true);
        expect(ref.property === property).toBe(true);
        expect(ref.handler === handler).toBe(true);
        expect(ref.eventType === eventType).toBe(true);
        expect(ref.target === target).toBe(true);
    });

    test('GIVEN eject method used THEN should remove event listener and eject ref from list', () => {
        const removeEventMock = jest.spyOn(window, 'removeEventListener');

        // Simulate added ref to Eardrum list of refs
        const refs = [] as Array<any>;
        const ref = new EardrumRef({
            object: {},
            property: 'FOO',
            handler: jest.fn(),
            eventType: 'click',
            target: window,
            eardrumInstanceRefs: refs
        });
        refs.push(ref);

        ref.eject();

        expect(removeEventMock).toHaveBeenCalledTimes(1);
        expect(refs.length === 0).toBe(true);
    });
});
