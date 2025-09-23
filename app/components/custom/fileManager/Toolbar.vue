<template>
	<v-toolbar dense outlined flat>
		<v-toolbar-items class="align-center">
			<v-icon class="ml-5">mdi-server</v-icon>
			<template v-for="(segment, index) in pathSegments" :key="index">
				<v-icon v-if="index != 0">mdi-chevron-right</v-icon>
				<v-btn
					variant="text"
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
				<v-btn
					v-if="fileManagerStore.path"
					icon
					v-bind="props"
					v-tooltip:bottom="'Create Folder'"
				>
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
			v-if="fileManagerStore.path"
			icon
			@click="($refs.inputUpload as HTMLInputElement).click()"
			v-tooltip:bottom="'Upload Files'"
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
		<v-btn
			icon
			@click="fileManagerStore.loadList()"
			v-tooltip:bottom="'refresh'"
		>
			<v-icon>mdi-refresh</v-icon>
		</v-btn>
	</v-toolbar>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";

	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();

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

	const addFiles = async (event: Event) => {
		let el = event.target as HTMLInputElement;
		if (el.files != null) fileManagerStore.addUploadingFiles(el.files);
		el.value = "";
	};

	const mkdir = async () => {
		fileManagerStore.loading = true;
		await fileManagerStore.mkdir(
			fileManagerStore.path + newFolderName.value
		);
		// emit("folder-created", newFolderName.value);
		newFolderPopper.value = false;
		newFolderName.value = "";
		fileManagerStore.loading = false;
	};
</script>
