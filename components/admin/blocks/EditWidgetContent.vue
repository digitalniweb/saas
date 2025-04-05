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
			<v-card-text>
				<v-form ref="form">
					<component
						v-if="props.widget && widgetContentCopy"
						:is="createWidgetPickerComponentString(props.widget)"
						v-model="widgetContentCopy"
					/>
				</v-form>
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
	import type { InferAttributes } from "sequelize";
	import { WidgetContent } from "../../../digitalniweb-types/models/content";

	import { VForm } from "vuetify/components";
	const form = ref<VForm | null>(null);

	const emit = defineEmits<{
		returnWidgetContent: [
			value: WidgetContentNew | InferAttributes<WidgetContent> | null,
		];
	}>();

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

	const emptyWidgetContent: WidgetContentNew = {
		active: true,
		content: "",
		name: "",
		options: undefined,
	};

	const widgetContentCopy = ref<WidgetContentNew | null>(null);
	watch(
		() => open.value,
		() => {
			if (open.value) {
				if (props.widgetContent) {
					widgetContentCopy.value = structuredClone(
						toRaw(props.widgetContent)
					);
				} else {
					widgetContentCopy.value =
						structuredClone(emptyWidgetContent);
				}
			} else widgetContentCopy.value = null;
		}
	);

	import { Widget } from "../../../digitalniweb-types/models/globalData";
	import { WidgetContentNew } from "../../../digitalniweb-types";

	const cancel = () => {
		emit("returnWidgetContent", null);
		open.value = false;
	};

	import { useSnackBarsStore } from "~/store/snackBars";
	const snackBars = useSnackBarsStore();

	const agree = async () => {
		if (!form.value) return;
		let validate = await form.value?.validate();
		if (validate.errors.length > 0) {
			snackBars.setSnackBar({
				color: "warning",
				text: translate("FormValidationError"),
			});
			return;
		}
		if (widgetContentCopy.value)
			emit("returnWidgetContent", widgetContentCopy.value);
		open.value = false;
	};

	const afterLeave = () => {
		emit("returnWidgetContent", null);
		open.value = false;
	};
</script>
