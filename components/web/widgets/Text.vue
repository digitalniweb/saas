<template>
	<div v-html="content"></div>
</template>

<script setup lang="ts">
	const props = defineProps({
		content: String,
	});
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
