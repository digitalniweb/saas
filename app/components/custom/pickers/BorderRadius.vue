<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Border radius") }}</div>
			<span class="cssProperty">border-radius</span>
		</template>
		<template #values>
			<CustomPickersSize
				:values="['none', 'small', 'large']"
				:btn-values="{
					small: {
						icon: 'mdi-square-rounded-outline',
					},
					large: {
						icon: 'mdi-circle-outline',
					},
				}"
				v-model="borderRadius"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { sizeOptions } from "../../../../digitalniweb-types/css";
	const { translate } = useTranslations();
	const borderRadius = defineModel<sizeOptions>();
</script>
