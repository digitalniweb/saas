<template>
	<v-container
		:class="containerClass"
		:fluid="options?.width ? options?.width === 'container-fluid' : true"
		:style="containerStyle"
	>
		<div
			class="overlay background-position-center background-size-cover"
			:style="overlayStyle"
		>
			<div :class="overlayClass"></div>
		</div>
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

	let containerClass = computed(() => {
		let finalClassArray: string[] = [];
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

	let containerStyle = computed(() => {
		let style = "";
		if (options.value?.background?.color)
			style += `background-color: ${options.value?.background?.color};`;

		return style;
	});

	let overlayStyle = computed(() => {
		let style = "";
		if (options.value?.background?.image)
			style += `background-image: url(${options.value?.background?.image});`;

		return style;
	});

	let overlayClass = computed(() => {
		let finalClassArray: string[] = [];
		if (options.value?.background?.overlay?.includes("darken"))
			finalClassArray.push("overlay-dark");
		else if (options.value?.background?.overlay?.includes("lighten"))
			finalClassArray.push("overlay-light");

		if (options.value?.background?.overlay?.includes("blur"))
			finalClassArray.push("overlay-blur");
		if (options.value?.background?.overlay?.includes("desaturate"))
			finalClassArray.push("overlay-desaturate");

		return finalClassArray.join(" ");
	});
</script>
