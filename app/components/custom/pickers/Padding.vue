<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Padding") }}</div>
			<span class="cssProperty">padding</span>
		</template>
		<template #values>
			<CustomPickersSize
				:values="['none', 'small', 'large']"
				v-model="padding"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { sizeOptions } from "../../../../digitalniweb-types/css";
	const { translate } = useTranslations();
	const padding = defineModel<sizeOptions>();
</script>
