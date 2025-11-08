<template>
	<CustomPickersCardShow :title="translate('Spacing')" :opened="false">
		<CustomPickersMargin v-if="margin" v-model="margin" />
		<CustomPickersPadding v-if="padding" v-model="padding" />
	</CustomPickersCardShow>
</template>

<script setup lang="ts">
	import type { containerOptions } from "../../../../digitalniweb-types/css";

	const { translate } = useTranslations();

	const margin = defineModel<containerOptions["margin"]>("margin");
	const padding = defineModel<containerOptions["padding"]>("padding");
</script>
