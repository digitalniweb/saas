import { DataTypes } from "sequelize";
import AppModule from "../models/apps/appModule.js";
export default {
    up: async (queryInterface) => {
        await queryInterface.sequelize.transaction(async (transaction) => {
            return await queryInterface.createTable(AppModule.tableName, {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                },
                moduleId: {
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
            return await queryInterface.dropTable(AppModule.tableName, {
                transaction,
            });
        });
    },
};
