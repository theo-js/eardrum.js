/**
 * @jest-environment jsdom
 */
import {
	createPrivatePropName,
	isNodeEnv,
	isFunction,
	isEardrumSupportedObject,
	isEventTargetOrEmitter,
	emptyArray,
	throwIfPropIsNotConfigurable
} from '../src/core/utils';

describe('utils', () => {
	describe('createPrivatePropName', () => {
		test('GIVEN string parameter THEN should return a new string and add an underscore', () => {
			const str = 'A_STRING';
			expect(createPrivatePropName(str)).toEqual('_' + str);
		});

		test('GIVEN symbol parameter THEN should return a new symbol', () => {
			const s = Symbol();
			const private_s = createPrivatePropName(s);
			expect(typeof private_s).toEqual('symbol');
			expect(s === private_s).toBe(false);
		});

		test('GIVEN parameter of any other type THEN should throw an error', () => {
			const fn = (param: any) => () => createPrivatePropName(param);
			expect(fn(0)).toThrow();
			expect(fn([])).toThrow();
			expect(fn({})).toThrow();
			expect(fn(true)).toThrow();
			expect(fn(null)).toThrow();
			expect(fn(undefined)).toThrow();
		});
	});

	describe('isNodeEnv', () => {
		test('GIVEN jsdom env THEN should return false', () => {
			expect(isNodeEnv()).toBe(false);
		})
	});

	describe('isFunction', () => {
		test('GIVEN function parameter THEN should return true', () => {
			expect(isFunction(() => true)).toEqual(true);
			expect(isFunction(function () { return true; })).toEqual(true);
		});

		test('GIVEN parameter of any other type THEN should return false', () => {
			expect(isFunction('a')).toEqual(false);
			expect(isFunction(1)).toEqual(false);
			expect(isFunction(true)).toEqual(false);
			expect(isFunction(null)).toEqual(false);
			expect(isFunction(undefined)).toEqual(false);
			expect(isFunction([])).toEqual(false);
			expect(isFunction({})).toEqual(false);

		});
	});

	describe('isEardrumSupportedObject', () => {
		test('GIVEN an object value THEN should return true', () => {
			expect(isEardrumSupportedObject({ key: 'VALUE' })).toBe(true);
		});

		test('GIVEN a non object value THEN should return false', () => {
			expect(isEardrumSupportedObject('a')).toBe(false);
			expect(isEardrumSupportedObject(1)).toBe(false);
			expect(isEardrumSupportedObject([])).toBe(false);
			expect(isEardrumSupportedObject(false)).toBe(false);
			expect(isEardrumSupportedObject(true)).toBe(false);
			expect(isEardrumSupportedObject(undefined)).toBe(false);
			expect(isEardrumSupportedObject(null)).toBe(false);
			expect(isEardrumSupportedObject(Promise.resolve())).toBe(false);
			expect(isEardrumSupportedObject(window)).toBe(false);
		});
	});

	describe('isEventTargetOrEmitter', () => {
		test('GIVEN event target THEN should return true', () => {
			expect(isEventTargetOrEmitter(window)).toBe(true);
			expect(isEventTargetOrEmitter(document)).toBe(true);
			expect(isEventTargetOrEmitter(document.body)).toBe(true);
			const div = document.createElement('div');
			expect(isEventTargetOrEmitter(div)).toBe(true);
		});

		test('GIVEN any value that is not an event target nor an event emitter THEN should return false', () => {
			expect(isEventTargetOrEmitter({})).toBe(false);
			expect(isEventTargetOrEmitter([])).toBe(false);
		});
	});

	describe('emptyArray', () => {
		test('GIVEN any non array value THEN should throw an error', () => {
			const fn = (param: any) => () => emptyArray(param);
			expect(fn(1)).toThrow();
			expect(fn('a')).toThrow();
			expect(fn(true)).toThrow();
			expect(fn(null)).toThrow();
			expect(fn(undefined)).toThrow();
			expect(fn({})).toThrow();
			expect(fn({ length: 3, pop: jest.fn() })).toThrow();
		});

		test('GIVEN array value THEN should remove all indexes', () => {
			function testArray (array: Array<any>): void {
				emptyArray(array);
				expect(array.length).toBe(0);
				expect(array[0]).toBe(undefined);
			}
			const arr1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			const arr2 = new Array(20);
			const arr3 = [0]; arr3[21] = 21;

			testArray(arr1);
			testArray(arr2);
			testArray(arr3);
		});
	});

	describe('throwIfPropIsNotConfigurable', () => {
		test('GIVEN configurable key THEN should not throw an error and return a PropertyDescriptor', () => {
			const object = {};
			const key = 'configurableProp';
			Object.defineProperty(object, key, { value: 'FOO', configurable: true, writable: true, enumerable: true });
			const fn = () => throwIfPropIsNotConfigurable({ object, key });
			expect(fn).not.toThrow();
			const returnValue: any = fn(); // should return a PropertyDescriptor object
			expect(!!returnValue).toBe(true);
			expect(returnValue.value).toBe('FOO');
			expect(returnValue.writable).toBe(true);
			expect(returnValue.enumerable).toBe(true);
			expect(returnValue.configurable).toBe(true);
		});

		test('GIVEN non configurable key THEN should throw an error', () => {
			const object = {};
			const key = 'nonConfigurableProp';
			Object.defineProperty(object, key, { value: 'FOO', configurable: false });
			expect(() => throwIfPropIsNotConfigurable({ object, key })).toThrow();
		});

		test('GIVEN non configurable key and provided an msg param THEN should throw an error with the msg', () => {
			const object = {};
			const key = 'nonConfigurableProp';
			Object.defineProperty(object, key, { value: 'FOO', configurable: false });
			const msg = 'MY_ERROR_MSG';
			expect(() => throwIfPropIsNotConfigurable({ object, key }, msg)).toThrowError(msg);
		});
	});
});