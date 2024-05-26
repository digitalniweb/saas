<template>
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		<WebBlocksFooter />
		<CustomSnackBars />
	</v-app>
</template>
<script setup>
	import { useWebInformationStore } from "@/store/webInformation";
	import { storeToRefs } from "pinia";
	const { all, en } = storeToRefs(useWebInformationStore());
</script>
