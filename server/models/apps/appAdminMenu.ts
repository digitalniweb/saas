"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { apps } from "../../../digitalniweb-types/models/apps.js";
import AppAdminMenu = apps.AppAdminMenu;

const AppAdminMenu = db.define<AppAdminMenu>(
	"AppAdminMenu",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		adminMenuId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppAdminMenu;
