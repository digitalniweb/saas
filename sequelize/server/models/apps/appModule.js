"use strict";
import { DataTypes } from "sequelize";
import db from "../index.js";
const AppModule = db.define("AppModule", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    paranoid: false, // deletedAt
});
export default AppModule;
