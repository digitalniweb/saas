<template>
	<v-app>
		<WebBlocksMenu />
		<p>{{ $route.params }}</p>
		<slot />
	</v-app>
</template>
<script setup></script>
