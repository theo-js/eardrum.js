import Eardrum from '../Eardrum';
import { isNodeEnv, emptyArray } from '../utils';

export function resetStoredValues (this: Eardrum): boolean {
	try {
		emptyArray(this.refs);
		this.lastConfiguredObject.current = null;
		return true;
	} catch (error) {
		return false;
	}
};

/* Remove all listeners and reset stored values */
export default function reset (this: Eardrum): boolean {
	try {
		// Remove all listeners
		const detachMethod = isNodeEnv() ? 'removeListener' : 'removeEventListener';
		this.refs.forEach((ref: EventHandlerReference) => {
			const narrowedTarget = ref.target as any;
			narrowedTarget[detachMethod](ref.eventType, ref.handler, ref.options);
		});

		// Reset stored values
		(() => resetStoredValues.bind(this))();
		
		return true;
	} catch (error) {
		return false;
	}
};