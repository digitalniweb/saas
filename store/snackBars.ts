export type snackBar = {
	id: number;
	show: boolean;
	color: string;
	timeout: number;
	text: string;
	icon: string;
};
export const useSnackBarsStore = defineStore("snackBars", {
	state: () => ({
		snackBars: [] as snackBar[],
		idCounter: 0,
	}),
	getters: {},
	actions: {
		getSnackBars() {
			return this.snackBars;
		},
		setSnackBar(options: Partial<snackBar>) {
			this.idCounter++;
			this.snackBars.push({
				id: this.idCounter,
				show: true,
				text: options.text || "OK",
				color: options.color || "primary",
				icon: options.icon || "information-outline",
				timeout: options.timeout || 4000,
			});
		},
		removeSnackBar(snackBar: snackBar) {
			this.snackBars.splice(this.snackBars.indexOf(snackBar), 1);
		},
	},
});
