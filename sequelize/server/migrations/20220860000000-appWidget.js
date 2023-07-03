import { DataTypes } from "sequelize";
import AppWidget from "../models/apps/appWidget.js";
export default {
    up: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.createTable(AppWidget.tableName, {
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
            }, {
                charset: "utf8mb4",
                collate: "utf8mb4_unicode_ci",
                transaction,
            });
        });
    },
    down: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.dropTable(AppWidget.tableName, {
                transaction,
            });
        });
    },
};
