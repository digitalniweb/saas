<template>
	<CustomWidgetContents :widgetContents="article?.widgetContents" />
</template>
<script setup lang="ts">
	import type { moduleResponse } from "../../../digitalniweb-types/apps/communication/modules";
	import type { Article } from "../../../digitalniweb-types/models/content";
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();
	const { fetchRef } = useApiCall();

	const { data: article } = await (currentPage.module?.current?.name ===
	"articles"
		? fetchRef<moduleResponse<Article> | null>("/api/content/article", {
				query: {
					...currentPage.route.query,
					url: currentPage.route.pathname,
				},
				key: "articleId-" + currentPage.route.id,
			})
		: { data: null });

	currentPage.page.title =
		article?.value?.moduleInfo?.title ||
		article?.value?.moduleInfo?.name ||
		"";
	currentPage.page.description =
		article?.value?.moduleInfo?.description || "";

	if (!article?.value && currentPage.module?.current?.name === "articles") {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
