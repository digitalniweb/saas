"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { AppWidget } from "../../../digitalniweb-types/models/apps.js";

const AppWidget = db.define<AppWidget>(
	"AppWidget",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		widgetId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppWidget;
