<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Height 100 %") }}</div>
		</template>
		<template #values>
			<v-switch
				density="compact"
				hide-details
				v-model="height100"
				width="50px"
				color="success"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();

	const height100 = defineModel<boolean>();
</script>
