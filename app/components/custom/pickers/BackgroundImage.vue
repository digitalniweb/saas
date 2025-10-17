<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Background image") }}</div>
			<span class="cssProperty">background-image</span>
		</template>
		<template #values>
			<customFormPickFiles
				v-model="backgroundImage"
				:name="translate('Background image')"
			/>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();

	const backgroundImage = defineModel<string>({ default: "" });
</script>
