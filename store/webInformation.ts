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
			this.data = {
				name: "name",
				city: "city",
				country: "country",
				email: "email",
				fullAddress: "fullAddress",
				googleTagManagerActive: false,
				houseNumber: "3",
				owner: "owner",
				streetAddress: "streetAddress",
				telephone: "telephone",
				websiteId: 1,
				websitesMsId: 1,
				zip: "zip",
				id: 1,
			};
			return;
			// const website = useWebsiteStore();
			// // const languages = useLanguagesStore();
			// let webInfo = await useFetch<InferAttributes<WebInformation>>(
			// 	`/api/website/webInformation?contentMsId=${website.data?.contentMsId}&id=${website.data?.id}`
			// );
			// if (!webInfo.data.value) return false;
			// this.data = webInfo.data.value;
		},
		async saveData(data: Partial<InferAttributes<WebInformation>>) {
			let response = await useFetch<boolean>(
				"/api/website/webinformation.patch.ts",
				{
					method: "PATCH",
					body: {
						data,
						websiteId: this.data.websiteId,
						websitesMsId: this.data.websitesMsId,
					},
				}
			);
			console.log(response.data.value);
			console.log(response.error.value);

			if (
				response.error.value?.statusCode ||
				response.data.value == false
			)
				throw response.error.value;
		},
	},
});
