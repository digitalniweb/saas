<template>
	<p>You have been logged out</p>
	<p>Todo: Translation + functionality + if not logged</p>
</template>
<script setup lang="ts">
	import { useUserStore } from "@/store/user";
	const userStore = useUserStore();
	if (import.meta.client) userStore.logout();
</script>
