<template>
	<!-- create containerComponent with slot -->
	<webBlocksContainer v-model="options.container">
		<v-col>
			<component :is="headingType" v-if="options?.heading?.show">
				{{ props.widget?.name }}
			</component>
			<div v-html="props.widget?.content"></div>
		</v-col>
	</webBlocksContainer>
</template>

<script setup lang="ts">
	import type { InferAttributes } from "sequelize";
	import deepMergeObjects from "~~/digitalniweb-custom/helpers/deepMergeObjects";
	import type { WidgetText } from "~~/digitalniweb-types/models/content";
	import { widgetTextOptionsDefault } from "../../../../digitalniweb-custom/variables/widgets";
	import type { widgetTextOptions } from "../../../../digitalniweb-types/functionality/widgets";

	const props = defineProps<{
		widget: InferAttributes<WidgetText> | undefined;
	}>();
	let options = computed<widgetTextOptions>(() => {
		let options = props.widget?.options;
		if (
			typeof props.widget?.options &&
			typeof props.widget?.options === "string"
		)
			options = JSON.parse(props.widget?.options);
		if (!options) options = {} as widgetTextOptions;
		let finalOptions = deepMergeObjects(
			structuredClone(widgetTextOptionsDefault),
			options
		);
		return finalOptions;
	});
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
