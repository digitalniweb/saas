<template>
	<ActionButton tooltip="source code" :disabled="disabled">
		<VIcon>mdi-code-tags</VIcon>
		<v-dialog
			v-model="dialog"
			fullscreen
			hide-overlay
			activator="parent"
			@update:model-value="openDialog"
		>
			<VCard>
				<VToolbar dark color="primary">
					<VBtn dark @click="closeDialog" :icon="'mdi-close'" />
					HTML
				</VToolbar>

				<VContainer>
					<VSheet class="mx-auto">
						<codemirror
							v-model="cmContent"
							:style="{ height: '400px', width: '100%' }"
							:extensions="cmExtensions"
						/>
					</VSheet>
				</VContainer>
			</VCard>
		</v-dialog>
	</ActionButton>
</template>
<style>
	td,
	th {
		border: 1px solid rgb(var(--v-border-color));
		min-width: 15px;
	}
</style>
<script setup lang="ts">
	import { Codemirror } from "vue-codemirror";
	import type { Editor } from "@tiptap/vue-3";
	import { ActionButton } from "vuetify-pro-tiptap";

	import pkg from "js-beautify";
	const { html: beautifyHtml } = pkg;
	import { oneDark } from "@codemirror/theme-one-dark";

	// must be installed separately https://github.com/codemirror/lang-html
	import { html } from "@codemirror/lang-html";

	interface Props {
		editor: Editor;
		tooltip?: string;
		disabled?: boolean;
	}

	const props = withDefaults(defineProps<Props>(), {
		tooltip: undefined,
		disabled: false,
		editor: undefined,
	});

	const cmExtensions = [html(), oneDark];

	const cmContent = ref();

	const openDialog = () => {
		cmContent.value = beautifyHtml(props.editor.getHTML()) + "\n";
	};

	const closeDialog = () => {
		if (cmContent.value !== props.editor.getHTML())
			props.editor.commands.setContent(cmContent.value);
		dialog.value = false;
	};

	const dialog = ref(false);
</script>
