<template>
	<v-app-bar>
		<WebMenuList :levelitems="menu" :ulid="'navitems'" />
	</v-app-bar>
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { articles: menu } = storeToRefs(useMenusStore());
</script>
