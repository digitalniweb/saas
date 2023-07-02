"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { apps } from "../../../digitalniweb-types/models/apps.js";
import AppModule = apps.AppModule;

const AppModule = db.define<AppModule>(
	"AppModule",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppModule;
