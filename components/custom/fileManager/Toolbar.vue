<template>
	<v-toolbar dense outlined flat>
		<v-toolbar-items class="align-center">
			<template v-for="(segment, index) in pathSegments" :key="index">
				<v-icon>mdi-chevron-right</v-icon>
				<v-btn
					text
					:input-value="index === pathSegments.length - 1"
					@click="fileManagerStore.path = segment.path"
					>{{ segment.name }}</v-btn
				>
			</template>
		</v-toolbar-items>
		<div class="flex-grow-1"></div>

		<v-btn
			v-if="pathSegments.length > 1"
			icon
			@click="goUp"
			v-tooltip:bottom="
				pathSegments.length === 1
					? '/'
					: pathSegments[pathSegments.length - 2].path
			"
		>
			<v-icon>mdi-arrow-up-bold-outline</v-icon>
		</v-btn>

		<v-menu
			v-model="newFolderPopper"
			:close-on-content-click="false"
			:nudge-width="200"
			offset-y
		>
			<template v-slot:activator="{ props }">
				<v-btn v-if="path" icon v-bind="props" title="Create Folder">
					<v-icon>mdi-folder-plus-outline</v-icon>
				</v-btn>
			</template>
			<v-card>
				<v-card-text>
					<v-text-field
						label="Name"
						v-model="newFolderName"
						hide-details
					></v-text-field>
				</v-card-text>
				<v-card-actions>
					<div class="flex-grow-1"></div>
					<v-btn @click="newFolderPopper = false" depressed
						>Cancel</v-btn
					>
					<v-btn
						color="success"
						:disabled="!newFolderName"
						depressed
						@click="mkdir"
						>Create Folder</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-menu>
		<v-btn
			v-if="path"
			icon
			@click="$refs.inputUpload.click()"
			title="Upload Files"
		>
			<v-icon>mdi-plus-circle</v-icon>
			<input
				v-show="false"
				ref="inputUpload"
				type="file"
				multiple
				@change="addFiles"
			/>
		</v-btn>
	</v-toolbar>
</template>

<script setup>
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();
	import { ref, computed } from "vue";

	const props = defineProps({
		path: String,
		endpoints: Object,
	});

	const newFolderPopper = ref(false);
	const newFolderName = ref("");

	const pathSegments = computed(() => {
		let path = "/";
		const isFolder =
			fileManagerStore.path[fileManagerStore.path.length - 1] === "/";
		let segments = fileManagerStore.path.split("/");
		segments.pop();

		let segmentsObj = segments.map((item, index) => {
			if (item)
				path +=
					item + (index < segments.length - 1 || isFolder ? "/" : "");
			else item = "/";
			return {
				name: item,
				path,
			};
		});

		return segmentsObj;
	});

	const goUp = () => {
		const segments = pathSegments.value;
		const path =
			segments.length === 1 ? "/" : segments[segments.length - 2].path;
		fileManagerStore.path = path;
	};

	const addFiles = async (event) => {
		fileManagerStore.addUploadingFiles(event.target.files);
		event.target.value = "";
	};

	const mkdir = async () => {
		fileManagerStore.loading = true;
		const url = props.endpoints.mkdir.url.replace(
			new RegExp("{path}", "g"),
			fileManagerStore.path + newFolderName.value
		);

		const config = {
			url,
			method: props.endpoints.mkdir.method || "post",
		};

		await props.axios.request(config);
		fileManagerStore.refreshPending = true;
		emit("folder-created", newFolderName.value);
		newFolderPopper.value = false;
		newFolderName.value = "";
		fileManagerStore.loading = false;
	};
</script>
