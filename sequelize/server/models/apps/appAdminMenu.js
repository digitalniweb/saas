"use strict";
import { DataTypes } from "sequelize";
import db from "../index.js";
const AppAdminMenu = db.define("AppAdminMenu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    adminMenuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    paranoid: false, // deletedAt
});
export default AppAdminMenu;
