<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Margin") }}</div>
			<span class="cssProperty">margin</span>
		</template>
		<template #values>
			<CustomPickersSize
				:values="['none', 'small', 'large']"
				v-model="margin"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { sizeOptions } from "../../../../digitalniweb-types/css";
	const { translate } = useTranslations();
	const margin = defineModel<sizeOptions>();
</script>
