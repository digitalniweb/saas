"use strict";
import { DataTypes } from "sequelize";
import db from "../index";
const AppLanguage = db.define("AppLanguage", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    paranoid: false, // deletedAt
});
export default AppLanguage;
