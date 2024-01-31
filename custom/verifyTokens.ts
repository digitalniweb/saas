import { userRefreshToken } from "~/digitalniweb-types/users";
import jwt from "jsonwebtoken";
import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { User } from "~/digitalniweb-types/models/users";
import { InferAttributes } from "sequelize";
import { userLoginData } from "~/custom/helpers/usersAuth";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";
/**
 *
 * @param token refresh token
 * @throws {commonError | jwt.JsonWebTokenError}
 */
const verifyRefreshToken = async function (token: string) {
	// need to decode token to get information about user (all data as in login? or just decode access token?) and then download refreshTokenSalt from db with decoded info about user
	let refreshTokenData = jwt.decode(token) as userRefreshToken | null;

	if (refreshTokenData === null) return false;
	try {
		let userData = await microserviceCall<InferAttributes<User>>({
			name: "users",
			method: "GET",
			path: "/api/users/id/" + refreshTokenData.id,
			id: refreshTokenData.usersMsId,
		});

		jwt.verify(
			token,
			process.env.APP_REFRESH_TOKEN_SECRET +
				userData.data?.refreshTokenSalt
		);

		let responseData = userData.data;
		if (!responseData) return false;
		return await userLoginData(
			responseData,
			refreshTokenData.usersMsId,
			false
		);
	} catch (error: unknown) {
		if (error instanceof jwt.JsonWebTokenError) {
			if (error.name == "TokenExpiredError") {
			} else if (error.name == "JsonWebTokenError") {
				// someone modified the token: logout
				return false;
			} else {
				throw error;
			}
		} else
			throw {
				error,
				message: "Error while verifying refresh token.",
			} as commonError;
	}
};

/**
 *
 * @param token access token
 * @throws {commonError | jwt.JsonWebTokenError}
 */
const verifyAccessToken = function (token: string) {
	let data;
	try {
		data = jwt.verify(token, process.env.APP_ACCESS_TOKEN_SECRET);
		return data;
	} catch (error: unknown) {
		if (error instanceof jwt.JsonWebTokenError) {
			if (error.name == "TokenExpiredError") {
				return "TokenExpiredError";
			} else if (error.name == "JsonWebTokenError") {
				// someone modified the token: logout
				return false;
			} else {
				throw error;
			}
		} else
			throw {
				error,
				message: "Error while verifying access token.",
			} as commonError;
	}
};
export { verifyAccessToken, verifyRefreshToken };
