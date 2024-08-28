<template>
	<v-card class="mx-auto" :loading="loading > 0">
		<Toolbar
			:path="path"
			:endpoints="endpoints"
			v-on:add-files="addUploadingFiles"
		></Toolbar>
		<v-row no-gutters>
			<v-col v-if="tree" sm="auto">
				<Tree
					:path="path"
					:icons="icons"
					:endpoints="endpoints"
					:refreshPending="refreshPending"
					v-on:loading="loadingChanged"
					v-on:refreshed="refreshPending = false"
				></Tree>
			</v-col>
			<v-divider v-if="tree" vertical></v-divider>
			<v-col>
				<List
					:path="path"
					:icons="icons"
					:endpoints="endpoints"
					:refreshPending="refreshPending"
					:maxUploadFilesCount="maxUploadFilesCount"
					:multipleSelect="multipleSelect"
					v-on:loading="loadingChanged"
					v-on:refreshed="refreshPending = false"
					v-on:file-deleted="refreshPending = true"
				></List>
			</v-col>
		</v-row>
		<Upload
			v-if="uploadingFiles !== false"
			:path="path"
			:files="uploadingFiles"
			:icons="icons"
			:endpoint="endpoints.upload"
			:maxUploadFilesCount="maxUploadFilesCount"
			:maxUploadFileSize="maxUploadFileSize"
			v-on:add-files="addUploadingFiles"
			v-on:remove-file="removeUploadingFile"
			v-on:clear-files="uploadingFiles = []"
			v-on:cancel="uploadingFiles = false"
			v-on:uploaded="uploaded"
		></Upload>
	</v-card>
</template>
<script>
	const endpointPrefix = "/api/filemanager";
	const endpoints = {
		list: {
			url: endpointPrefix + "/storage/local/list?path={path}",
			method: "get",
		},
		upload: {
			url: endpointPrefix + "/storage/local/upload?path={path}",
			method: "post",
		},
		mkdir: {
			url: endpointPrefix + "/storage/local/mkdir?path={path}",
			method: "post",
		},
		delete: {
			url: endpointPrefix + "/storage/local/delete?path={path}",
			method: "post",
		},
	};

	const fileIcons = {
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
<script setup>
	import Toolbar from "./Toolbar.vue";
	import Tree from "./Tree.vue";
	import List from "./List.vue";
	import Upload from "./Upload.vue";

	import { useSnackBarsStore } from "~/store/snackBars";
	let snackBarStore = useSnackBarsStore();

	// Props
	const props = defineProps({
		tree: { type: Boolean, default: true },
		icons: { type: Object, default: () => fileIcons },
		endpoints: { type: Object, default: () => endpoints },
		maxUploadFilesCount: { type: Number, default: 0 },
		maxUploadFileSize: { type: Number, default: 0 },
		multipleSelect: { type: Boolean, default: false },
	});

	// Emit event for model binding
	const emit = defineEmits(["change", "path-changed", "add-files"]);

	// State
	const loading = ref(0);
	const path = ref("/");
	const uploadingFiles = ref(false); // Or an array of files
	const refreshPending = ref(false);

	// Methods
	function loadingChanged(isLoading) {
		if (isLoading) loading.value++;
		else if (loading.value > 0) loading.value--;
	}

	function addUploadingFiles(files) {
		files = Array.from(files);

		if (props.maxUploadFileSize) {
			files = files.filter((file) => {
				if (file.size <= props.maxUploadFileSize) return true;
				// Handle file size too large
				// You can replace this with your own snackbar or alert method
				snackBarStore.setSnackBar({
					text: `Soubor ${file.name} je příliš velký`,
					icon: "alert-circle-outline",
					color: "orange",
				});
				return false;
			});
		}

		if (uploadingFiles.value === false) {
			uploadingFiles.value = [];
		}

		if (
			props.maxUploadFilesCount &&
			uploadingFiles.value.length + files.length >
				props.maxUploadFilesCount
		) {
			files = files.slice(
				0,
				props.maxUploadFilesCount - uploadingFiles.value.length
			);
		}

		uploadingFiles.value.push(...files);
	}

	function removeUploadingFile(index) {
		uploadingFiles.value.splice(index, 1);
	}

	function uploaded() {
		uploadingFiles.value = false;
		refreshPending.value = true;
	}
</script>
