<template>
	<CustomPickersCardShow :title="translate('Borders')" :opened="false">
		<CustomPickersBorder v-if="border" v-model="border" />
		<CustomPickersBorderRadius v-if="borderRadius" v-model="borderRadius" />

		<CustomPickersShadow v-if="shadow" v-model="shadow" />
	</CustomPickersCardShow>
</template>

<script setup lang="ts">
	import type { containerOptions } from "../../../../digitalniweb-types/css";

	const { translate } = useTranslations();

	const border = defineModel<containerOptions["border"]>("border");
	const borderRadius =
		defineModel<containerOptions["borderRadius"]>("borderRadius");
	const shadow = defineModel<containerOptions["elevation"]>("shadow");
</script>
