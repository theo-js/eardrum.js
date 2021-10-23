interface EardrumConfigureArgs {
    object: EardrumSupportedObject;
    property: EardrumSupportedPropertyKey;
    handler?: unknown;
}

type EardrumSupportedObject = {
    [key: EardrumSupportedPropertyKey]: unknown;
}

type EardrumSupportedPropertyKey = Exclude<PropertyKey, number>;
    
interface EventHandlerReference {
    /**
     * Function that is executed when event is triggered
     */
    handler: Function;
    /**
     * Type of the handled event
     */
    eventType: string;
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
type ListenerRemovalConditionCallback = (
    ref: EventHandlerReference,
    index: number,
    array: Array<EventHandlerReference>
) => boolean;
