/**
 * @jest-environment jsdom
 */
var eardrum = require('../../dist/eardrum.js');

describe('watch method helper', () => {
	afterEach(() => {
		eardrum.reset();
		jest.resetAllMocks();
	});

	it('GIVEN property does not exist on object THEN should add property to object', () => {
		const object = {} as any;
		const property = 'MY_PROPERTY';
		eardrum.watch({ object, property });
		expect(property in object).toBe(true);
	});

	it('GIVEN value parameter is not defined THEN object property should be undefined', () => {
		const object1 = {} as any;
		const object2 = {} as any;
		const property = 'MY_PROPERTY';

		eardrum.watch({
			object: object1,
			property
		});
		expect(typeof object1[property] === 'undefined').toBe(true);

		eardrum.watch({
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

		eardrum.watch({
			object: object1,
			property,
			value
		});
		expect(object1[property] === value).toBe(true);

		eardrum.watch({
			object: object2,
			property,
			value: null
		});
		expect(object2[property] === null).toBe(true);
	});

	it('GIVEN browser env THEN should call addEventListener on provided target with proper arguments', () => {
		const object = {};
		const property = 'MY_PROPERTY';
		const value = 'MY_VALUE';
		const target = document.createElement('div');

		const handler = jest.fn();
		const useCapture = true;
		const type = 'click';
		const addEventListenerSpy = jest.spyOn(target, 'addEventListener');
		const providedListener = {
			type,
			target,
			options: useCapture
		};

		eardrum.watch({
			object, property, value,
			handler,
			listener: providedListener
		});

		expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

		// Trigger event on target
		target.dispatchEvent(new Event(type));

		const [receivedType, receivedHandler, receivedOptions] = addEventListenerSpy.mock.calls[0];

		expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
		expect(receivedType).toEqual(type);
		// We can't compare received handler because it is a function wrapping the original handler
		expect(receivedOptions).toStrictEqual(useCapture);
	});

	it('GIVEN provided an event handler function THEN should be called and receive all required params when event is dispatched', () => {
		const object = {};
		const property = 'MY_PROPERTY';
		const value = 'MY_VALUE';
		const additionalRefProps = {};
		const target = document.createElement('div');

		let receivedEardrumWatchArgs: any = null;
		let receivedEvent: any = null;
		const listenerRemovalCondition = (ref: any, index: number, array: any[]): boolean => false;

		const handler = jest.fn(function (e: Event, eardrumWatchArgs: Object): void {
			receivedEvent = e;
			receivedEardrumWatchArgs = eardrumWatchArgs;
		});
		const useCapture = true;
		const type = 'click';
		const providedListener = {
			type,
			target,
			options: useCapture
		};

		eardrum.watch({
			object, property, value,
			handler,
			listener: providedListener,
			listenerRemovalCondition,
			additionalRefProps
		});

		expect(handler).toHaveBeenCalledTimes(0);

		// Trigger event on target
		target.dispatchEvent(new Event(type));

		expect(handler).toHaveBeenCalledTimes(1);
		expect(receivedEvent instanceof Event).toBe(true);
		expect(receivedEardrumWatchArgs.object).toStrictEqual(object);
		expect(receivedEardrumWatchArgs.property === property).toBe(true);
		expect(receivedEardrumWatchArgs.listener).toStrictEqual(providedListener);
		expect(receivedEardrumWatchArgs.value === value).toBe(true);
		expect(receivedEardrumWatchArgs.handler).toStrictEqual(handler);
		expect(receivedEardrumWatchArgs.listenerRemovalCondition).toStrictEqual(listenerRemovalCondition);
		expect(receivedEardrumWatchArgs.additionalRefProps).toStrictEqual(additionalRefProps);
		expect(receivedEardrumWatchArgs.additionalRefProps).toStrictEqual(additionalRefProps);
	});

	it('GIVEN changed value of watched property THEN should use listenerRemovalCondition function', () => {
		const property = 'MY_PROPERTY';
		const object = { [property]: 'INITIAL_VALUE' };
		const mockFn = jest.fn();
		eardrum.watch({
			object,
			property,
			handler: jest.fn(),
			listenerRemovalCondition: mockFn
		});
		expect(mockFn).not.toHaveBeenCalled();

		// Set new value
		object[property] = 'NEW_VALUE';

		expect(mockFn).toHaveBeenCalled();
	});

	it('GIVEN provided a listenerRemovalCondition THEN should receive all required params', () => {
		const property = 'MY_PROPERTY';
		const object = { [property]: 'INITIAL_VALUE' };
		const type = 'keydown';
		const useCapture = true;
		const mockFn = jest.fn();
		eardrum.watch({
			object,
			property,
			handler: jest.fn(),
			listenerRemovalCondition: mockFn,
			listener: {
				type,
				options: useCapture
			}
		});

		// Set new value
		object[property] = 'NEW_VALUE';

		const [ref, index, refs] = mockFn.mock.calls[0];
		expect(refs[0]).toStrictEqual(ref);
		expect(typeof index === 'number').toBe(true);
		expect(typeof ref.handler === 'function').toBe(true);
		expect(ref.eventType === type).toBe(true);
		expect(ref.object).toStrictEqual(object);
		expect(ref.options).toStrictEqual(useCapture);
	});
});