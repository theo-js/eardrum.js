import Eardrum from '../Eardrum';
import validateEardrumConfigureArgs from './validateEardrumConfigureArgs';
import { installListener, ejectListener } from './listen';
import { isFunction, createPrivatePropName } from '../utils';

/**
 * Configure object property to automatically manage event listeners 
 *
 * @param {object} eardrumConfigureArgs Options object
 */
export default function configure (this: Eardrum, eardrumConfigureArgs: EardrumConfigureArgs): void {
  // Validation
  const eardrumConfigureArgsValidated = validateEardrumConfigureArgs(eardrumConfigureArgs);
  const {
    object,
    property,
    value,
    handler
  } = eardrumConfigureArgsValidated;

  // Bind context
  const install = installListener.bind(this, eardrumConfigureArgsValidated);
  const eject = ejectListener.bind(this, eardrumConfigureArgsValidated);
  /*
  const ejectLast = ejectListener.bind(this, {
    ...eardrumConfigureArgsValidated,
    object: lastConfiguredObject.current
  });
  */

  // Create private property
  const _property = createPrivatePropName(property);

  // Clear previous event listener
  /*if (this.lastConfiguredObject.current /* && this.lastConfiguredObject.current === object *//*) {
    ejectLast();
  }*/
  this.lastConfiguredObject.current = object;

  // Attach initial event listener
  if (isFunction(handler)) {
  	install();
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
		    eject();

		    // Replace defaultReject
		    this[_property] = newValue;

		    // Attach new listener
		    if (isFunction(newValue)) {
	        install();
		    }
	    },
      configurable: true,
      enumerable: true
	  }
  });
};