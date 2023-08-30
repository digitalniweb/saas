<template>
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		{{ en.name }}
		{{ en.title }}
		<ContentUser />
		<WebBlocksFooter />
		<CustomSnackBars />
	</v-app>
</template>
<script setup>
	import { useWebInformationStore } from "@/store/webInformation";
	import { storeToRefs } from "pinia";
	const { all, en } = storeToRefs(useWebInformationStore());
	useServerSeoMeta({
		title: "My Amazing Site",
		ogTitle: "My Amazing Site",
		description: "This is my amazing site, let me tell you all about it.",
		ogDescription: "This is my amazing site, let me tell you all about it.",
		ogImage: "https://example.com/image.png",
		twitterCard: "summary_large_image",
	});
</script>
