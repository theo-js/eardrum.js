import configure from './configure';
import reset from './reset';
import EardrumRef from './Ref';

export default class Eardrum {
	constructor () {
		this.configure = configure.bind(this);
		this.reset = reset.bind(this);
	}

	public readonly configure: (args: EardrumConfigureArgs) => void;
	public readonly reset: () => void;

	public readonly Eardrum = Eardrum;
	public readonly EadrumRef = EardrumRef;

	// Stored values
	readonly refs: EardrumRef[] = [];
	readonly lastConfiguredObject: { current: EardrumSupportedObject|null } = { current: null };
};