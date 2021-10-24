import { lastConfiguredObject } from '../storedValues';
import validateEardrumConfigureArgs from './validateEardrumConfigureArgs';
import { installListener, ejectListener } from './listen';
import { isFunction, createPrivatePropName } from '../utils';

/**
 * Configure object property to automatically manage event listeners 
 *
 * @param {object} eardrumConfigureArgs Options object
 */
export default function configure (eardrumConfigureArgs: EardrumConfigureArgs): void {
  // Validation
  let {
    object,
    property,
    value,
    handler,
    additionalRefProps = {}
  } = validateEardrumConfigureArgs(eardrumConfigureArgs);

  // Create private property
  const _property = createPrivatePropName(property);

  // Clear previous event listener
  /*if (lastConfiguredObject.current /* && lastConfiguredObject.current === object *//*) {
    ejectListener({
      ...eardrumConfigureArgs,
      object: lastConfiguredObject.current
    });
  }*/
  lastConfiguredObject.current = object;

  // Attach initial event listener
  if (isFunction(handler)) {
  	installListener(eardrumConfigureArgs);
  }

  // Define setter/getter for defaultReject
  Object.defineProperties(object, {
  	[_property]: {
  		value: typeof value === 'undefined' ? object[property] : value,
  		writable: true,
      configurable: true,
      enumerable: false
  	},
  	[property]: {
	  	get: function (this: EardrumSupportedObject): unknown {
	  		return this[_property];
	  	},
	    set: function (this: EardrumSupportedObject, newValue: unknown): void {
		    // Clear previous event listener
		    ejectListener(eardrumConfigureArgs);

		    // Replace defaultReject
		    this[_property] = newValue;

		    // Attach new listener
		    if (isFunction(newValue)) {
	        installListener(eardrumConfigureArgs);
		    }
	    },
      configurable: true,
      enumerable: true
	  }
  });
};