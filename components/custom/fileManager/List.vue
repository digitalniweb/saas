<template>
	<v-card flat tile min-height="380" class="d-flex flex-column">
		<v-toolbar
			v-if="fileManagerStore.path && fileManagerStore.isDir"
			dense
			flat
			class="shrink mt-2"
		>
			<v-text-field
				solo
				flat
				hide-details
				label="Vyhledat"
				v-model="fileManagerStore.filter"
				prepend-inner-icon="mdi-filter-outline"
				class="ml-n3"
			></v-text-field>
			<v-btn
				icon
				@click="fileManagerStore.filter = ''"
				v-tooltip:top="'clear'"
			>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-toolbar>
		<v-card-text
			v-if="!fileManagerStore.path"
			class="grow d-flex justify-center align-center grey--text"
			>Vyberte složku nebo soubor</v-card-text
		>
		<v-card-text
			v-else-if="!fileManagerStore.isDir"
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
					@click="fileManagerStore.path = item.path"
					avatar-append="mdi-folder-outline"
				>
					<template v-slot:prepend
						><v-icon>{{ icons?.folder }}</v-icon></template
					>
					<template v-slot:default>
						<v-list-item-title
							v-text="item.basename"
						></v-list-item-title
					></template>
					<template v-slot:append>
						<v-list-item-action class="align-self-center">
							<v-btn
								color="red lighten-1"
								icon
								@click.stop="
									fileManagerStore.deleteDirectory(item)
								"
								size="small"
							>
								<v-icon>mdi-delete-outline</v-icon>
							</v-btn>
						</v-list-item-action></template
					>
				</v-list-item>
			</v-list>
			<v-divider
				v-if="
					fileManagerStore.dirs.length &&
					fileManagerStore.files.length
				"
				class="my-5"
			></v-divider>
			<v-list
				v-if="fileManagerStore.files.length"
				:select-strategy="
					fileManagerStore.options.multipleSelect
						? 'independent'
						: 'single-independent'
				"
				@update:selected="selectedFilesChanged($event as string[])"
			>
				<v-list-subheader>Soubory</v-list-subheader>
				<v-list-item
					v-for="item in fileManagerStore.files"
					:key="item.name"
					:value="item.path"
					@dblclick="returnItem(item)"
					class="mb-1"
					color="cyan"
				>
					<template v-slot:prepend="{ isSelected }">
						<v-list-item-action
							v-if="fileManagerStore.options.multipleSelect"
							class="align-self-center ml-5 mr-2 my-0"
						>
							<v-checkbox
								:model-value="isSelected"
								hide-details
							></v-checkbox>
						</v-list-item-action>
						<v-icon>{{
							icons?.[item.extension.toLowerCase()] ||
							icons?.other
						}}</v-icon>
						<img
							:src="fileUrl(item.path)"
							v-if="isImage(item.extension)"
							width="100"
							class="align-self-center ml-2"
						/>
					</template>
					<template v-slot:default>
						<v-list-item-title>
							{{ item.name }}
						</v-list-item-title>
						<v-list-item-subtitle>
							<v-icon size="x-small" class="mr-2"
								>mdi-calendar-clock</v-icon
							>{{ formatDate(item.mtime) }}
						</v-list-item-subtitle>
						<v-list-item-subtitle>{{
							formatBytes(item.size)
						}}</v-list-item-subtitle>
					</template>
					<template v-slot:append>
						<v-list-item-action class="align-self-center mr-4">
							<v-btn
								icon
								color="red lighten-1"
								@click.stop="fileManagerStore.deleteFile(item)"
								size="small"
							>
								<v-icon>mdi-delete-outline</v-icon>
							</v-btn>
						</v-list-item-action>
					</template>
				</v-list-item>
			</v-list>
		</v-card-text>
		<v-card-text
			v-else-if="fileManagerStore.filter"
			class="grow d-flex justify-center align-center grey--text py-5"
			>Nebyly nalezeny žádné složky ani soubory</v-card-text
		>
		<v-card-text
			v-else
			class="grow d-flex justify-center align-center grey--text py-5"
			>Složka je prázdná</v-card-text
		>
		<v-divider v-if="fileManagerStore.path" class="my-5"></v-divider>
		<v-toolbar
			v-if="false && fileManagerStore.path && !fileManagerStore.isDir"
			dense
			flat
			class="shrink"
		>
			<v-btn icon>
				<v-icon>mdi-download</v-icon>
			</v-btn>
		</v-toolbar>
	</v-card>
</template>
<script setup lang="ts">
	import { useFileManagerStore } from "@/store/fileManager";
	const fileManagerStore = useFileManagerStore();
	const runtimeConfig = useRuntimeConfig();

	import { watch } from "vue";
	import { formatBytes } from "~/digitalniweb-custom/functions/formatBytes";
	import { fileSystemFile } from "../../../digitalniweb-types/filesystem";

	const props = defineProps({
		icons: Object,
	});

	const selectedFilesChanged = (itemValueList: string[]) => {
		let fullPathFiles = [] as string[];

		if (!!itemValueList) {
			if (typeof itemValueList == "string")
				itemValueList = [itemValueList];
			fullPathFiles = itemValueList.map((path) => fileUrl(path));
		}
		fileManagerStore.selectedFiles = fullPathFiles;
	};

	const fileUrl = (browserPath: string) => {
		return runtimeConfig.public.FILEBROWSER_PUBLIC_ROOT_PATH + browserPath;
	};

	const returnItem = (item: fileSystemFile) => {
		if (fileManagerStore.options.multipleSelect) return;
		const path = fileUrl(item.path);
		fileManagerStore.selectedFiles.push(path);
		fileManagerStore.confirm();
	};

	const isImage = (extension: string) => {
		return ["png", "jpg", "jpeg", "webp"].includes(extension);
	};

	const formatDate = (timestamp: Date) => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	};

	watch(
		() => fileManagerStore.path,
		async () => {
			fileManagerStore.items = {
				dirs: [],
				files: [],
			};
			await fileManagerStore.loadList();
		}
	);

	fileManagerStore.loadList();
</script>
