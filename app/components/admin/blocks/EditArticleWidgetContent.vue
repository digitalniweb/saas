<template>
	<v-dialog
		:model-value="open"
		fullscreen
		persistant
		@after-leave="afterLeave"
	>
		<v-card>
			<v-toolbar density="compact" flat>
				<v-toolbar-title class="white--text">
					{{ translate("Edit Widget") }}
				</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-form ref="form">
					<component
						v-if="props.widget && articleWidgetCopy"
						:is="createWidgetPickerComponentString(props.widget)"
						v-model="articleWidget"
						:module-id="currentModule?.id ?? 0"
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
	import type { ArticleWidget } from "~~/digitalniweb-types/models/content";

	import { VForm } from "vuetify/components";
	const form = ref<VForm | null>(null);

	import { useModulesStore } from "~/store/modules";
	import type { modules } from "~~/digitalniweb-types/functionality/modules";
	const modules = useModulesStore();
	const moduleName = "articles" as modules;
	const currentModule = modules.globalData.find((e) => e.name === moduleName);

	const emit = defineEmits<{
		returnWidgetContent: [value: InferAttributes<ArticleWidget> | null];
	}>();

	const { translate } = useTranslations();

	const open = defineModel<boolean>({ default: false });

	import { useWidgetsStore } from "~/store/widgets";
	const widgets = useWidgetsStore();

	const createWidgetPickerComponentString = (
		widget: InferAttributes<Widget>
	) => {
		let widgetGlobalData = widgets.getWidgetById(widget.id);
		if (widgetGlobalData)
			return `Admin${widgets.getWidgetById(widgetGlobalData.id)?.component}`;
		return "";
	};

	const props = defineProps<{
		widget: InferAttributes<Widget> | null;
		articleWidget: InferAttributes<ArticleWidget> | null;
	}>();

	const articleWidget = ref<Widget | null>(null);

	export type newWidgetContent = Pick<
		modulesWidgetsContent,
		"active" | "order" | "widgetId" | "widgetRowId" | "ArticleId" | "id"
	>;
	const emptyWidgetContent: newWidgetContent = {
		active: true,
		order: 0,
		widgetId: 0,
		widgetRowId: 0,
		ArticleId: 0,
		id: 0,
	};

	const articleWidgetCopy = ref<
		newWidgetContent | modulesWidgetsContent | null
	>(null);
	watch(
		() => open.value,
		() => {
			if (open.value) {
				if (props.articleWidget) {
					articleWidgetCopy.value = structuredClone(
						toRaw(props.articleWidget)
					);
				} else {
					articleWidgetCopy.value =
						structuredClone(emptyWidgetContent);
				}
				let model = props.widget
					? widgets.getWidgetById(props.widget.id)?.model
					: null;
				articleWidget.value =
					model && articleWidgetCopy.value
						? // @ts-ignore
							(articleWidgetCopy?.value?.[
								model as widgetModels[number]
							] as Widget)
						: null;
			} else {
				articleWidgetCopy.value = null;
			}
		}
	);

	import type { Widget } from "~~/digitalniweb-types/models/globalData";

	const cancel = () => {
		emit("returnWidgetContent", null);
		open.value = false;
	};

	import { useSnackBarsStore } from "~/store/snackBars";
	import type {
		modulesWidgetsContent,
		widgetModels,
	} from "~~/digitalniweb-types/functionality/widgets";
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
		let widget = widgets.getWidgetById(props.widget?.id ?? 0);

		if (articleWidgetCopy.value) {
			if (widget) {
				// @ts-ignore
				articleWidgetCopy.value[widget.model] = structuredClone(
					toRaw(articleWidget.value)
				);
			}
			emit(
				"returnWidgetContent",
				structuredClone(toRaw(articleWidgetCopy.value))
			);
		}
		articleWidget.value = null;
		open.value = false;
	};

	const afterLeave = () => {
		emit("returnWidgetContent", null);
		open.value = false;
	};
</script>
