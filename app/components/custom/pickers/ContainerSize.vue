<template>
	<CustomPickersCardShow :title="translate('Size')" :opened="false">
		<CustomPickersContainerWidth v-if="width" v-model="width" />
		<CustomPickersHeight100
			v-if="height100 !== undefined"
			v-model="height100"
		/>
	</CustomPickersCardShow>
</template>

<script setup lang="ts">
	import type { containerOptions } from "../../../../digitalniweb-types/css";

	const { translate } = useTranslations();

	const width = defineModel<containerOptions["width"]>("width");
	const height100 = defineModel<containerOptions["height100"]>("height100");
</script>
