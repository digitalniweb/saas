type confirmOptions = {
	color: string;
	width: number;
};
export const useConfirmStore = defineStore("confirm", {
	state: () => ({
		dialog: false,
		resolve: (value: any) => {},
		reject: (value: any) => {},
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
			this.resolve(true);
			this.dialog = false;
		},
		cancel() {
			this.resolve(false);
			this.dialog = false;
		},
	},
});
