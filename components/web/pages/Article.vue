<template>
	<CustomWidgetContents :articleWidgets="article?.ArticleWidgets" />
</template>
<script setup lang="ts">
	import type { Article } from "../../../digitalniweb-types/models/content";
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();
	const { fetchRef } = useApiCall();

	const { data: article } = await (currentPage.module?.current?.name ===
	"articles"
		? fetchRef<Article | null>("/api/content/article", {
				query: {
					...currentPage.route.query,
					url: currentPage.route.pathname,
				},
				key: "articleId-" + currentPage.route.id,
			})
		: { data: null });

	currentPage.page.title =
		article?.value?.title || article?.value?.name || "";
	currentPage.page.description = article?.value?.description || "";

	if (!article?.value && currentPage.module?.current?.name === "articles") {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
