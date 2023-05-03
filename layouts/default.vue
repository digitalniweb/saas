<template>
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		{{ en.name }}
		{{ en.title }}
		<WebBlocksFooter />
	</v-app>
</template>
<script setup>
	import { useWebInformation } from "@/store/webInformation";
	import { storeToRefs } from "pinia";
	const { all, en } = storeToRefs(useWebInformation());
</script>
