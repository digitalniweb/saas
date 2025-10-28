<template>
	<v-container
		:class="customClass"
		:fluid="options?.width ? options?.width === 'container-fluid' : true"
	>
		<v-row>
			<slot></slot>
		</v-row>
	</v-container>
</template>
<script setup lang="ts">
	import type { containerOptions } from "../../../../digitalniweb-types/css";

	const options = defineModel<containerOptions>();

	let customClass = computed(() => {
		let finalClass = "";
		finalClass += options.value?.class ?? "";
		if (options.value?.margin !== "none") {
		}
		if (options.value?.padding !== "none") {
		}
		return finalClass;
	});
</script>
