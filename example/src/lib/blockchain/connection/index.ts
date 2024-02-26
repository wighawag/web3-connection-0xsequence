import { init } from 'web3-connection';
import { SequenceModuleLoader } from 'web3-connection-0xsequence';

SequenceModuleLoader.setJsURLs([
	{ url: '/ethers-5.7.umd.min.js' },
	{ url: '/0xsequence-1.8.8.umd.min.js' }
]);
const stores = init({
	options: [
		new SequenceModuleLoader({
			projectAccessKey: 'AQAAAAAAABa78od0jv2IStleIsX2qfFqafY',
			info: {
				app: '"gell'
			}
		})
	]
});

export const { connection, network, account, pendingActions, execution, execute, devProvider } =
	stores;
