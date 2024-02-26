<script lang="ts">
	import { JsonView } from '@zerodevx/svelte-json-view';
	import { account, connection } from '../app/web3';
	import { execute } from '$lib/blockchain/connection';
</script>

<p>
	<button
		on:click={() =>
			execute(async ({ account: $account, connection: $connection }) => {
				$connection.provider?.request({
					method: 'personal_sign',
					params: ['0xdeadbeef', $account.address || '']
				});
			})}
		class="m-1 btn btn-primary btn-sm rounded-box">sign</button
	>

	<button
		on:click={() =>
			execute(async ({ account: $account, connection: $connection }) => {
				$connection.provider?.request({
					method: 'eth_sendTransaction',
					params: [{ from: $account.address, to: $account.address, value: '0x01' }]
				});
			})}
		class="m-1 btn btn-primary btn-sm rounded-box">tx</button
	>
</p>

<JsonView json={$connection.toJSON && $connection.toJSON()} />
