import { useWebsiteStore } from "~/store/website";
// import { useLanguagesStore } from "./languages";
export const useWebInformationStore = defineStore("webInformation", {
	state: () => ({
		data: {}, // for all mutations
		en: {},
	}),
	getters: {},
	actions: {
		async loadData() {
			const website = useWebsiteStore();
			// const languages = useLanguagesStore();
			let webInfo = await useFetch(
				`/api/website/webInformation?contentMsId=${website.data?.contentMsId}&id=${website.data?.id}`
			);
			if (!webInfo.data.value) return false;
			this.data = webInfo.data.value;
		},
	},
});
