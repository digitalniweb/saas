export type snackBar = {
	id: number;
	show: boolean;
	color: string;
	timeout: number;
	text: string;
	icon: string;
	textTranslate?: string;
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
			let color = options.color || "primary";
			let colorTextMap = {
				primary: "OK",
				success: "Success",
				warning: "Something went wrong",
				error: "Error",
			} as Record<string, string>;
			let text: string;
			if (options.text) {
				text = options.text;
			} else {
				const { translate } = useTranslations();
				let textTranslate =
					options.textTranslate || colorTextMap[color] || "Finished";
				text = translate(textTranslate);
			}
			this.snackBars.push({
				id: this.idCounter,
				show: true,
				text,
				color,
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
