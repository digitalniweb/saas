<template>
	<v-list-item
		v-for="[icon, text, href] in links"
		:key="icon"
		:to="href"
		:prepend-icon="icon"
	>
		<v-list-item-title>{{ text }}</v-list-item-title>
	</v-list-item>
</template>

<script setup>
	const links = ref([
		["mdi-shield-home-outline", "Hlavní strana Admin", "/admin"],
		["mdi-cogs", "Informace o webu", "/admin/webinformation"],
		["mdi-text-box-edit-outline", "Test editoru", "/admin/testeditor"],
	]);
	const props = defineProps({
		levelitems: Array,
	});
</script>
