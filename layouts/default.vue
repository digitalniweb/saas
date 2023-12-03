<template>
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		{{ en.name }}
		{{ en.title }}
		<WebBlocksFooter />
		<CustomSnackBars />
	</v-app>
</template>
<script setup>
	import { useWebInformationStore } from "@/store/webInformation";
	import { storeToRefs } from "pinia";
	const { all, en } = storeToRefs(useWebInformationStore());
	useServerSeoMeta({
		title: "",
		ogTitle: "",
		description: "",
		ogDescription: "",
		ogImage: "",
		twitterCard: "",
	});
</script>
