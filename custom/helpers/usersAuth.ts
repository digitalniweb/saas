import jwt from "jsonwebtoken";
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
import { getGlobalRoles } from "~/digitalniweb-custom/helpers/getGlobalData";

interface Options {
	type?: string;
	time?: string;
	refreshTokenSalt?: string;
}

const accessTokenExpireTime: string = "2m";

async function userLoginData(
	user: User,
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

		let roles = await getGlobalRoles();
		if (!roles) return { message: "Couldn't get roles from globalData" };

		let role = roles.find((r) => r.id === userLogged.roleId);
		if (typeof role === "undefined")
			return { message: "Role is undefined" };

		userLogged.role = role;
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

export { accessTokenExpireTime, userLoginData };
