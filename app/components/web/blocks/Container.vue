<template>
	<v-container
		:class="options?.class"
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
</script>
