import type {Web3WModule, Web3WModuleLoader} from 'web3-connection';
import {logs} from 'named-logs';
import {Sequence, SequenceOptions, SequenceProvider} from './types';
import type {EIP1193Provider} from 'eip-1193';
import {WrapperProvider} from './utils/WrapperProvider';

const console = logs('web3w-walletconnect:index');

function loadJS(url: string, integrity: string | undefined, crossorigin: string) {
	return new Promise<void>(function (resolve, reject) {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		if (integrity) {
			script.integrity = integrity;
		}
		if (crossorigin) {
			script.crossOrigin = crossorigin;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		script.onload = (script as any).onreadystatechange = function () {
			resolve();
		};
		script.onerror = function () {
			reject();
		};
		document.head.appendChild(script);
	});
}

class SequenceModule implements Web3WModule {
	public readonly id = '0xsequence';

	private config: SequenceOptions;
	private sequenceProvider: SequenceProvider | undefined;

	constructor(
		protected sequence: Sequence,
		config: SequenceOptions,
	) {
		this.config = config;
	}

	async setup(config?: SequenceOptions): Promise<{chainId: string; eip1193Provider: EIP1193Provider}> {
		const configToUse = config ? {...this.config, ...config} : this.config;

		if (!configToUse.projectAccessKey) {
			throw new Error(`projectAccessKey missing`);
		}

		this.sequenceProvider = this.sequence.initWallet(configToUse.projectAccessKey, configToUse.config);

		// TODO remove
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).sequenceProvider = this.sequenceProvider;

		const connectDetails = await this.sequenceProvider.connect(configToUse.info);

		if (connectDetails.connected) {
			const account = this.sequenceProvider.getAddress();
			const chainIdAsNumber = this.sequenceProvider.getChainId();
			const chainId = chainIdAsNumber.toString();

			return {
				eip1193Provider: new WrapperProvider(
					this.sequenceProvider as unknown as EIP1193Provider,
					account as `0x${string}`,
				) as unknown as EIP1193Provider, // TODO do not expect module to provide full eip-1193 providers
				chainId,
			};
		} else {
			throw new Error(`could not connect`);
		}
	}

	logout(): Promise<void> {
		this.sequenceProvider?.disconnect();
		return Promise.resolve();
	}

	disconnect(): void {
		this.sequenceProvider?.disconnect();
		this.sequenceProvider = undefined;

		// TODO remove
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).sequenceProvider = undefined;
	}

	async isLoggedIn(): Promise<boolean> {
		return true;
	}
}

let GlobalSequence: Sequence;

export class SequenceModuleLoader implements Web3WModuleLoader {
	public readonly id: string = '0xsequence';

	private static _jsURLs: {url: string; integrity?: string}[] = [
		{url: 'https://cdn.ethers.io/lib/ethers-5.7.umd.min.js"'},
		{url: 'https://unpkg.com/0xsequence@1.8.8/dist/0xsequence.umd.min.js'},
	];
	private static _jsURLUsed = false;

	private moduleConfig: SequenceOptions;

	static setJsURLs(urls: {url: string; integrity?: string}[]): void {
		if (SequenceModuleLoader._jsURLUsed) {
			throw new Error(`cannot change js url once used`);
		}
		SequenceModuleLoader._jsURLs = urls;
	}

	constructor(config: SequenceOptions) {
		this.moduleConfig = config;
	}

	async load(): Promise<Web3WModule> {
		if (!GlobalSequence) {
			const urls = SequenceModuleLoader._jsURLs;
			SequenceModuleLoader._jsURLUsed = true;
			try {
				for (const url of urls) {
					console.log(`loading ${url.url}...`);
					await loadJS(url.url, url.integrity, 'anonymous');
				}
			} catch (e) {
				console.error(`error loading`, e);
				SequenceModuleLoader._jsURLUsed = false;
				throw e;
			}
			GlobalSequence = (window as any).sequence as Sequence;
		}
		return new SequenceModule(GlobalSequence, this.moduleConfig);
	}
}
