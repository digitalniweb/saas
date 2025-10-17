<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Custom CSS class") }}</div>
		</template>
		<template #values>
			<v-text-field
				v-model="customClass"
				variant="underlined"
				clearable
				label="class"
			></v-text-field>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();

	const customClass = defineModel<string>();
</script>
