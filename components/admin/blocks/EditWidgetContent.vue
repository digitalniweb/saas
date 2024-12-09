<template>
	<v-dialog
		:model-value="open"
		fullscreen
		persistant
		@after-leave="afterLeave"
	>
		<v-card>
			<v-toolbar dark dense flat>
				<v-toolbar-title class="white--text">
					{{ translate("Edit Widget") }}
				</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pa-4 text-center"> </v-card-text>
			<v-card-text>
				<component
					v-if="props.widget && props.widgetContent"
					:is="createWidgetPickerComponentString(props.widget)"
					v-model="props.widgetContent"
				/>
			</v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="cancel">
					{{ translate("okCancelCancel") }}
				</v-btn>
				<v-btn variant="text" @click="agree">
					{{ translate("okCancelOk") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup lang="ts">
	import { useWidgetsStore } from "~/store/widgets";
	import { WidgetContent } from "../../../digitalniweb-types/models/content";
	import { InferAttributes } from "sequelize";

	const { translate } = useTranslations();

	const open = defineModel<boolean>({ default: false });

	const createWidgetPickerComponentString = (
		widget: InferAttributes<Widget>
	) => {
		return `Admin${widget.component}`;
	};

	const props = defineProps<{
		widget: InferAttributes<Widget> | null;
		widgetContent: InferAttributes<WidgetContent> | null;
	}>();

	const widgets = useWidgetsStore();

	const emit = defineEmits<{
		newWidgetContent: [value: InferAttributes<WidgetContent>];
		updateWidgetContent: [value: InferAttributes<WidgetContent>];
	}>();

	import { useConfirmStore } from "~/store/confirm";
	import { Widget } from "../../../digitalniweb-types/models/globalData";
	const confirmStore = useConfirmStore();

	const chooseWidgetContent = (widget: InferAttributes<WidgetContent>) => {
		open.value = false;
		emit("newWidgetContent", widget);
	};

	const cancel = () => {
		open.value = false;
	};

	const agree = () => {
		open.value = false;
	};

	const afterLeave = () => {
		open.value = false;
	};
</script>
