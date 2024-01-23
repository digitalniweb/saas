<template>
	<AdminMenuList :levelitems="menu" />
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";
	const { admin: menu } = storeToRefs(useMenusStore());
</script>
