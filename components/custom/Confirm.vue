<template>
	<v-dialog
		v-model="confirmStore.dialog"
		:max-width="confirmStore.options.width"
		@keydown.esc="confirmStore.cancel()"
		@afterLeave="afterCloseTransitionEnd"
		scrollable
	>
		<v-card>
			<v-toolbar dark :color="confirmStore.options.color" dense flat>
				<v-toolbar-title class="white--text">{{
					confirmStore.title
				}}</v-toolbar-title>
			</v-toolbar>
			<v-card-text
				v-if="confirmStore.message"
				class="pa-4 text-center"
				v-html="confirmStore.message"
			></v-card-text>
			<v-card-text
				:id="confirmStore.teleportId"
				v-if="confirmStore.teleportId"
			></v-card-text>
			<v-card-actions class="pt-0">
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="confirmStore.cancel()">
					{{ translate(confirmStore.options.type! + "Cancel") }}
				</v-btn>
				<v-btn
					depressed
					:color="confirmStore.options.color"
					@click="confirmStore.agree()"
					>{{ translate(confirmStore.options.type! + "Ok") }}</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script lang="ts" setup>
	import { useConfirmStore } from "@/store/confirm";
	const confirmStore = useConfirmStore();
	let translations = {
		okCancelCancel: {
			en: "Cancel",
			cs: "Zavřít",
		},
		okCancelOk: {
			en: "OK",
		},
		yesNoCancel: {
			en: "No",
			cs: "Ne",
		},
		yesNoOk: {
			en: "Yes",
			cs: "Ano",
		},
	};
	const { translate } = useTranslations(translations);

	const afterCloseTransitionEnd = () => {
		confirmStore.teleportId = "";
		confirmStore.cancel(); // return false if dialog is closed via "esc" or clicking outside
	};
</script>
