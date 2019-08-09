<template>
	<div class="panel">
		<slot />
	</div>
</template>

<script>
export default { name: 'Panel' };
</script>

<style scoped>
	.panel {
		margin: 10px;
		display: flex;
		flex-direction: column;
	}
</style>
