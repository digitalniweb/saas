<template>
	<div v-if="widgetContent">
		<v-text-field
			variant="underlined"
			:label="translate('Name2')"
			counter="64"
			prepend-inner-icon="mdi-alpha-n"
			v-model="widgetContent.name"
			validate-on="blur"
			:rules="[
				() => !!widgetContent.name || translate('Fill in this field'),
			]"
		/>
		<CustomTextEditor v-model="widgetContent.content" />
	</div>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();
	import type { CreationAttributes, InferAttributes } from "sequelize";
	import type { WidgetText } from "../../../digitalniweb-types/models/content";

	const props = defineProps<{
		moduleId: number;
	}>();

	const widgetContent = defineModel<
		InferAttributes<WidgetText> | CreationAttributes<WidgetText>
	>({ default: {} });
	if (!widgetContent?.value?.moduleId) {
		widgetContent.value = {
			name: "",
			content: "",
			moduleId: props.moduleId,
		};
	}
</script>
