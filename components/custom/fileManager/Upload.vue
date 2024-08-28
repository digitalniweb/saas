<template>
	<v-overlay :absolute="true">
		<v-card flat light class="mx-auto" :loading="loading">
			<v-card-text class="py-3 text-center">
				<div>
					<span class="grey--text">Upload to:</span>
					<v-chip color="info" class="mx-1">{{ storage }}</v-chip>
					<v-chip>{{ path }}</v-chip>
				</div>
				<div v-if="maxUploadFilesCount">
					<span class="grey--text"
						>Max files count: {{ maxUploadFilesCount }}</span
					>
				</div>
				<div v-if="maxUploadFileSize">
					<span class="grey--text"
						>Max file size:
						{{ formatBytes(maxUploadFileSize) }}</span
					>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-text
				v-if="listItems.length"
				class="pa-0 files-list-wrapper"
			>
				<v-list two-line v-if="listItems.length">
					<v-list-item
						v-for="(file, index) in listItems"
						:key="index"
						link
					>
						<v-avatar>
							<v-img
								v-if="file.preview"
								:src="file.preview"
							></v-img>
							<v-icon
								v-else
								v-text="icons[file.extension] || 'mdi-file'"
								class="mdi-36px"
								color="grey lighten-1"
							></v-icon>
						</v-avatar>
						<v-list-item-title
							v-text="file.name"
						></v-list-item-title>
						<v-list-item-subtitle
							>{{ formatBytes(file.size) }} -
							{{ file.type }}</v-list-item-subtitle
						>
						<v-list-item-action>
							<v-btn icon @click="remove(index)">
								<v-icon color="grey lighten-1"
									>mdi-close</v-icon
								>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-card-text v-else class="py-6 text-center">
				<v-btn @click="$refs.inputUpload.click()">
					<v-icon left>mdi-plus-circle</v-icon>Add files
				</v-btn>
			</v-card-text>
			<v-divider></v-divider>
			<v-toolbar dense flat>
				<div class="grow"></div>
				<v-btn text @click="cancel" class="mx-1">Cancel</v-btn>
				<v-btn
					depressed
					color="warning"
					@click="clear"
					class="mx-1"
					:disabled="!files"
				>
					<v-icon>mdi-close</v-icon>Clear
				</v-btn>
				<v-btn
					:disabled="listItems.length >= maxUploadFilesCount"
					depressed
					color="info"
					@click="$refs.inputUpload.click()"
					class="mx-1"
				>
					<v-icon left>mdi-plus-circle</v-icon>Add Files
					<input
						v-show="false"
						ref="inputUpload"
						type="file"
						multiple
						@change="add"
					/>
				</v-btn>
				<v-btn
					depressed
					color="success"
					@click="upload"
					class="ml-1"
					:disabled="!files"
				>
					Upload
					<v-icon right>mdi-upload-outline</v-icon>
				</v-btn>
			</v-toolbar>
			<v-overlay
				:value="uploading"
				:absolute="true"
				color="white"
				opacity="0.9"
			>
				<v-progress-linear
					v-model="progress"
					height="25"
					striped
					rounded
					reactive
				>
					<strong>{{ Math.ceil(progress) }}%</strong>
				</v-progress-linear>
			</v-overlay>
		</v-card>
	</v-overlay>
</template>
<script setup>
	import { watch } from "vue";
	import { formatBytes } from "~/digitalniweb-custom/functions/formatBytes";

	const imageMimeTypes = ["image/png", "image/jpeg"];

	const props = defineProps({
		path: String,
		storage: String,
		endpoint: Object,
		files: { type: Array, default: () => [] },
		icons: Object,
		axios: Function,
		maxUploadFilesCount: { type: Number, default: 0 },
		maxUploadFileSize: { type: Number, default: 0 },
	});

	const emit = defineEmits([
		"add-files",
		"remove-file",
		"clear-files",
		"cancel",
		"uploaded",
	]);

	const loading = ref(false);
	const uploading = ref(false);
	const progress = ref(0);
	const listItems = ref([]);

	const filesMap = async (files) => {
		let promises = Array.from(files).map((file) => {
			let result = {
				name: file.name,
				type: file.type,
				size: file.size,
				extension: file.name.split(".").pop(),
			};
			return new Promise((resolve) => {
				if (!imageMimeTypes.includes(result.type)) {
					return resolve(result);
				}
				var reader = new FileReader();
				reader.onload = function (e) {
					result.preview = e.target.result;
					resolve(result);
				};
				reader.readAsDataURL(file);
			});
		});

		return await Promise.all(promises);
	};

	const add = async (event) => {
		let files = Array.from(event.target.files);
		emit("add-files", files);
		event.target.value = "";
	};

	const remove = (index) => {
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

	const upload = async () => {
		if (!props.files.length) {
			// Assuming you have a store or some method to show notifications
			// this.$store.dispatch('setSnackBars', {
			//   text: 'Nebyly vybrány žádné soubory.',
			//   icon: 'alert-circle-outline',
			//   color: 'orange',
			// });
			return;
		}
		let formData = new FormData();

		// files
		for (let file of props.files) {
			formData.append("files", file, file.name);
		}

		let url = props.endpoint.url
			.replace(new RegExp("{storage}", "g"), props.storage)
			.replace(new RegExp("{path}", "g"), props.path);

		let config = {
			url,
			method: props.endpoint.method || "post",
			data: formData,
			onUploadProgress: (progressEvent) => {
				progress.value =
					(progressEvent.loaded / progressEvent.total) * 100;
			},
		};

		uploading.value = true;
		try {
			await props.axios.request(config);
			// Assuming you have a store or some method to show notifications
			// this.$store.dispatch('setSnackBars', {
			//   text: props.files.length > 1 ? 'Soubory byly nahrány' : 'Soubor byl nahrán',
			//   icon: 'check',
			//   color: 'light-green',
			// });
		} catch (error) {
			if (process.env.NODE_ENV === "production")
				console.log("Nepodařilo se nahrát soubor");
			else console.log(error);
			// Assuming you have a store or some method to show notifications
			// this.$store.dispatch('setSnackBars', {
			//   text: 'Něco se pokazilo.',
			//   icon: 'alert-circle-outline',
			//   color: 'red',
			// });
		}
		uploading.value = false;
		emit("uploaded");
	};

	watch(
		() => props.files,
		async () => {
			loading.value = true;
			listItems.value = await filesMap(props.files);
			loading.value = false;
		},
		{ deep: true, immediate: true }
	);
</script>
