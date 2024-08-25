type fileManagerOptions = {
	maxUploadFilesCount: number;
	maxUploadFileSize: number;
	multipleSelect: boolean;
};
export const useFileManagerStore = defineStore("fileManager", {
	state: () => ({
		opened: false as boolean,
		path: "/",
		selectedFiles: [] as string[], // resolve
		items: [] as string[],
		isDir: true, // if path is directory, otherwise it is file
		filter: "", // filter names
		resolve: "",
		reject: "",
		loading: false,
		apiPrefix: "/api/filemanager/storage/local",

		options: {
			maxUploadFilesCount: 1,
			maxUploadFileSize: 20971520,
			multipleSelect: false,
		} as fileManagerOptions,
		defaultOptions: {
			maxUploadFilesCount: 1,
			maxUploadFileSize: 20971520,
			multipleSelect: false,
		},
	}),
	getters: {
		// files and directories in selected directory
		files: (state) =>
			state.items.filter(
				(item: any) =>
					item.type === "file" && item.basename.includes(state.filter)
			),
		// directories in selected directory
		dirs: (state) => {
			return state.items.filter(
				(item: any) =>
					item.type === "dir" && item.basename.includes(state.filter)
			);
		},
	},
	actions: {
		/*
		 just for info, delete later
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
		*/
		open(options = {} as fileManagerOptions) {
			this.options = { ...this.defaultOptions, ...options };
			this.opened = true;
		},
		close() {
			this.opened = false;
		},
		async loadList() {
			this.loading = true;
			if (this.isDir) {
				this.selectedFiles = [];
				const { fetchData } = useApiCall();
				try {
					let items = await fetchData<string[]>(
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
