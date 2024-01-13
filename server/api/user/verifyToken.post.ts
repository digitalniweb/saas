import { log } from "~/digitalniweb-custom/helpers/logger";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";
import { tokenInfo } from "~/digitalniweb-types/users";
import jwt from "jsonwebtoken";

export default eventHandler(async (event) => {
	try {
		let { token, type } = (await readBody(event)) as tokenInfo;
		if (!token || !type) return;
		let data;
		if (type === "access") {
			data = jwt.verify(token, process.env.APP_ACCESS_TOKEN_SECRET);
		} else {
			// need to decode token to get information about user (all data as in login? or just decode access token?) and then download refreshTokenSalt from db with decoded info about user
			data = jwt.verify(token, process.env.APP_REFRESH_TOKEN_SECRET); // data = jwt.verify(token, process.env.APP_REFRESH_TOKEN_SECRET + refreshTokenSalt)
		}
		return data;
	} catch (error: any) {
		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});
		return {
			code: 500,
			message: "Something went wrong while verifying token!",
		} as commonError;
	}
});
