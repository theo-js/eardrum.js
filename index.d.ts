/**
 * Parameters of the eardrum.configure method
 */
interface EardrumConfigureArgs {
    object: EardrumSupportedObject;
    property: EardrumSupportedPropertyKey;
    value?: unknown;
    handler?: any | EardrumEventHandler;
    listener?: {
        type?: string;
        /**
         * Defaults to global object
         */
        target?: EardrumTarget;
        options?: EventListenerOptions
    };
    listenerRemovalCondition?: ListenerRemovalCondition;
    /**
     * Additional properties that can be appended to an EventHandlerReference
     */
    additionalRefProps?: { [index: PropertyKey]: any };
}

type EardrumSupportedObject = {
    [key: EardrumSupportedPropertyKey]: unknown;
}

type EardrumTarget = EventTarget | import('events').EventEmitter;

type EardrumSupportedPropertyKey = Exclude<PropertyKey, number>;

type EardrumEventHandler = (e: Event, args: EardrumConfigureArgs) => unknown
    
interface EventHandlerReference {
    /**
     * Function that is executed when event is triggered
     */
    handler: EardrumEventHandler;
    /**
     * Type of the handled event
     */
    eventType: string;
    /**
     * EventListenerOptions
     */
    options?: EventListenerOptions;
    /**
     * Ref to the object whose property was configured by eardrum
     */
    object: EardrumSupportedObject;
    /**
     * Property that was configured by eardrum
     */
    property: EardrumSupportedPropertyKey;
    /**
     * Event target
     */
    target: EardrumTarget;    
    /**
     * Allow additional properties
     */
    [index: PropertyKey]: any;
}

/**
 * @param {object} ref EardrumRef to the handler that should be removed or not
 * @param {number} index Index of the current ref in the handlerReferences array
 * @param {Array} array Whole EardrumRef array
 * @return {boolean} Whether we want to remove the handler or not
 */
type ListenerRemovalCondition = (
    ref?: import('./src/core/Ref').default,
    index?: number,
    array?: Array<import('./src/core/Ref').default>
) => boolean;

type EventManipulationMethodName = (
    | 'addEventListener'
    | 'removeEventListener'
    | 'addListener'
    | 'removeListener'
);
