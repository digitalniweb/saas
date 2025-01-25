export type snackBar = {
	id: number;
	show: boolean;
	color: string;
	timeout: number;
	text: string;
	icon: string;
	enableBody?: boolean; // defaultly remove 'disabled' class from <body>
};
import { useCurrentPageStore } from "./currentPage";
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
			const currentPage = useCurrentPageStore();
			this.idCounter++;
			this.snackBars.push({
				id: this.idCounter,
				show: true,
				text: options.text || "OK",
				color: options.color || "primary",
				icon: options.icon || "information-outline",
				timeout: options.timeout || 4000,
			});

			if (
				currentPage.disabled &&
				(options.enableBody === undefined ||
					options?.enableBody === true)
			)
				currentPage.disabled = false;
		},
		removeSnackBar(snackBar: snackBar) {
			this.snackBars.splice(this.snackBars.indexOf(snackBar), 1);
		},
	},
});
