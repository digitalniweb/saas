<template>
	<v-text-field
		variant="underlined"
		:label="translate('Name2')"
		counter="64"
		prepend-inner-icon="mdi-alpha-n"
		v-model="widgetContent.name"
		validate-on="blur"
		:rules="[() => !!widgetContent.name || translate('Fill in this field')]"
	/>
	<CustomTextEditor v-model="widgetContent.content"> </CustomTextEditor>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();
	import type { WidgetText } from "../../../digitalniweb-types/models/content";

	const widgetContent = defineModel<WidgetText>({ default: {} });
</script>
