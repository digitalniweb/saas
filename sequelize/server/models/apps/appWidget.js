"use strict";
import { DataTypes } from "sequelize";
import db from "../index.js";
const AppWidget = db.define("AppWidget", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    widgetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    paranoid: false, // deletedAt
});
export default AppWidget;
