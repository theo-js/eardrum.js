interface EardrumConfigureArgs {
    object: EardrumSupportedObject;
    property: EardrumSupportedPropertyKey;
    handler?: any | EardrumEventHandler;
    listener: {
        type: string;
        target?: EventTarget | import('events').EventEmitter; // defaults to global object
        bubble?: boolean;
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
     * Ref to the object configured by eardrum
     */
    object: EardrumSupportedObject;
    /**
     * Allow additional properties
     */
    [index: PropertyKey]: any;
}

/**
 * @param {EventHandlerReference} ref Reference to the handler that should be removed or not
 * @param {number} index Index of the current ref in the handlerReferences array
 * @param {Array} array Whole handlerReferences array
 * @return {boolean} Whether we want to remove the handler or not
 */
type ListenerRemovalCondition = (
    ref: EventHandlerReference,
    index: number,
    array: Array<EventHandlerReference>
) => boolean;
