import { QueryInterface } from "sequelize";

import type { apps } from "../../digitalniweb-types/index.js";
// import { microserviceCall } from "../../digitalniweb-custom/helpers/remoteProcedureCall.js";
const app: Array<apps> = ["webs-host"];

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		if (!app.includes(process.env.APP_NAME as apps)) return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
				return;
				// typescript complains for some reason when I do microserviceCall (environment types don't work)
				// await microserviceCall({
				// 	name: "globalData",
				// 	path: "/api/serviceregistry/app/",
				// 	params: {
				// 		name: process.env.APP_NAME,
				// 	},
				// });

				return;
			} catch (error) {
				console.log(error);
			}
		});
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		if (!app.includes(process.env.APP_NAME as apps)) return;
		await queryInterface.sequelize.transaction(async (transaction) => {
			try {
			} catch (error) {
				console.log(error);
			}
		});
	},
};
