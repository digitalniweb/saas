<template>
	<ClientOnly>
		<Editor :init="editorConfig" />
	</ClientOnly>
</template>
<script setup>
	import { useEditor } from "~/composables/useEditor";
	const { Editor, editorConfig } = useEditor();
</script>
