<template>
	<customPickersPickerContainer>
		<template #name>
			<div>{{ translate("Background color") }}</div>
			<span class="cssProperty">background-color</span>
		</template>
		<template #values>
			<v-color-input
				clearable
				color-pip
				v-model="backgroundColor"
			></v-color-input>
		</template>
	</customPickersPickerContainer>
</template>

<script setup lang="ts">
	import { VColorInput } from "vuetify/labs/VColorInput";
	const { translate } = useTranslations();

	const backgroundColor = defineModel<string>({ default: "" });
</script>
