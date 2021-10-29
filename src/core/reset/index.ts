import Eardrum from '../Eardrum';
import EardrumRef from '../Ref';
import { isNodeEnv, emptyArray } from '../utils';

/* Remove all listeners and reset stored values */
export default function reset (this: Eardrum): boolean {
	try {
		// Remove all listeners
		const detachMethod = isNodeEnv() ? 'removeListener' : 'removeEventListener';
		this.refs.forEach((ref: EardrumRef) => {
			const narrowedTarget = ref.target as any;
			narrowedTarget[detachMethod](ref.eventType, ref.handler, ref.options);
		});

		// Reset stored values
		try {
			emptyArray(this.refs);
			this.lastWatched.current = null;
		} catch (err) {
			return false;
		}
		
		return true;
	} catch (error) {
		return false;
	}
};