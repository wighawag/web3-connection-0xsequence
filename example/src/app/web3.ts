import { init } from 'web3-connection';
import { SequenceModuleLoader } from 'web3-connection-0xsequence';

// TODO get chainIds from contracts data
const chainIds = ['5'];

const stores = init({
	autoConnectUsingPrevious: true,
	options: [
		'builtin',
		new SequenceModuleLoader({
			projectAccessKey: '355ea1b63e40657f5b5ce459292375bd',
			info: {
				app: 'Etherplay Account'
			}
		})
	]
});

export const { connection, network, account, pendingActions, execution } = stores;

// connection.subscribe((v) => {
// 	if (v.requireSelection) {
// 		console.log('TRIGGER');
// 		modalStore.trigger({
// 			type: 'alert',
// 			title: 'Example Alert',
// 			body: 'This is an example modal.',
// 			image: 'https://i.imgur.com/WOgTG96.gif',
// 			// Optionally override buttont text
// 			buttonTextCancel: 'Cancel',
// 		});
// 	} else {
// 		console.log('CLOSE');
// 		modalStore.close();
// 	}
// });

if (typeof window !== 'undefined') {
	(window as any).connection = connection;
	(window as any).network = network;
	(window as any).account = account;
	(window as any).pendingActions = pendingActions;
}
