<template>
	<template v-for="widget in widgetContents">
		<component :is="widgetMap(widget.widgetId)" :content="widget.content" />
	</template>
</template>

<script setup lang="ts">
	import { useWidgetsStore } from "@/store/widgets";
	import { WidgetContent } from "~/digitalniweb-types/models/content";
	const props = defineProps({
		widgetContents: Array as PropType<WidgetContent[]>,
	});

	const widgetsStore = useWidgetsStore();
	function widgetMap(id: number): string | undefined {
		return widgetsStore.globalData?.find((item) => item.id == id)
			?.component;
	}
</script>
