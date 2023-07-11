"use strict";

import { DataTypes } from "sequelize";

import db from "../index.js";

import { AppAdminMenu } from "../../../digitalniweb-types/models/apps.js";

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
