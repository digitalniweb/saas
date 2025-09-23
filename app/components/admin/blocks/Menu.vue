<template>
	<AdminMenuList :levelitems="menu" :languageId="currentPage.language.id" />
</template>
<script setup>
	import { useMenusStore } from "@/store/menus";
	import { storeToRefs } from "pinia";

	import { useCurrentPageStore } from "../../../store/currentPage";
	const currentPage = useCurrentPageStore();

	const { admin: menu } = storeToRefs(useMenusStore());
</script>
