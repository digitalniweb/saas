<template>
	<v-app-bar>
		<MenuList :levelitems="menu" :ulid="'navitems'" />
	</v-app-bar>
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { articles: menu } = await storeToRefs(useMenusStore());
</script>
