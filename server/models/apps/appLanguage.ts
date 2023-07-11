"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { AppLanguage } from "../../../digitalniweb-types/models/apps";

const AppLanguage = db.define<AppLanguage>(
	"AppLanguage",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		languageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false, // createdAt, updatedAt
		paranoid: false, // deletedAt
	}
);

export default AppLanguage;
