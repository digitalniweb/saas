"use strict";

import { DataTypes } from "sequelize";

import db from "../index";

import { apps } from "../../../digitalniweb-types/models/apps";
import AppLanguageType = apps.AppLanguage;

const AppLanguage = db.define<AppLanguageType>(
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
