import {EIP1193GenericRequest, EIP1193GenericRequestProvider} from 'eip-1193';
import {BaseProvider} from './BaseProvider';

export class WrapperProvider extends BaseProvider {
	constructor(
		provider: EIP1193GenericRequestProvider,
		protected account: `0x${string}`,
	) {
		super(provider);
	}

	protected async _request<T = unknown, V extends EIP1193GenericRequest = EIP1193GenericRequest>(args: V): Promise<T> {
		if (args.method === 'eth_requestAccounts') {
			return [this.account] as T;
		}
		// else if (args.method === 'eth_subscribe') {

		// }
		let response: T;
		try {
			response = await this.provider.request<T>(args);
		} catch (err) {
			console.error(`failed executing "${args.method}"`);
			throw err;
		}

		return response;
	}
}
