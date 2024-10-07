import { Extension } from "@tiptap/core";

import type { ButtonView, GeneralOptions } from "vuetify-pro-tiptap";
import SourceCode from "./SourceCode.vue";

export interface SourceCode extends GeneralOptions<ButtonView> {
	button: ButtonView;
}

export default Extension.create<SourceCode>({
	name: "source code",
	addOptions() {
		return {
			divider: false,
			spacer: false,
			button: () => ({
				component: markRaw(SourceCode),
				componentProps: {},
			}),
		};
	},
});
