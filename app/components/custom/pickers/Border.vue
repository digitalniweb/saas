<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Border") }}</div>
			<span class="cssProperty">border</span>
		</template>
		<template #values>
			<CustomPickersSize
				:values="['none', 'small', 'large']"
				v-model="border"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { sizeOptions } from "../../../../digitalniweb-types/css";
	const { translate } = useTranslations();
	const border = defineModel<sizeOptions>();
</script>
