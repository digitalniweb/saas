import { QueryInterface, DataTypes } from "sequelize";

import AppAdminMenu from "../models/apps/appAdminMenu.js";
import { apps } from "../../digitalniweb-types/models/apps.js";
import AppAdminMenuType = apps.AppAdminMenu;

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppAdminMenuType>(
				AppAdminMenu.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					adminMenuId: {
						type: DataTypes.INTEGER,
						allowNull: false,
					},
				},
				{
					charset: "utf8mb4",
					collate: "utf8mb4_unicode_ci",
					transaction,
				}
			);
		});
	},

	down: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.dropTable(AppAdminMenu.tableName, {
				transaction,
			});
		});
	},
};
