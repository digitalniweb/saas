<template>
	<v-card class="mx-auto" :loading="fileManagerStore.loading">
		<Toolbar></Toolbar>
		<v-row no-gutters>
			<v-col v-if="fileManagerStore.tree" sm="auto">
				<!-- <Tree
					:icons="icons"					
					v-on:loading="loadingChanged"
				></Tree> -->
			</v-col>
			<v-divider v-if="fileManagerStore.tree" vertical></v-divider>
			<v-col>
				<List :icons="icons"></List>
			</v-col>
		</v-row>
		<Upload
			v-if="fileManagerStore.uploadingFiles.length > 0"
			:icons="icons"
			v-on:remove-file="removeUploadingFile"
			v-on:clear-files="fileManagerStore.uploadingFiles = []"
			v-on:cancel="fileManagerStore.uploadingFiles = []"
		></Upload>
	</v-card>
</template>
<script lang="ts">
	const fileIcons = {
		folder: "mdi-folder-outline",
		zip: "mdi-folder-zip-outline",
		rar: "mdi-folder-zip-outline",
		htm: "mdi-language-html5",
		html: "mdi-language-html5",
		js: "mdi-nodejs",
		json: "mdi-json",
		md: "mdi-markdown",
		pdf: "mdi-file-pdf",
		png: "mdi-file-image",
		jpg: "mdi-file-image",
		jpeg: "mdi-file-image",
		mp4: "mdi-filmstrip",
		mkv: "mdi-filmstrip",
		avi: "mdi-filmstrip",
		wmv: "mdi-filmstrip",
		mov: "mdi-filmstrip",
		txt: "mdi-file-document-outline",
		xls: "mdi-file-excel",
		other: "mdi-file-outline",
	};

	export default {};
</script>
<script setup lang="ts">
	import Toolbar from "./Toolbar.vue";
	// import Tree from "./Tree.vue";
	import List from "./List.vue";
	import Upload from "./Upload.vue";

	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

	// Props
	const props = defineProps({
		icons: { type: Object, default: () => fileIcons },
	});

	// Emit event for model binding
	const emit = defineEmits(["change", "path-changed", "add-files"]);

	function removeUploadingFile(index: number) {
		fileManagerStore.uploadingFiles.splice(index, 1);
	}
</script>
