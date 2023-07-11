import { QueryInterface, DataTypes } from "sequelize";

import AppLanguage from "../models/apps/appLanguage.js";
import { AppLanguage as AppLanguageType } from "../../digitalniweb-types/models/apps.js";

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppLanguageType>(
				AppLanguage.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					languageId: {
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
			return await queryInterface.dropTable(AppLanguage.tableName, {
				transaction,
			});
		});
	},
};
