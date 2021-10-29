import watch from './watch';
import reset from './reset';
import EardrumRef from './Ref';

export default class Eardrum {
	constructor () {
		this.watch = watch.bind(this);
		this.reset = reset.bind(this);
	}

	public readonly watch: (args: EardrumWatchArgs) => void;
	public readonly reset: () => void;

	public readonly Eardrum = Eardrum;
	public readonly EardrumRef = EardrumRef;

	// Stored values
	public readonly refs: EardrumRef[] = [];
	public readonly lastWatched: {
		current: EardrumSupportedObject|null
	} = { current: null };
};