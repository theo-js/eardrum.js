import Eardrum from '../Eardrum';
import EardrumRef from '../Ref';
import { isEardrumSupportedObject, isEventTargetOrEmitter, isNodeEnv } from '../utils';

interface ListenWithCleanupOptions extends EardrumWatchArgs {
  attachMethodName: string;
  detachMethodName: string;
  attach: boolean;
  listener: {
    type: string;
    target: EardrumTarget; // defaults to global object
    options?: EventListenerOptions;
  };
  additionalRefProps: { [index: PropertyKey]: any }
}
/**
 * Store references of added handlers in an Array and remove from that
 *
 * @param {object} options EardrumWatchArgs with additional parameters
 */
function listenWithCleanup(this: Eardrum, {
  attach,
  attachMethodName, detachMethodName,
  object,
  property,
  listener,
  handler,
  listenerRemovalCondition,
  additionalRefProps
}: ListenWithCleanupOptions): void {
  var { target, options } = listener;
  var eventTarget = target as any; // allow indexation by string
  var eventType =  listener.type;

  if (!eventTarget[attachMethodName] || !eventTarget[detachMethodName]) {
    throw new Error('Event target is invalid');
  }

  if (attach) {
    // Add listener
    eventTarget[attachMethodName](eventType, handler, options);

    // Store reference to handler
    let refParams: EventHandlerReference = {
      handler,
      eventType,
      options,
      object,
      property,
      target: eventTarget,
      eardrumInstanceRefs: this.refs
    };
    if (isEardrumSupportedObject(additionalRefProps)) {
        refParams = { ...additionalRefProps, ...refParams };
    }
    const refToStore = new EardrumRef(refParams);
    this.refs.push(refToStore);
  } else {
    // Determine which listeners to remove
    var toRemove = this.refs.filter((ref: EardrumRef, index: number, array: Array<EardrumRef>) => {
      var shouldBeRemoved;
      if (typeof listenerRemovalCondition !== 'function') {
        shouldBeRemoved = true;
      } else {
        shouldBeRemoved = listenerRemovalCondition(ref, index, array);
      }

      if (shouldBeRemoved) {
          // Delete refs of removed event listeners
          this.refs.splice(index, 1);
      }
      return shouldBeRemoved;
    });

    // Remove listeners
    toRemove.forEach((ref: EardrumRef) => {
      eventTarget[detachMethodName](eventType, ref.handler, ref.options);
    });
  }
}
  
/**
 * Add or remove an unhandledRejection event listener from axios instance
 * Calls listenWithCleanup with appropriate parameters
 *
 * @param {boolean} attach Whether the listener needs to be added (true) or removed (false)
 * @param {object} eardrumWatchArgs Parameters of the watch method
 */
function toggleListener(
  this: Eardrum,
  attach: boolean,
  eardrumWatchArgs: EardrumWatchArgs
): void|never {
  // Typescript narrowing
  const { handler, listener, additionalRefProps } = eardrumWatchArgs;
  const narrowedAdditionalRefProps = additionalRefProps as { [index: PropertyKey]: any };
  const narrowedListener = listener as {
    type?: string;
    target?: EardrumTarget; // defaults to global object
    options?: EventListenerOptions;
  }
  let { type, target } = narrowedListener;
  var narrowedHandler = handler as Function;
  var narrowedTarget = target as EardrumTarget;
  var handlerWrapper: Function;

  var attachMethodName: string;
  var detachMethodName: string;

  if (isNodeEnv()) {
    // For node attach listener on process by default
    if (!isEventTargetOrEmitter(narrowedTarget)) {
      narrowedTarget = process;
    }
    attachMethodName = 'addListener';
    detachMethodName = 'removeListener';
    handlerWrapper = function (e: Event) {
      narrowedHandler(e, eardrumWatchArgs);
    };
  } else if (typeof window !== 'undefined') {
    // For browsers attach listener on window by default
    if (!isEventTargetOrEmitter(narrowedTarget)) {
      narrowedTarget = window;
    }
    attachMethodName = 'addEventListener';
    detachMethodName = 'removeEventListener';
    handlerWrapper = function (e: Event) {
      narrowedHandler(e, eardrumWatchArgs);
    };
  } else {
    throw new Error('This environment does not support eardrum.js');
  }

  (listenWithCleanup.bind(this, {
    ...eardrumWatchArgs,
    handler: handlerWrapper,
    listener: {
      ...narrowedListener,
      target: narrowedTarget,
      type: type || ''
    },
    additionalRefProps: narrowedAdditionalRefProps,
    attachMethodName,
    detachMethodName,
    attach
  }))();
}

/**
 * Call toggleListener with attach = true
 * @param {object} eardrumWatchArgs Parameters of the eardrum watch method
 */
export function installListener(this: Eardrum, eardrumWatchArgs: EardrumWatchArgs) {
  (toggleListener.bind(this, true, eardrumWatchArgs))();
}

/**
 * Call toggleListener with attach = false
 * @param {object} eardrumWatchArgs Parameters of the eardrum watch method
 */
export function ejectListener(this: Eardrum, eardrumWatchArgs: EardrumWatchArgs) {
  (toggleListener.bind(this, false, eardrumWatchArgs))();
}