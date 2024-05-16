<template>{{ article }}</template>
<script setup lang="ts">
	import { moduleResponse } from "../../../digitalniweb-types/apps/communication/modules";
	import { Article } from "../../../digitalniweb-types/models/content";
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();

	const { data: article } = await useApiCall<moduleResponse<Article> | null>(
		"/api/content/article",
		{
			query: {
				...currentPage.$state.route.query,
				url: currentPage.$state.route.pathname,
			},
		}
	);

	useServerSeoMeta({
		title: article?.value?.moduleInfo.title,
	});

	if (!article.value) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
