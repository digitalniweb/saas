<template>
	<v-app-bar>
		<MenuTop :items="menu" />
	</v-app-bar>
</template>
<script setup>
	// load menu from /api/menu

	const { data: menu } = useFetch("/api/menu");
</script>
