/**
 * Create private property identifier from public property
 * @param {string|symbol} publicPropName The public property identifier from which to derive private prop name
 * @returns {string|symbol}
 */
export const createPrivatePropName = <T extends EardrumSupportedPropertyKey>(publicPropName: T): T => {
    if (typeof publicPropName === 'number') throw new Error('Eardrum does not support property keys of type number');
    if (typeof publicPropName === 'symbol') {
        // Return new symbol
        return Symbol() as any;
    }
    return `_${publicPropName}` as any;
};

/**
 * Returns true if the environment is node, false otherwise
 * @returns {Boolean} boolean
 */
export const isNodeEnv = (): boolean => {
    return typeof window === 'undefined';
};

/**
 * Determine if a value is a Function
 * @param {Object} val The value to test
 * @returns {boolean}
 */
export const isFunction = (val: unknown): boolean => toString.call(val) === '[object Function]';

/**
 * Determine if a value is an Object configurable by Eardrum
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
export const isEardrumSupportedObject = (val: unknown): boolean => {
    if (toString.call(val) !== '[object Object]') {
      return false;
    } 
    return true;
};

/**
 * Determine if a value is an object is an EventTarget (for DOM) | EventEmitter (for Node)
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
export const isEventTargetOrEmitter = (val?: { [index: PropertyKey]: any }): boolean => {
    if (!val) return false;
    
    if (
        (
            typeof val['addEventListener'] === 'function' &&
            typeof val['removeEventListener'] === 'function'
        ) ||
        (
            typeof val['addListener'] === 'function' &&
            typeof val['removeListener'] === 'function'
        )
    ) {
        return true;
    }
    return false;
};

/**
 * Removes all indexes from an array
 *
 * @param {Array} val The other to empty
 */
export const emptyArray = (val: Array<unknown>): void => {
    if (
        typeof val.length !== 'number' ||
        typeof val.pop !== 'function' ||
        !Array.isArray(val)
    ) {
        throw new Error('Invalid argument passed to emptyArray: argument should be an array');
    }
    while(val.length > 0) {
        val.pop();
    } 
};

/**
 * Throw error if object property is not configurable
 * @param {Object} object The object to inspect
 * @param {string|symbol} property The object property to check on
 * @param {string?} msg Message of thrown error if property is not configurable
 */
export const throwIfPropIsNotConfigurable = (
    { object, key }: { object: Object, key: EardrumSupportedPropertyKey },
    msg?: string
): never|undefined|PropertyDescriptor => {
    // Default error msg
    if (typeof msg !== 'string') msg = `Error: property '${key.toString()}' is not configurable`;

    // Get property descriptor
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (typeof descriptor !== 'undefined') {
        // Throw if not configurable
        if (!descriptor.configurable) {
            throw new Error(msg);
        } 
    }

    // Otherwise return property descriptor
    return descriptor;
}