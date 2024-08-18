type fileManagerOptions = {
	maxUploadFilesCount: number;
	maxUploadFileSize: number;
	multipleSelect: boolean;
};
export const useFileManagerStore = defineStore("fileManager", {
	state: () => ({
		opened: false as boolean,
		lastPath: "",
		selectedFiles: [], // resolve
		resolve: "",
		reject: "",
		// file browser options. Not actual defaults. Defaults are in "openFileBrowser"
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
	getters: {},
	actions: {
		open(options = {} as fileManagerOptions) {
			this.options = { ...this.defaultOptions, ...options };
			this.opened = true;
		},
		close() {
			this.opened = false;
		},
	},
});
