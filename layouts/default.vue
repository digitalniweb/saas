<template>
	<NuxtLoadingIndicator />
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		<WebBlocksFooter />
		<CustomConfirm />
		<CustomSnackBars />
		<CustomFileManager />
	</v-app>
</template>
<script setup>
	// import { useWebInformationStore } from "@/store/webInformation";
	// import { storeToRefs } from "pinia";
	// const { all, en } = storeToRefs(useWebInformationStore());
</script>
