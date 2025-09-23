import type { InferAttributes } from "sequelize";
import type { WebInformation } from "~~/digitalniweb-types/models/content";
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

			// even though the sequelize update method describes the returning value differently it returns [1] on changing anything and [0] on changing nothing
			let response = await fetchData<boolean[]>(
				"/api/website/admin/webinformation",
				{
					method: "PATCH",
					body: {
						data,
						id: this.data.id,
					},
				}
			);
			return response;
		},
	},
});
