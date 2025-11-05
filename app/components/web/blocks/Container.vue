<template>
	<v-container
		:class="customClass"
		:fluid="options?.width ? options?.width === 'container-fluid' : true"
		:style="customStyle"
	>
		<div class="sectionOverlay"></div>
		<v-row>
			<slot></slot>
		</v-row>
	</v-container>
</template>
<script setup lang="ts">
	import type { containerOptions } from "../../../../digitalniweb-types/css";

	const options = defineModel<containerOptions>();

	type classableProperties = Extract<
		keyof containerOptions,
		| "elevation"
		| "border"
		| "borderRadius"
		| "margin"
		| "padding"
		| "textAlign"
		| "height100"
	>;
	type classMap = {
		[K in classableProperties]?: Record<
			Extract<NonNullable<containerOptions[K]>, string>,
			string | null
		>;
	};
	let classMap = {
		margin: {
			none: null,
			small: "my-5",
			large: "my-10",
		},
		padding: {
			none: null,
			small: "pa-5",
			large: "pa-10",
		},
		border: {
			none: null,
			small: "border-sm",
			large: "border-lg",
		},
		borderRadius: {
			none: null,
			small: "rounded-lg",
			large: "rounded-xl",
		},
		elevation: {
			none: null,
			small: "elevation-8",
			large: "elevation-20",
		},
		textAlign: {
			center: "",
			justify: "",
			left: "",
			right: "",
		},
		height100: {
			false: null,
			true: "height-100",
		},
	} as classMap;

	let customClass = computed(() => {
		let finalClassArray = [];
		if (options.value?.class) finalClassArray.push(options.value?.class);

		(
			[
				"padding",
				"border",
				"borderRadius",
				"margin",
				"elevation",
				"textAlign",
				"height100",
			] as const
		).forEach((prop) => {
			const value = options.value?.[prop];
			const map = classMap[prop];
			// @ts-ignore
			if (value && map?.[value]) finalClassArray.push(map[value]);
		});

		return finalClassArray.join(" ");
	});

	let customStyle = computed(() => {
		let style = "";
		if (options.value?.background?.color)
			style += `background-color: ${options.value?.background?.color};`;
		if (options.value?.background?.image)
			style += `background-image: url(${options.value?.background?.image});`;

		return style;
	});
</script>
