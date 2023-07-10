"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { apps } from "../../../digitalniweb-types/models/apps.js";

import AppWidgetType = apps.AppWidget;

const AppWidget = db.define<AppWidgetType>(
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
