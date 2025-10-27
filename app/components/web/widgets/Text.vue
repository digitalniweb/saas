<template>
	<!-- create containerComponent with slot -->
	<webBlocksContainer v-model="options.container">
		<v-col>
			<component
				:is="headingType"
				v-if="!props.widget?.options?.showHeading"
			>
				{{ props.widget?.name }}
			</component>
			<div v-html="props.widget?.content"></div>
		</v-col>
	</webBlocksContainer>
</template>

<script setup lang="ts">
	import type { WidgetText } from "~~/digitalniweb-types/models/content";

	const props = defineProps<{
		widget: WidgetText | undefined;
	}>();
	let options = computed(() =>
		typeof props.widget?.options === "string"
			? JSON.parse(props.widget?.options)
			: props.widget?.options
	);
	let headingType = "h1";
	// html data from default slot => data between component tags
	// let slotContent = ref();
	// const slots = useSlots();
	// const defaultSlot = slots.default;
	// if (defaultSlot) {
	// 	const vnodeArray = defaultSlot();
	// 	if (vnodeArray.length > 0 && vnodeArray[0].children) {
	// 		slotContent.value = vnodeArray[0].children;
	// 	}
	// }
</script>
