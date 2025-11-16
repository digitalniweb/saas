<template>
	<!-- create containerComponent with slot -->
	<webBlocksContainer v-model="options.container">
		<v-col>
			<component
				:is="options?.heading?.type"
				v-if="options?.heading?.show"
				class="heading"
				:class="headingClass"
			>
				{{ props.widget?.name }}
			</component>
			<div class="content" v-html="props.widget?.content"></div>
		</v-col>
	</webBlocksContainer>
</template>

<script setup lang="ts">
	import type { InferAttributes } from "sequelize";
	import deepMergeObjects from "~~/digitalniweb-custom/helpers/deepMergeObjects";
	import type { WidgetText } from "~~/digitalniweb-types/models/content";
	import { widgetTextOptionsDefault } from "../../../../digitalniweb-custom/variables/widgets";
	import type { headingOptions } from "../../../../digitalniweb-types/css";
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

	type classableProperties = Extract<
		keyof headingOptions,
		"weight" | "class"
	>;

	type classMap = {
		[K in classableProperties]?: Record<
			Extract<NonNullable<headingOptions[K]>, string>,
			string | null
		>;
	};
	let classMap = {
		weight: {
			black: "font-weight-black",
			bold: "font-weight-bold",
			"semi-bold": "font-weight-semi-bold",
			light: "font-weight-light",
			medium: "font-weight-medium",
			regular: "font-weight-regular",
			thin: "font-weight-thin",
		},
		class: {
			"": null,
		},
	} as classMap;

	let headingClass = computed(() => {
		let finalClassArray = [];
		if (options.value?.heading)
			finalClassArray.push(options.value?.heading.class);

		(["weight"] as const).forEach((prop) => {
			const value = options.value?.heading[prop];
			const map = classMap[prop];
			// @ts-ignore
			if (value && map?.[value]) finalClassArray.push(map[value]);
		});

		if (options.value.heading.italic) finalClassArray.push("font-italic");

		return finalClassArray.join(" ");
	});
</script>
