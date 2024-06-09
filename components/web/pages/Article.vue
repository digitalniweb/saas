<template>
	<CustomWidgetContents :widgetContents="article?.widgetContents" />
</template>
<script setup lang="ts">
	import { moduleResponse } from "../../../digitalniweb-types/apps/communication/modules";
	import { Article } from "../../../digitalniweb-types/models/content";
	import { useCurrentPageStore } from "../../../store/currentPage";

	const currentPage = useCurrentPageStore();

	// ! this gets called one extra time when dynamic component in [...slug].vue changes from/to "Articles module" to/from other module. That's why we can skip this one "apiCall" if module name (currentComponent) differs
	const { data: article } = await (currentPage.module.currentComponent ===
	"WebPagesArticle"
		? useApiCall<moduleResponse<Article> | null>("/api/content/article", {
				query: {
					...currentPage.route.query,
					url: currentPage.route.pathname,
				},
		  })
		: { data: null });

	currentPage.page.title =
		article?.value?.moduleInfo?.title ||
		article?.value?.moduleInfo?.name ||
		"";
	currentPage.page.description =
		article?.value?.moduleInfo?.description || "";

	if (
		!article?.value &&
		currentPage.module.currentComponent === "WebPagesArticle"
	) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not found.",
			fatal: true,
		});
	}
</script>
