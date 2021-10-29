import Eardrum from '../Eardrum';
import validateEardrumWatchArgs from './validateEardrumWatchArgs';
import { installListener, ejectListener } from './listen';
import { isFunction, createPrivatePropName } from '../utils';

/**
 * Configure object property to automatically manage event listeners in setter function
 *
 * @param {object} eardrumWatchArgs Options object
 */
export default function watch (this: Eardrum, eardrumWatchArgs: EardrumWatchArgs): void {
  // Validation
  const eardrumWatchArgsValidated = validateEardrumWatchArgs(eardrumWatchArgs);
  const {
    object,
    property,
    value,
    handler
  } = eardrumWatchArgsValidated;

  // Bind context
  const install = installListener.bind(this, eardrumWatchArgsValidated);
  const eject = ejectListener.bind(this, eardrumWatchArgsValidated);
  /*
  const ejectLast = ejectListener.bind(this, {
    ...eardrumWatchArgsValidated,
    object: lastWatched.current
  });
  */

  // Create private property
  const _property = createPrivatePropName(property);

  // Clear previous event listener
  /*if (this.lastWatched.current /* && this.lastWatched.current === object *//*) {
    ejectLast();
  }*/
  this.lastWatched.current = object;

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