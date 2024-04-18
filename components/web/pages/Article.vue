<template>{{ article }}</template>
<script setup lang="ts">
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();
	const { data: article } = await useApiCall<{ data: string }>(
		"/api/content/article",
		{
			query: {
				...currentPage.$state.route.query,
				url: currentPage.$state.route.pathname,
			},
		}
	);
</script>
