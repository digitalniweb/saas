<template>
	<v-overlay
		:absolute="true"
		:model-value="listItems.length > 0"
		class="align-center justify-center"
	>
		<v-card flat light :loading="fileManagerStore.loading">
			<v-card-text class="py-3 text-center">
				<div>
					<span class="grey--text">Upload to:</span>
					<v-chip>{{ fileManagerStore.path }}</v-chip>
				</div>
				<div v-if="fileManagerStore.options.maxUploadFilesCount">
					<span class="grey--text"
						>Max files count:
						{{ fileManagerStore.options.maxUploadFilesCount }}</span
					>
				</div>
				<div v-if="fileManagerStore.options.maxUploadFileSize">
					<span class="grey--text"
						>Max file size:
						{{
							formatBytes(
								fileManagerStore.options.maxUploadFileSize
							)
						}}</span
					>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text
				v-if="listItems.length"
				class="pa-0 files-list-wrapper"
			>
				<v-list three-line v-if="listItems.length">
					<v-list-item
						v-for="(file, index) in listItems"
						:key="index"
						link
					>
						<template v-slot:prepend>
							<v-list-item-action
								class="align-self-center ml-5 mr-2 my-0"
							>
								<img
									v-if="file.preview"
									:src="file.preview"
									style="max-height: 60px"
								/>
								<v-icon
									v-else
									v-text="
										icons?.[file.extension] || 'mdi-file'
									"
									class="mdi-36px"
									color="grey lighten-1"
								></v-icon>
							</v-list-item-action>
						</template>
						<template v-slot:default>
							<v-list-item-title
								v-text="file.name"
							></v-list-item-title>
							<v-list-item-subtitle>
								{{ file.type }}
							</v-list-item-subtitle>
							<v-list-item-subtitle>
								{{ formatBytes(file.size) }}
							</v-list-item-subtitle>
						</template>
						<template v-slot:append>
							<v-list-item-action>
								<v-btn icon @click="remove(index)">
									<v-icon color="grey lighten-1"
										>mdi-close</v-icon
									>
								</v-btn>
							</v-list-item-action></template
						>
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-card-text v-else class="py-6 text-center">
				<v-btn @click="($refs.inputUpload as HTMLInputElement).click()">
					<v-icon left>mdi-plus-circle</v-icon>Add files
				</v-btn>
			</v-card-text>
			<v-divider></v-divider>
			<v-toolbar dense flat>
				<div class="grow"></div>
				<v-btn variant="text" @click="cancel" class="mx-1"
					>Cancel</v-btn
				>
				<v-btn
					depressed
					color="warning"
					@click="clear"
					class="mx-1"
					:disabled="!fileManagerStore.uploadingFiles"
				>
					<v-icon>mdi-close</v-icon>Clear
				</v-btn>
				<v-btn
					:disabled="
						listItems.length >=
						fileManagerStore.options.maxUploadFilesCount
					"
					depressed
					color="info"
					@click="($refs.inputUpload as HTMLInputElement).click()"
					class="mx-1"
				>
					<v-icon left>mdi-plus-circle</v-icon>Add Files
					<input
						v-show="false"
						ref="inputUpload"
						type="file"
						multiple
						@change="add($event as Event)"
					/>
				</v-btn>
				<v-btn
					depressed
					color="success"
					@click="fileManagerStore.upload"
					class="ml-1"
					:disabled="!fileManagerStore.uploadingFiles"
				>
					Upload
					<v-icon right>mdi-upload-outline</v-icon>
				</v-btn>
			</v-toolbar>
			<v-overlay
				:value="fileManagerStore.uploading"
				:absolute="true"
				color="white"
				opacity="0.9"
			>
				<v-progress-linear
					height="25"
					striped
					rounded
					reactive
					indeterminate
				>
				</v-progress-linear>
			</v-overlay>
		</v-card>
	</v-overlay>
</template>
<script setup lang="ts">
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();
	import { watch } from "vue";
	import { formatBytes } from "~~/digitalniweb-custom/functions/formatBytes";

	const imageMimeTypes = ["image/png", "image/jpeg", "image/webp"];

	const props = defineProps({
		icons: Object,
	});

	const emit = defineEmits([
		"add-files",
		"remove-file",
		"clear-files",
		"cancel",
	]);

	type uploadFile = {
		name: string;
		type: string;
		size: number;
		extension: string;
		preview?: string | null;
	};
	const listItems = ref<uploadFile[]>([]);

	const filesMap = async (files: File[]) => {
		let promises = Array.from(files).map((file) => {
			let result = {
				name: file.name,
				type: file.type,
				size: file.size,
				extension: file.name.split(".").pop(),
			} as uploadFile;
			return new Promise<uploadFile>((resolve) => {
				if (!imageMimeTypes.includes(result.type)) {
					return resolve(result);
				}
				var reader = new FileReader();
				reader.onload = function (e) {
					result.preview = e.target?.result as string;
					resolve(result);
				};
				reader.readAsDataURL(file);
			});
		});

		return await Promise.all(promises);
	};

	const add = async (event: Event) => {
		let el = event.target as HTMLInputElement;
		if (el.files == null) return;
		fileManagerStore.addUploadingFiles(el.files);
		el.value = "";
	};

	const remove = (index: number) => {
		emit("remove-file", index);
		listItems.value.splice(index, 1);
	};

	const clear = () => {
		emit("clear-files");
		listItems.value = [];
	};

	const cancel = () => {
		emit("cancel");
	};

	watch(
		() => fileManagerStore.uploadingFiles,
		async () => {
			fileManagerStore.loading = true;
			listItems.value = await filesMap(fileManagerStore.uploadingFiles);
			fileManagerStore.loading = false;
		},
		{ deep: true, immediate: true }
	);
</script>
