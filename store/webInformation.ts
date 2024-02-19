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
			// const languages = useLanguagesStore();
			let webInfo = await useFetch<InferAttributes<WebInformation>>(
				`/api/website/webInformation?contentMsId=${website.data?.contentMsId}&id=${website.data?.id}`
			);
			if (!webInfo.data.value) return false;
			this.data = webInfo.data.value;
		},
		async saveData(data: Partial<InferAttributes<WebInformation>>) {
			let response = await useFetch<boolean>(
				"/api/website/webinformation",
				{
					method: "PATCH",
					body: {
						data,
						websiteId: this.data.websiteId,
						websitesMsId: this.data.websitesMsId,
					},
				}
			);

			if (
				response.error.value?.statusCode ||
				response.data.value == false
			)
				throw response.error.value;
		},
	},
});
