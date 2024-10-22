type confirmOptions = {
	color?: string;
	width?: number;
	type?: "yesNo" | "okCancel";
};
export const useConfirmStore = defineStore("confirm", {
	state: () => ({
		dialog: false,
		resolve: null as null | ((value: unknown) => void),
		reject: null as null | ((value: unknown) => void),
		message: "",
		title: "",
		options: {} as confirmOptions,
		teleportId: "",
		defaultOptions: {
			color: "error",
			width: 300,
			type: "yesNo",
		} as confirmOptions,
	}),
	getters: {},
	actions: {
		open(
			title: string,
			message: string,
			options = {} as confirmOptions,
			teleportId: string = ""
		) {
			this.dialog = true;
			this.title = title;
			this.message = message;
			this.teleportId = teleportId;
			this.options = { ...this.defaultOptions, ...options };
			return new Promise((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
			});
		},
		agree() {
			if (this.resolve != null) this.resolve(true);
			this.resolve = null;
			this.reject = null;
			this.dialog = false;
		},
		cancel() {
			if (this.resolve != null) this.resolve(false);
			this.resolve = null;
			this.reject = null;
			this.dialog = false;
		},
	},
});
