type fileManagerOptions = {
	maxUploadFilesCount: number;
	maxUploadFileSize: number;
	multipleSelect: boolean;
};
import { useConfirmStore } from "@/store/confirm";
import { useSnackBarsStore } from "~/store/snackBars";
import type {
	fileSystemDirectory,
	fileSystemFile,
	fileSystemItems,
} from "~~/digitalniweb-types/filesystem";
export const useFileManagerStore = defineStore("fileManager", {
	state: () => ({
		opened: false as boolean,
		path: "/",
		tree: false, // isn't implemented
		selectedFiles: [] as string[], // resolve
		items: {} as fileSystemItems,
		isDir: true, // if path is directory, otherwise it is file
		filter: "", // filter names
		// resolve and reject are functions but we get stringified errors in some cases
		resolve: null as null | ((value: any) => void),
		reject: null as null | ((value: any) => void),
		loading: false,
		apiPrefix: "/api/filemanager/storage/local",
		uploadingFiles: [] as File[],
		uploading: false,

		options: {
			maxUploadFilesCount: 1,
			maxUploadFileSize: 20971520,
			multipleSelect: false,
		} as fileManagerOptions,
		defaultOptions: {
			maxUploadFilesCount: 1,
			maxUploadFileSize: 20971520,
			multipleSelect: false,
		} as fileManagerOptions,
	}),
	getters: {
		// files and directories in selected directory
		files: (state) =>
			state.items?.files?.filter((item) =>
				item.name.includes(state.filter)
			) ?? [],
		// directories in selected directory
		dirs: (state) => {
			return (
				state.items?.dirs?.filter((item) =>
					item.basename.includes(state.filter)
				) ?? []
			);
		},
	},
	actions: {
		async open(
			options = {} as Partial<fileManagerOptions>
		): Promise<string[]> {
			this.options = { ...this.defaultOptions, ...options };
			this.opened = true;
			return new Promise((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
			});
		},
		close() {
			this.opened = false;
			this.resolve?.(false);
			this.resolve = null;
			this.reject = null;
		},
		confirm() {
			this.opened = false;
			this.resolve?.(this.selectedFiles);
			this.resolve = null;
			this.reject = null;
		},
		addUploadingFiles(fileList: FileList) {
			let snackBarStore = useSnackBarsStore();
			let files = Array.from(fileList);

			if (this.options.maxUploadFileSize) {
				files = files.filter((file) => {
					if (file.size <= this.options.maxUploadFileSize)
						return true;
					snackBarStore.setSnackBar({
						text: `Soubor ${file.name} je příliš velký`,
						icon: "alert-circle-outline",
						color: "orange",
					});
					return false;
				});
			}

			if (
				this.options.maxUploadFilesCount &&
				this.uploadingFiles.length + files.length >
					this.options.maxUploadFilesCount
			) {
				files = files.slice(
					0,
					this.options.maxUploadFilesCount -
						this.uploadingFiles.length
				);
			}

			this.uploadingFiles.push(...files);
		},
		async deleteFile(item: fileSystemFile) {
			const confirmStore = useConfirmStore();
			let confirmed = await confirmStore.open(
				"Delete",
				`Opravdu chcete smazat tento soubor?<br><em>${item.name}</em>`
			);

			if (!confirmed) return;
			this.loading = true;
			const { fetchData } = useApiCall();
			await fetchData<string[]>(
				`${this.apiPrefix}/delete?path=${item.path}&type=file`,
				{
					method: "POST",
				}
			);

			const deleteIndex = this.files.findIndex(
				(file) => file.name === item.name
			);
			if (deleteIndex !== -1) {
				this.items.files.splice(deleteIndex, 1);
			}

			let snackBarStore = useSnackBarsStore();
			snackBarStore.setSnackBar({
				text: "soubor byl smazán",
				icon: "check",
				color: "light-green",
			});
			this.loadList();
			this.loading = false;
		},
		async deleteDirectory(item: fileSystemDirectory) {
			const confirmStore = useConfirmStore();
			let confirmed = await confirmStore.open(
				"Delete",
				`Opravdu chcete smazat tuto složku?<br><em>${item.basename}</em>`
			);

			if (!confirmed) return;
			this.loading = true;
			const { fetchData } = useApiCall();
			await fetchData<string[]>(
				`${this.apiPrefix}/delete?path=${item.path}&type=dir`,
				{
					method: "POST",
				}
			);

			let snackBarStore = useSnackBarsStore();
			snackBarStore.setSnackBar({
				text: "složka byla smazána",
				icon: "check",
				color: "light-green",
			});
			this.loadList();
			this.loading = false;
		},
		async mkdir(folderPath: string) {
			this.loading = true;
			try {
				const { fetchData } = useApiCall();
				await fetchData<string[]>(
					`${this.apiPrefix}/mkdir?path=${folderPath}`,
					{
						method: "POST",
					}
				);
				let snackBarStore = useSnackBarsStore();
				snackBarStore.setSnackBar({
					text: "složka byla vytvořena",
					icon: "check",
					color: "light-green",
				});
				this.loadList();
			} catch (error) {
				if (process.env.NODE_ENV === "development") console.log(error);
				let snackBarStore = useSnackBarsStore();
				snackBarStore.setSnackBar({
					text: "Něco se pokazilo.",
					icon: "alert-circle-outline",
					color: "red",
				});
			}
			this.loading = false;
		},
		async upload() {
			let snackBarStore = useSnackBarsStore();
			if (!this.uploadingFiles || !this.uploadingFiles.length) {
				snackBarStore.setSnackBar({
					text: "Nebyly vybrány žádné soubory.",
					icon: "alert-circle-outline",
					color: "orange",
				});
				return;
			}
			let formData = new FormData();

			// files
			for (let file of this.uploadingFiles) {
				formData.append("file", file);
			}

			this.uploading = true;

			try {
				const { fetchData } = useApiCall();
				await fetchData<string[]>(
					`${this.apiPrefix}/upload?path=${this.path}`,
					{
						method: "POST",
						body: formData,
					}
				);
				snackBarStore.setSnackBar({
					text:
						this.uploadingFiles.length > 1
							? "Soubory byly nahrány"
							: "Soubor byl nahrán",
					icon: "check",
					color: "light-green",
				});
				this.loadList();
			} catch (error) {
				if (process.env.NODE_ENV === "development") console.log(error);
				snackBarStore.setSnackBar({
					text: "Něco se pokazilo.",
					icon: "alert-circle-outline",
					color: "red",
				});
			}

			this.uploading = false;
			this.uploadingFiles = [];
		},
		async loadList() {
			this.loading = true;
			if (this.isDir) {
				this.selectedFiles = [];
				const { fetchData } = useApiCall();
				try {
					let items = await fetchData<fileSystemItems>(
						`${this.apiPrefix}/list?path=${this.path}`
					);
					if (items) this.items = items;
				} catch (error) {}
			} else {
				// TODO: load file
			}
			this.loading = false;
		},
	},
});
