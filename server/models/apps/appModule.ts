"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import type { AppModule as AppModuleType } from "../../../digitalniweb-types/models/apps.js";

const AppModule = db.define<AppModuleType>(
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
