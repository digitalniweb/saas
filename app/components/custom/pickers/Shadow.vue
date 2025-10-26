<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Shadow") }}</div>
			<span class="cssProperty">box-shadow</span>
		</template>
		<template #values>
			<CustomPickersSize
				:values="['none', 'small', 'large']"
				v-model="shadow"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { sizeOptions } from "../../../../digitalniweb-types/css";
	const { translate } = useTranslations();
	const shadow = defineModel<sizeOptions>();
</script>
