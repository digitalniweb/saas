import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import {
	userJWTParams,
	userLoginResponseParams,
	userRefreshTokenParams,
} from "../../digitalniweb-custom/variables/user";
import { User } from "../../digitalniweb-types/models/users";
import {
	userJWT,
	userLoginResponse,
	userRefreshToken,
} from "../../digitalniweb-types/users";
import { commonError } from "../../digitalniweb-types/customHelpers/logger";
import { InferAttributes } from "sequelize";
import { modules } from "~/digitalniweb-types/functionality/modules";
import { getGlobalDataList } from "~/digitalniweb-custom/helpers/getGlobalData";
import AppModule from "~/server/models/apps/appModule";

interface Options {
	type?: string;
	time?: string;
	refreshTokenSalt?: string;
}

const accessTokenExpireTime: string = "5m";

async function hasPermision(event: H3Event, wantedModule: modules) {
	if (!event.context.verifiedUser) verifyUser(event);
	if (!event.context.verifiedUser) return false;
	let appModulesIds = await AppModule.findAll({
		attributes: ["moduleId"],
	});

	const moduleIds = appModulesIds.map((module) => module.moduleId);
	let modules = await getGlobalDataList<"modules", "id">(
		"modules",
		"id",
		moduleIds
	);
	if (!modules) return;
	let module = modules.find((e) => e.name === wantedModule);
	if (!module) throw "Module not found.";
	if (
		!event.context.verifiedUser.UserModulesIds?.find(
			(id) => id === module.id
		)
	)
		throw `User doesn't have permission for "${wantedModule}" module.`;
	return true;
}

async function userLoginData(
	user: InferAttributes<User>,
	usersMsId: number,
	addRefreshToken: boolean = false
): Promise<userLoginResponse | commonError> {
	try {
		if (isNaN(usersMsId))
			throw {
				message: `User login got 'usersMsId=${typeof usersMsId}'`,
			};
		let userLogged = {} as userLoginResponse;
		userLoginResponseParams.forEach((prop) => {
			if (user[prop] === undefined) return;
			(userLogged as any)[prop] = user[prop];
			// the 'as any' is shortcut for this:
			// if (prop === "id") userLogged[prop] = user[prop];
			// else if (prop === "roleId") userLogged[prop] = user[prop];
			// else if (prop === "uuid") userLogged[prop] = user[prop];
			// else if (prop === "nickname") userLogged[prop] = user[prop];
			// // etc.
			// else userLogged[prop] = user[prop];
		});
		userLogged.usersMsId = usersMsId;

		let jwtData = {} as userJWT;
		userJWTParams.forEach((prop) => {
			if (userLogged[prop] === undefined) return;
			(jwtData as any)[prop] = userLogged[prop];
		});
		let refreshTokenData = {} as userRefreshToken;
		userRefreshTokenParams.forEach((prop) => {
			if (userLogged[prop] === undefined) return;
			(refreshTokenData as any)[prop] = userLogged[prop];
		});

		let accessToken: string = generateToken(jwtData, {});
		if (addRefreshToken) {
			let refreshToken: string = generateToken(refreshTokenData, {
				type: "refresh",
				refreshTokenSalt: user.refreshTokenSalt,
			});
			userLogged.refresh_token = refreshToken;
		}
		userLogged.access_token = accessToken;
		return userLogged;
	} catch (error) {
		return {
			code: 403,
			message: "Token couldn't be generated.",
			error,
		} as commonError;
	}
}

function generateToken(data: object, options: Options = {}): string {
	let {
		type = "access",
		time = accessTokenExpireTime,
		refreshTokenSalt = "",
	} = options;
	if (type == "refresh") {
		return jwt.sign(
			data,
			process.env.APP_REFRESH_TOKEN_SECRET + refreshTokenSalt
		);
	} else {
		return jwt.sign(data, process.env.APP_ACCESS_TOKEN_SECRET, {
			expiresIn: time,
		});
	}
}

/**
 * Verifies user via Bearer header with JWT.
 *
 * On fail: Throw error.
 * It is designed to be used out of trycatch block in api routes to automatically use the refresh token
 *
 * On success: Return void.
 * "User" Is saved to "event.context.verifiedUser".
 */
function verifyUser(event: H3Event) {
	// back-end (server) jwt verification
	if (event.context.verifiedUser) return;
	let authHeaders = getHeader(event, "Authorization");
	if (!authHeaders) {
		throw createError({
			statusCode: 403,
			statusMessage: "No authorization information provided",
		});
	}
	let accessToken = authHeaders.replace("Bearer ", "");
	if (!accessToken) {
		throw createError({
			statusCode: 403,
			statusMessage: "You must be logged in",
		});
	}
	try {
		let user = jwt.verify(
			accessToken,
			process.env.APP_ACCESS_TOKEN_SECRET
		) as userJWT;
		event.context.verifiedUser = user;
	} catch (err: any) {
		if (err.name == "TokenExpiredError") {
			throw createError({
				statusCode: 401,
				statusMessage: "Token expired",
			});
		} else if (err.name == "JsonWebTokenError") {
			// someone modified the token: logout
			throw createError({
				statusCode: 401,
				statusMessage: "Invalid token",
			});
		}
	}
}

export { accessTokenExpireTime, userLoginData, verifyUser, hasPermision };
