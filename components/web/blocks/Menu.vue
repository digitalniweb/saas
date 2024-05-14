<template>
	<v-app-bar ref="appBar">
		<WebMenuList :levelitems="menu" :ulid="'navitems'" />
	</v-app-bar>
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { articles: menu } = storeToRefs(useMenusStore());
	const appBar = ref();
</script>
