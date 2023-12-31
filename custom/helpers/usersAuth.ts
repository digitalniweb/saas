import jwt from "jsonwebtoken";
import { omittedLoggedUserParams } from "../../digitalniweb-custom/variables/user";
import { User } from "../../digitalniweb-types/models/users";
import { loggedUser } from "../../digitalniweb-types";
import { commonError } from "../../digitalniweb-types/customHelpers/logger";
import { getGlobalRoles } from "~/digitalniweb-custom/helpers/getGlobalData";

interface Options {
	type?: string;
	time?: string;
	refreshTokenSalt?: string;
}

const accessTokenExpireTime: string = "2m";

async function userLoginData(
	userData: User,
	addRefreshToken: boolean = false
): Promise<loggedUser | commonError> {
	try {
		let user = {} as loggedUser;
		for (const prop in userData) {
			if (!userData.hasOwnProperty(prop)) continue;
			if (
				omittedLoggedUserParams.includes(
					prop as (typeof omittedLoggedUserParams)[number]
				)
			)
				continue;
			// @ts-ignore this is correct, but typescript complains
			user[prop as keyof loggedUser] = userData[prop as keyof loggedUser];
		}

		let roles = await getGlobalRoles();
		if (!roles) return { message: "Couldn't get roles from globalData" };

		let role = roles.find((r) => r.id === user.roleId);
		if (typeof role === "undefined")
			return { message: "Role is undefined" };

		user.role = role;

		let accessToken: string = generateToken(user, {});
		if (addRefreshToken) {
			let refreshToken: string = generateToken(
				{ id: user.id },
				{
					type: "refresh",
					refreshTokenSalt: userData.refreshTokenSalt,
				}
			);
			user.refresh_token = refreshToken;
		}
		user.token = accessToken;
		return user;
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
