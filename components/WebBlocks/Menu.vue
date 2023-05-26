<template>
	<v-app-bar>
		<MenuTop :items="menu" />
	</v-app-bar>
</template>
<script setup>
	import { useMenus } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { articles: menu } = await storeToRefs(useMenus());
</script>
