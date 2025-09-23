<template>
	<v-container class="fill-height">
		<v-row>
			<v-col>
				<template v-for="widget in mappedWidgets">
					<component
						:is="widget?.component"
						:widget="widget.widgetData"
					/>
				</template>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
	import { useWidgetsStore } from "@/store/widgets";
	import type { InferAttributes } from "sequelize";
	import type { ArticleWidget } from "~~/digitalniweb-types/models/content";
	const props = defineProps({
		articleWidgets: Array as PropType<InferAttributes<ArticleWidget>[]>,
	});

	const widgetsStore = useWidgetsStore();
	function widgetMap(id: number) {
		return widgetsStore.globalData?.find((item) => item.id == id);
	}

	const mappedWidgets = computed(() =>
		props?.articleWidgets?.map((widget) => {
			const map = widgetMap(widget.widgetId);
			return {
				component: map?.component ?? null,
				widgetData: map?.model ? widget[map.model] : null,
			};
		})
	);
</script>
