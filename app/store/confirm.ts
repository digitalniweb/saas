type confirmOptions = {
	color?: string;
	width?: number;
	type?: "yesNo" | "okCancel";
	fullscreen?: boolean;
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
			fullscreen: false,
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
		agree(customResponse?: Record<string, any>) {
			if (this.resolve != null)
				this.resolve(customResponse ? customResponse : true);
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

// this would be if I wanted to make multiple confirm dialogs, but it doesn't work too much with the 'teleportId'
/* type confirmOptions = {
	color?: string;
	width?: number;
	type?: "yesNo" | "okCancel";
	fullscreen?: boolean;
};

type Dialog = {
	id: number;
	dialog: boolean;
	resolve: ((value: unknown) => void) | null;
	reject: ((value: unknown) => void) | null;
	message: string;
	title: string;
	options: confirmOptions;
	teleportId: string;
};

export const useConfirmStore = defineStore("confirm", {
	state: () => ({
		dialogs: [] as Dialog[],
		defaultOptions: {
			color: "error",
			width: 300,
			type: "yesNo",
			fullscreen: false,
		} as confirmOptions,
		dialogIdCounter: 0,
	}),
	getters: {},
	actions: {
		open(
			title: string,
			message: string,
			options = {} as confirmOptions,
			teleportId: string = ""
		) {
			const id = this.dialogIdCounter++;
			let dialogPromise = new Promise((resolve, reject) => {
				this.dialogs.push({
					id,
					dialog: true,
					resolve,
					reject,
					title,
					message,
					options: { ...this.defaultOptions, ...options },
					teleportId,
				});
				return { id, dialogPromise };
			});
		},
		agree(id: number, customResponse?: Record<string, any>) {
			const dialogIndex = this.dialogs.findIndex((d) => d.id === id);
			if (dialogIndex > -1) {
				const dialog = this.dialogs[dialogIndex];
				dialog.resolve?.(customResponse ? customResponse : true);
				this.dialogs.splice(dialogIndex, 1);
			}
		},
		cancel(id: number) {
			const dialogIndex = this.dialogs.findIndex((d) => d.id === id);
			if (dialogIndex > -1) {
				const dialog = this.dialogs[dialogIndex];
				dialog.resolve?.(false);
				this.dialogs.splice(dialogIndex, 1);
			}
		},
	},
});
 */
