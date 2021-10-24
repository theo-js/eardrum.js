/**
 * @jest-environment jsdom
 */
const eardrum = require('../../dist/eardrum.js');

describe('configure method helper', () => {
	afterEach(() => {
		eardrum.reset();
	});

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

		eardrum.configure({
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

		let receivedEardrumConfigureArgs: any = null;
		let receivedEvent: any = null;
		const listenerRemovalCondition = (ref: any, index: number, array: any[]): boolean => false;

		const handler = jest.fn(function (e: Event, eardrumConfigureArgs: Object): void {
			receivedEvent = e;
			receivedEardrumConfigureArgs = eardrumConfigureArgs;
		});
		const useCapture = true;
		const type = 'click';
		const providedListener = {
			type,
			target,
			options: useCapture
		};

		eardrum.configure({
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
		expect(receivedEardrumConfigureArgs.object).toStrictEqual(object);
		expect(receivedEardrumConfigureArgs.property === property).toBe(true);
		expect(receivedEardrumConfigureArgs.listener).toStrictEqual(providedListener);
		expect(receivedEardrumConfigureArgs.value === value).toBe(true);
		expect(receivedEardrumConfigureArgs.handler).toStrictEqual(handler);
		expect(receivedEardrumConfigureArgs.listenerRemovalCondition).toStrictEqual(listenerRemovalCondition);
		expect(receivedEardrumConfigureArgs.additionalRefProps).toStrictEqual(additionalRefProps);
		expect(receivedEardrumConfigureArgs.additionalRefProps).toStrictEqual(additionalRefProps);
	});

	it('GIVEN changed value of configured property THEN should use listenerRemovalCondition function', () => {
		const property = 'MY_PROPERTY';
		const object = { [property]: 'INITIAL_VALUE' };
		const mockFn = jest.fn((ref: any, i: number, arr: any): any => console.log(arr));
		eardrum.configure({
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
});