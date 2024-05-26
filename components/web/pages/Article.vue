<template>
	{{ article?.moduleInfo }}
	<CustomWidgetContents :widgetContents="article?.widgetContents" />
</template>
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

	currentPage.$state.title =
		article?.value?.moduleInfo?.title ||
		article?.value?.moduleInfo.name ||
		"";

	if (!article.value) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
