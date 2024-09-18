import { InferAttributes } from "sequelize";
import { WebInformation } from "~/digitalniweb-types/models/content";
import { useWebsiteStore } from "~/store/website";
// import { useLanguagesStore } from "./languages";
export const useWebInformationStore = defineStore("webInformation", {
	state: () => ({
		data: {} as InferAttributes<WebInformation>, // for all mutations
	}),
	getters: {},
	actions: {
		async loadData() {
			const website = useWebsiteStore();
			const { fetchData } = useApiCall();
			// const languages = useLanguagesStore();
			let webInfo = await fetchData<InferAttributes<WebInformation>>(
				`/api/website/webInformation?contentMsId=${website.data?.contentMsId}&id=${website.data?.id}`
			);
			if (!webInfo) return false;
			this.data = webInfo;
		},
		async saveData(data: Partial<InferAttributes<WebInformation>>) {
			const { fetchData } = useApiCall();
			let response = await fetchData<boolean>(
				"/api/website/admin/webinformation",
				{
					method: "PATCH",
					body: {
						data,
						websiteId: this.data.websiteId,
						websitesMsId: this.data.websitesMsId,
					},
				}
			);
		},
	},
});
