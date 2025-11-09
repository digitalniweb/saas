<template>
	<ClientOnly>
		<VuetifyTiptap
			ref="VuetifyTiptapRef"
			v-model="content"
			:title="props.showTitle ? translate('Text editor') : null"
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
	const { translate } = useTranslations();
	import { locale } from "vuetify-pro-tiptap";
	import { useCurrentPageStore } from "../../store/currentPage";

	const currentPage = useCurrentPageStore();

	const VuetifyTiptapRef = ref<null | Record<string, any>>(null);
	const output = ref<"html" | "json" | "text">("html");
	const outlined = ref(true);
	const dense = ref(false);
	const hideToolbar = ref(false);
	const disableToolbar = ref(false);
	const errorMessages = ref(null);

	const content = defineModel<string>({ default: "" });

	const props = defineProps<{
		showTitle?: boolean;
	}>();

	function mountedTipTap() {
		locale.setLang(currentPage.language?.code ?? "en");
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
