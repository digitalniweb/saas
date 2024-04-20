<template>{{ article }}</template>
<script setup lang="ts">
	import { Article } from "../../../digitalniweb-types/models/content";
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();

	const { data: article } = await useApiCall<Article | null>(
		"/api/content/article",
		{
			query: {
				...currentPage.$state.route.query,
				url: currentPage.$state.route.pathname,
			},
		}
	);

	if (!article.value) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
