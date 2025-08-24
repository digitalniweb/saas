<template>
	<div v-html="widget?.content"></div>
</template>

<script setup lang="ts">
	import type { WidgetText } from "../../../digitalniweb-types/models/content";

	const props = defineProps<{
		widget: WidgetText | undefined;
	}>();
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
