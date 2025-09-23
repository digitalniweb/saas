<template>
	<v-btn
		@click="toggleTheme"
		icon="mdi-theme-light-dark"
		class="cursor-pointer mx-1"
		size="small"
		flat
	></v-btn>
</template>
<script lang="ts" setup>
	import { useTheme } from "vuetify";
	const theme = useTheme();
	function toggleTheme() {
		theme.global.name.value = theme.global.current.value.dark
			? "light"
			: "dark";
	}
</script>
