import { handlerReferences } from '../storedValues';
import { isEardrumSupportedObject, isNodeEnv } from '../utils';

/**
 * Store references of added handlers in an Array and remove from that
 *
 * @param {boolean} attach Whether the listener needs to be added (true) or removed (false)
 * @param {Function} handler The handler which will be added in case attach is true
 * @param {Object} target The object on which listener is attached/removed
 * @param {string} eventType The type of the event we want to listen to
 * @param {ListenerRemovalConditionCallback} listenerRemovalCondition Callback executed during iteration of handlerReferences.
 * - Returns a condition at which a listener should be removed
 * - Removes all listeners by default
 * @param {Object} [additionalHandlerRefProperties] Object to merge with EventHandlerReference
 * @param {string} [attachMethodName=addEventListener] The method of target object used to attach a listener;
 * @param {string} [detachMethodName=removeEventListener] The method of target object used to remove a listener;
 */
 function listenWithCleanup(attach: any, handler: any, target: any, eventType: any, listenerRemovalCondition: any, additionalHandlerRefProperties: any, attachMethodName: any, detachMethodName: any) {
    if (attach) {
        // Add listener
      target[attachMethodName](eventType, handler);
  
      // Register reference to handler
      var refToAdd = { handler: handler, eventType: eventType };
      if (isEardrumSupportedObject(additionalHandlerRefProperties)) {
          refToAdd = { ...refToAdd, ...additionalHandlerRefProperties };
      }
      handlerReferences.push(refToAdd);
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
        target[detachMethodName](eventType, ref.handler);
      });
    }
  }
  function useDefaultReject (a: any, b: any, c: any, d: any) {}
  
  /**
   * Add or remove an unhandledRejection event listener from axios instance
   * Calls listenWithCleanup with appropriate parameters
   *
   * @param {boolean} attach Whether the listener needs to be added (true) or removed (false)
   * @param {object} instance The axios instance that owns defaultReject
   */
  function toggleListener(attach: boolean, instance: any) {
    var handler;
    var target;
    var attachMethodName;
    var detachMethodName;
    var eventType = 'unhandledrejection';
  
    // Axios instance can only remove its own listeners
    var additionalHandlerRefProperties = { _instanceId: instance._instanceId };
    var listenerRemovalCondition = function listenerRemovalCondition(ref: any) {
      return ref._instanceId === instance._instanceId;
    };
  
    if (isNodeEnv()) {
      // For node attach listener on process
      target = process;
      attachMethodName = 'addListener';
      detachMethodName = 'removeListener';
      handler = function handleServerSideUnhandledRejection(e: any, promise: any) {
        useDefaultReject(instance, e, e, promise);
      };
    } else if (typeof window !== 'undefined') {
      // For browsers attach listener on window
      target = window;
      attachMethodName = 'addEventListener';
      detachMethodName = 'removeEventListener';
      handler = function handleBrowserSideUnhandledRejection(e: any) {
        useDefaultReject(instance, e.reason, e, e.promise);
      };
    } else { return; }
  
    listenWithCleanup(attach, handler, target, eventType, listenerRemovalCondition, additionalHandlerRefProperties, attachMethodName, detachMethodName);
  }
  
  /**
   * Call toggleListener with attach = true
   * @param {Object} instance The axios instance
   */
  export function installListener(object: EardrumSupportedObject) {
    toggleListener(true, object);
  }
  
  /**
   * Call toggleListener with attach = false
   * @param {Object} instance The axios instance
   */
  export function ejectListener(object: EardrumSupportedObject) {
    toggleListener(false, object);
  }