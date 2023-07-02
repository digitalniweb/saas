import { QueryInterface, DataTypes } from "sequelize";

import AppWidget from "../models/apps/appWidget.js";
import { apps } from "../../digitalniweb-types/models/apps.js";
import AppWidgetType = apps.AppWidget;

export default {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		await queryInterface.sequelize.transaction(async (transaction) => {
			return await queryInterface.createTable<AppWidgetType>(
				AppWidget.tableName,
				{
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: DataTypes.INTEGER,
					},
					widgetId: {
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
			return await queryInterface.dropTable(AppWidget.tableName, {
				transaction,
			});
		});
	},
};
