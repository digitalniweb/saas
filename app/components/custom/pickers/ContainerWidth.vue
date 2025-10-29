<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Container width") }}</div>
		</template>
		<template #values>
			<CustomPickersWidth
				:values="['container', 'container-fluid']"
				v-model="width"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import type { widthOptions } from "~~/digitalniweb-types/css";
	const { translate } = useTranslations();

	const width = defineModel<widthOptions>();
</script>
