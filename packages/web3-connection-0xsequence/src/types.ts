import {ConnectOptions, ProviderConfig, SequenceProvider} from '@0xsequence/provider';

// import {sequence} from '0xsequence';
export type {SequenceProvider, SequenceClient, SequenceSigner} from '@0xsequence/provider';
export type {ProviderConfig, WalletSession} from '@0xsequence/provider';

export type SequenceOptions = {
	projectAccessKey: string;
	config?: Partial<ProviderConfig>;
	info: ConnectOptions;
};

// export type SequenceProvider = InstanceType<typeof sequence.SequenceProvider>;
// export type SequenceClient = InstanceType<typeof sequence.SequenceClient>;
// export type SequenceSigner = InstanceType<typeof sequence.SequenceSigner>;

export type Sequence = {
	initWallet(projectAccessKey: string, partialConfig?: Partial<ProviderConfig>): SequenceProvider;
	sequence: {
		getWallet(): SequenceProvider;
		initWallet(projectAccessKey: string, partialConfig?: Partial<ProviderConfig>): SequenceProvider;
		unregisterWallet(): void;
	};
};
