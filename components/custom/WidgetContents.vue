<template>
	<v-container class="fill-height">
		<v-row>
			<v-col>
				<template v-for="widget in widgetContents">
					<component
						:is="widgetMap(widget.widgetId)"
						:content="widget.content"
					/>
				</template>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
	import { useWidgetsStore } from "@/store/widgets";
	import { InferAttributes } from "sequelize";
	import { WidgetContent } from "~/digitalniweb-types/models/content";
	const props = defineProps({
		widgetContents: Array as PropType<InferAttributes<WidgetContent>[]>,
	});

	const widgetsStore = useWidgetsStore();
	function widgetMap(id: number) {
		return widgetsStore.globalData?.find((item) => item.id == id)
			?.component;
	}
</script>
