import { isEardrumSupportedObject, throwIfPropIsNotConfigurable, isFunction } from "../utils";

export default function (eardrumConfigureArgs: EardrumConfigureArgs): EardrumConfigureArgs|never {
    let {
        object,
        property,
        handler,
        additionalRefProps = {},
        listener = {
            type: '',
            target: undefined,
            options: undefined
        }
    } = eardrumConfigureArgs;
    // Validate object
    if (!isEardrumSupportedObject(object)) throw new Error('Eardrum does not support this object');

    // Validate property
    /*const descriptor = */throwIfPropIsNotConfigurable(
        { object, key: property },
        `Eardrum cannot configure property ${property.toString()} of provided object because it is not configurable`
    );

    // Validate event handler
    if (typeof handler === 'undefined') {
        // Handler argument is missing
        // => should default to provided property value (if is function)
        if (isFunction(object[property])) {
            handler = object[property];
            eardrumConfigureArgs.handler = handler;
        }
    } 

    return {
        ...eardrumConfigureArgs,
        object,
        property,
        handler,
        additionalRefProps,
        listener
    };
};
