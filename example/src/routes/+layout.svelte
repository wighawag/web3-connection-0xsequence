<script lang="ts">
	// import '../css/index.css';
	import Banners from '$utils/ui/banners/Banners.svelte';
	import Modals from '$utils/ui/modals/Modals.svelte';
	import Web3ConnectionUI from '$lib/blockchain/connection/Web3ConnectionUI.svelte';
</script>

<div
	style="position: absolute; z-index: 2; width: 100%; height: 100%; pointer-events: none;overflow: hidden;"
>
	<Modals />

	<Banners />

	<Web3ConnectionUI />
</div>

<slot />
