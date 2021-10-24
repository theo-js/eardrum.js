import { handlerReferences, lastConfiguredObject } from '../storedValues'
import { isNodeEnv, emptyArray } from '../utils';

export const resetStoredValues = (): boolean => {
	try {
		emptyArray(handlerReferences);
		lastConfiguredObject.current = null;
		return true;
	} catch (error) {
		return false;
	}
};

/* Remove all listeners and reset stored values */
export default function reset (): boolean {
	try {
		// Remove all listeners
		const detachMethod = isNodeEnv() ? 'removeListener' : 'removeEventListener';
		handlerReferences.forEach((ref: EventHandlerReference) => {
			const narrowedTarget = ref.target as any;
			narrowedTarget[detachMethod](ref.eventType, ref.handler, ref.options);
		});

		// Reset stored values
		resetStoredValues();
		
		return true;
	} catch (error) {
		return false;
	}
};