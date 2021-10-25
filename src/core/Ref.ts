import { isNodeEnv } from "./utils";

export default class EardrumRef implements EventHandlerReference {
    constructor ({
        handler,
        eventType,
        options,
        object,
        property,
        target,
        eardrumInstanceRefs
    }: EventHandlerReference) {
        this.handler = handler;
        this.eventType = eventType;
        this.options = options;
        this.object = object;
        this.property = property;
        this.target = target;
        this.eardrumInstanceRefs = eardrumInstanceRefs;
    }

    public readonly handler;
    public readonly eventType;
    public readonly options;
    public readonly object;
    public readonly property;
    public readonly target;
    private readonly eardrumInstanceRefs: EardrumRef[];

    /**
     * Remove listener and eject reffalse if failed
     * 
     * @returns {boolean} True if successful, 
     */
    public readonly eject = (): boolean => {
        const detachMethodName = isNodeEnv() ? 'removeListener' : 'removeEventListener';
        // Remove listener
        const eventTarget = this.target as any; // allow indexation by string
        eventTarget[detachMethodName](this.eventType, this.handler, this.options);

        // Eject ref
        for (let i = 0; i < this.eardrumInstanceRefs.length; i++) {
            const ref = this.eardrumInstanceRefs[i];
            if (ref === this) {
                this.eardrumInstanceRefs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}
