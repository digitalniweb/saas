type confirmOptions = {
	color: string;
	width: number;
};
export const useConfirmStore = defineStore("confirm", {
	state: () => ({
		dialog: false,
		resolve: null as null | ((value: unknown) => void),
		reject: null as null | ((value: unknown) => void),
		message: "",
		title: "",
		options: {
			color: "error",
			width: 300,
		} as confirmOptions,
	}),
	getters: {},
	actions: {
		open(title: string, message: string, options = {} as confirmOptions) {
			this.dialog = true;
			this.title = title;
			this.message = message;
			this.options = Object.assign(this.options, options);
			return new Promise((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
			});
		},
		agree() {
			if (this.resolve != null) this.resolve(true);
			this.dialog = false;
		},
		cancel() {
			if (this.resolve != null) this.resolve(false);
			this.dialog = false;
		},
	},
});
