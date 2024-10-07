<template>
	<ClientOnly>
		<VuetifyTiptap
			ref="VuetifyTiptapRef"
			v-model="content"
			title="Text editor"
			:output="output"
			:hide-toolbar="hideToolbar"
			:disable-toolbar="disableToolbar"
			:outlined="outlined"
			:dense="dense"
			:error-messages="errorMessages"
			rounded
			:max-height="500"
			@vue:mounted="mountedTipTap"
		/>
	</ClientOnly>
</template>
<script setup lang="ts">
	import { locale } from "vuetify-pro-tiptap";

	const VuetifyTiptapRef = ref<null | Record<string, any>>(null);
	const output = ref<"html" | "json" | "text">("html");
	const content = ref("<p>Test html</p>");
	const outlined = ref(true);
	const dense = ref(false);
	const hideToolbar = ref(false);
	const disableToolbar = ref(false);
	const errorMessages = ref(null);

	function mountedTipTap() {
		locale.setLang("en");
	}

	// function getHTML() {
	// 	const value = VuetifyTiptapRef.value?.editor.getHTML();
	// 	console.log("getHTML :>> ", value);
	// }

	// function getJSON() {
	// 	const value = VuetifyTiptapRef.value?.editor.getJSON();
	// 	console.log("getJSON :>> ", value, JSON.stringify(value));
	// }

	// function getText() {
	// 	const value = VuetifyTiptapRef.value?.editor.getText();
	// 	console.log("getText :>> ", value);
	// }
</script>
