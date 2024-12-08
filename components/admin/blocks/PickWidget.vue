<template>
	<v-dialog
		:model-value="open"
		fullscreen
		persistant
		@after-leave="afterLeave"
	>
		<v-card>
			<v-toolbar dark :color="confirmStore.options.color" dense flat>
				<v-toolbar-title class="white--text">
					{{ translate("Choose Widget") }}
				</v-toolbar-title>
			</v-toolbar>
			<v-card-text
				v-if="confirmStore.message"
				class="pa-4 text-center"
				v-html="confirmStore.message"
			/>
			<v-card-text>
				<v-list>
					<v-list-item
						v-for="widget in moduleWidgets"
						:key="widget.id"
						@click="chooseWidget(widget)"
						class="mb-2 border"
						elevation="5"
						lines="two"
					>
						<template v-slot:prepend>
							<v-icon :icon="widget.icon"></v-icon>
						</template>
						<v-list-item-title class="text-overline text-h5">
							{{ widget.widgetName }}
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="cancel">
					{{ translate("okCancelCancel") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup lang="ts">
	import { useWidgetsStore } from "~/store/widgets";
	import { Widget } from "../../../digitalniweb-types/models/globalData";
	import { InferAttributes } from "sequelize";

	const { translate } = useTranslations();

	const open = defineModel<boolean>({ default: false });

	/* const props = withDefaults(
		defineProps<{
			open: boolean;
		}>(),
		{
			open: false,
		}
	); */

	const widgets = useWidgetsStore();
	const moduleWidgets = ref(await widgets.loadModuleWidgets("articles"));

	const emit = defineEmits<{
		widgetSelected: [value: InferAttributes<Widget>];
	}>();

	import { useConfirmStore } from "~/store/confirm";
	const confirmStore = useConfirmStore();

	const chooseWidget = (widget: InferAttributes<Widget>) => {
		open.value = false;
		emit("widgetSelected", widget);
	};

	const cancel = () => {
		open.value = false;
	};

	const afterLeave = () => {
		open.value = false;
	};
</script>
