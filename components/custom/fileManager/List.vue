<template>
	<v-card flat tile min-height="380" class="d-flex flex-column">
		<confirm ref="confirm"></confirm>
		<v-card-text
			v-if="!fileManagerStore.path"
			class="grow d-flex justify-center align-center grey--text"
			>Vyberte složku nebo soubor</v-card-text
		>
		<v-card-text
			v-else-if="isFile"
			class="grow d-flex justify-center align-center"
			>Soubor: {{ fileManagerStore.path }}</v-card-text
		>
		<v-card-text
			v-else-if="
				fileManagerStore.dirs.length || fileManagerStore.files.length
			"
			class="grow"
		>
			<v-list subheader v-if="fileManagerStore.dirs.length">
				<v-list-subheader>Folders</v-list-subheader>
				<v-list-item
					v-for="item in fileManagerStore.dirs"
					:key="item.basename"
					@click="changePath(item.path)"
					class="pl-0"
					avatar-append="mdi-folder-outline"
				>
					<v-list-item-title
						v-text="item.basename"
					></v-list-item-title>
					<v-list-item-action class="align-self-center">
						<v-btn icon @click.stop="deleteItem(item)">
							<v-icon color="grey lighten-1"
								>mdi-delete-outline</v-icon
							>
						</v-btn>
						<v-btn icon v-if="false">
							<v-icon color="grey lighten-1"
								>mdi-information</v-icon
							>
						</v-btn>
					</v-list-item-action>
				</v-list-item>
			</v-list>
			<v-divider
				v-if="
					fileManagerStore.dirs.length &&
					fileManagerStore.files.length
				"
			></v-divider>
			<v-list subheader v-if="fileManagerStore.files.length">
				<v-list-subheader>Soubory</v-list-subheader>
				<v-list-group
					v-model="selectedFiles"
					:multiple="multipleSelect"
					@change="selectedFilesChanged"
				>
					<v-list-item
						v-for="item in fileManagerStore.files"
						:key="item.basename"
						:value="item.path"
						@dblclick="returnItem(item)"
						class="px-0 mb-1"
						:avatar-append="
							icons[item.extension.toLowerCase()] ||
							icons['other']
						"
					>
						<template v-slot:default="{ active }">
							<div class="w-100 align-self-stretch d-flex py-2">
								<v-list-item-action
									v-if="multipleSelect"
									class="align-self-center ml-5 mr-2 my-0"
								>
									<v-checkbox
										:input-value="active"
									></v-checkbox>
								</v-list-item-action>

								<img
									:src="fileUrl(item.path)"
									v-if="isImage(item.extension)"
									width="100"
									class="align-self-center"
								/>
								<v-list-item-title
									v-text="item.basename"
								></v-list-item-title>
								<v-list-item-subtitle>{{
									formatBytes(item.size)
								}}</v-list-item-subtitle>

								<v-list-item-action
									class="align-self-center mr-4"
								>
									<v-btn icon @click.stop="deleteItem(item)">
										<v-icon color="grey lighten-1"
											>mdi-delete-outline</v-icon
										>
									</v-btn>
									<v-btn icon v-if="false">
										<v-icon color="grey lighten-1"
											>mdi-information</v-icon
										>
									</v-btn>
								</v-list-item-action>
							</div>
						</template>
					</v-list-item>
				</v-list-group>
			</v-list>
		</v-card-text>
		<v-card-text
			v-else-if="filter"
			class="grow d-flex justify-center align-center grey--text py-5"
			>Nebyly nalezeny žádné složky ani soubory</v-card-text
		>
		<v-card-text
			v-else
			class="grow d-flex justify-center align-center grey--text py-5"
			>Složka je prázdná</v-card-text
		>
		<v-divider v-if="fileManagerStore.path"></v-divider>
		<v-toolbar
			v-if="false && fileManagerStore.path && isFile"
			dense
			flat
			class="shrink"
		>
			<v-btn icon>
				<v-icon>mdi-download</v-icon>
			</v-btn>
		</v-toolbar>
		<v-toolbar
			v-if="fileManagerStore.path && isDir"
			dense
			flat
			class="shrink"
		>
			<v-text-field
				solo
				flat
				hide-details
				label="Filter"
				v-model="filter"
				prepend-inner-icon="mdi-filter-outline"
				class="ml-n3"
			></v-text-field>
			<v-btn icon v-if="false">
				<v-icon>mdi-eye-settings-outline</v-icon>
			</v-btn>
			<v-btn icon @click="load">
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-toolbar>
	</v-card>
</template>
<script setup>
	import { storeToRefs } from "pinia";
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();
	const { selectedFiles, items, loading } = storeToRefs(fileManagerStore);

	import { ref, computed, watch } from "vue";
	import { formatBytes } from "~/digitalniweb-custom/functions/formatBytes";
	import Confirm from "./Confirm.vue";

	const props = defineProps({
		icons: Object,
		storage: String,
		endpoints: Object,
		multipleSelect: Boolean,
		refreshPending: Boolean,
	});

	const emit = defineEmits(["path-changed", "refreshed", "file-deleted"]);

	const filter = ref("");

	const isDir = computed(() => {
		return fileManagerStore.path[fileManagerStore.path.length - 1] === "/";
	});

	const isFile = computed(() => {
		return !isDir.value;
	});

	const selectedFilesChanged = (itemValueList) => {
		let fullPathFiles = [];
		if (!!itemValueList) {
			if (typeof itemValueList == "string")
				itemValueList = [itemValueList];
			fullPathFiles = itemValueList.map((path) => fileUrl(path));
		}
		selectedFiles.value = fullPathFiles;
	};

	const fileUrl = (browserPath) => {
		return process.env.FILEBROWSER_PUBLIC_ROOT_PATH + browserPath;
	};

	const returnItem = (item) => {
		const path = [fileUrl(item.path)];
		if (item.type == "file")
			store.dispatch("confirmFileBrowser", { data: path });
	};

	const isImage = (extension) => {
		return ["png", "jpg", "jpeg", "webp"].includes(extension);
	};

	const changePath = (newPath) => {
		path = newPath;
	};

	const deleteItem = async (item) => {
		let confirmed = await Confirm.methods.open(
			"Delete",
			`Opravdu chcete smazat ${
				item.type === "dir" ? "tuto složku" : "tento soubor"
			}?<br><em>${item.basename}</em>`
		);

		if (confirmed) {
			loading = true;
			let url = props.endpoints.delete.url
				.replace(new RegExp("{storage}", "g"), props.storage)
				.replace(new RegExp("{path}", "g"), item.path);

			let config = {
				url,
				method: props.endpoints.delete.method || "post",
			};

			await props.axios.request(config);
			emit("file-deleted");
			loading = false;
		}
	};

	watch(
		() => fileManagerStore.path,
		async () => {
			items.value = [];
			await fileManagerStore.loadList();
		}
	);

	watch(
		() => props.refreshPending,
		async () => {
			if (props.refreshPending) {
				await fileManagerStore.loadList();
				emit("refreshed");
			}
		}
	);

	fileManagerStore.loadList();
</script>
