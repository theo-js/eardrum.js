import { handlerReferences } from '../storedValues';
import { isEardrumSupportedObject, isNodeEnv } from '../utils';

interface ListenWithCleanupOptions extends EardrumConfigureArgs {
  attachMethodName: string;
  detachMethodName: string;
  attach: boolean;
}
/**
 * Store references of added handlers in an Array and remove from that
 *
 * @param {object} options EardrumConfigureArgs with additional parameters
 */
function listenWithCleanup({
  attach,
  attachMethodName, detachMethodName,
  object,
  listener,
  handler,
  listenerRemovalCondition,
  additionalRefProps
}: ListenWithCleanupOptions) {
  var { target, bubble } = listener;
  var eventTarget = target as any; // allow indexation by string
  var eventType =  listener.type;

  if (!eventTarget[attachMethodName] || !eventTarget[detachMethodName]) {
    throw new Error('EventTarget is invalid');
  }

  if (attach) {
    // Add listener
    eventTarget[attachMethodName](eventType, handler);

    // Store reference to handler
    var refToStore = { handler, eventType, object } as EventHandlerReference;
    if (isEardrumSupportedObject(additionalRefProps)) {
        refToStore = { ...additionalRefProps, ...refToStore };
    }
    handlerReferences.push(refToStore);
  } else {
    // Determine which listeners to remove
    var toRemove = handlerReferences.filter(function filterRefs(ref, index, array) {
      var shouldBeRemoved;
      if (typeof listenerRemovalCondition !== 'function') {
        shouldBeRemoved = true;
      } else {
        shouldBeRemoved = listenerRemovalCondition(ref, index, array);
      }

      if (shouldBeRemoved) {
          // Delete refs of removed event listeners
          handlerReferences.splice(index, 1);
      }
      return shouldBeRemoved;
    });

    // Remove listeners
    toRemove.forEach((ref: EventHandlerReference) => {
      eventTarget[detachMethodName](eventType, ref.handler);
    });
  }
}
  
/**
 * Add or remove an unhandledRejection event listener from axios instance
 * Calls listenWithCleanup with appropriate parameters
 *
 * @param {boolean} attach Whether the listener needs to be added (true) or removed (false)
 * @param {object} eardrumConfigureArgs Parameters of the configure method
 */
function toggleListener(
  attach: boolean,
  eardrumConfigureArgs: EardrumConfigureArgs
) {
  var { object, handler, listener } = eardrumConfigureArgs;
  var { target } = listener;
  var narrowedHandler = handler as Function;
  var handlerWrapper: Function;
  var attachMethodName: string;
  var detachMethodName: string;

  if (isNodeEnv()) {
    // For node attach listener on process by default
    if (!isEardrumSupportedObject(target)) {
      target = process;
    }
    attachMethodName = 'addListener';
    detachMethodName = 'removeListener';
    handlerWrapper = function (e: Event) {
      narrowedHandler(e, eardrumConfigureArgs);
    };
  } else if (typeof window !== 'undefined') {
    // For browsers attach listener on window by default
    target = window;
    attachMethodName = 'addEventListener';
    detachMethodName = 'removeEventListener';
    handlerWrapper = function (e: Event) {
      narrowedHandler(e, eardrumConfigureArgs);
    };
  } else {
    throw new Error('This environment does not support eardrum.js');
  }

  listenWithCleanup({
    ...eardrumConfigureArgs,
    handler: handlerWrapper,
    listener: {
      ...listener,
      target
    },
    attachMethodName,
    detachMethodName,
    attach
  });
}

/**
 * Call toggleListener with attach = true
 * @param {object} eardrumConfigureArgs Parameters of the eardrum configure method
 */
export function installListener(eardrumConfigureArgs: EardrumConfigureArgs) {
  toggleListener(true, eardrumConfigureArgs);
}

/**
 * Call toggleListener with attach = false
 * @param {object} eardrumConfigureArgs Parameters of the eardrum configure method
 */
export function ejectListener(eardrumConfigureArgs: EardrumConfigureArgs) {
  toggleListener(false, eardrumConfigureArgs);
}