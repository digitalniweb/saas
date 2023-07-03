import { DataTypes } from "sequelize";
import AppAdminMenu from "../models/apps/appAdminMenu.js";
export default {
    up: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.createTable(AppAdminMenu.tableName, {
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
            }, {
                charset: "utf8mb4",
                collate: "utf8mb4_unicode_ci",
                transaction,
            });
        });
    },
    down: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.dropTable(AppAdminMenu.tableName, {
                transaction,
            });
        });
    },
};
