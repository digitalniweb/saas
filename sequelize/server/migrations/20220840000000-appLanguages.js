import { DataTypes } from "sequelize";
import AppLanguage from "../models/apps/appLanguage.js";
export default {
    up: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.createTable(AppLanguage.tableName, {
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
            }, {
                charset: "utf8mb4",
                collate: "utf8mb4_unicode_ci",
                transaction,
            });
        });
    },
    down: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.dropTable(AppLanguage.tableName, {
                transaction,
            });
        });
    },
};
