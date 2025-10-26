<template>
	<v-card elevation="10" class="mt-7" color="border-md">
		<v-card-title class="text-overline">
			{{ translate("Background") }}
		</v-card-title>
		<v-card-text>
			<CustomPickersBackgroundOverlay
				v-if="
					props.values?.includes('overlay') &&
					background?.overlay !== undefined
				"
				v-model="background.overlay"
			/>
			<CustomPickersBackgroundColor
				v-if="
					props.values?.includes('color') &&
					background?.color !== undefined
				"
				v-model="background.color"
			/>
			<CustomPickersBackgroundImage
				v-if="
					props.values?.includes('image') &&
					background?.image !== undefined
				"
				v-model="background.image"
			/>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
	import type {
		background,
		backgroundProperties,
	} from "../../../../digitalniweb-types/css";

	const props = defineProps<{
		values: backgroundProperties[];
	}>();
	const { translate } = useTranslations();

	const background = defineModel<background>({
		default: {
			color: "",
			attachment: "initial",
			image: "",
			overlay: [],
			position: "initial",
			repeat: "no-repeat",
		},
	});
</script>
