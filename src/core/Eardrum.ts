import configure from './configure';
import reset from './reset';
import EardrumRef from './Ref';

export default class Eardrum {
	constructor () {
		this.configure = configure.bind(this);
		this.reset = reset.bind(this);
	}

	public configure: (args: EardrumConfigureArgs) => void;
	public reset: () => void;

	public Eardrum = Eardrum;

	// Stored values
	readonly refs: EardrumRef[] = [];
	readonly lastConfiguredObject: { current: EardrumSupportedObject|null } = { current: null };
};