import { verifyAccessToken } from "~/custom/verifyTokens";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";
import { tokensJWT } from "~/digitalniweb-types/users";

export default eventHandler(async (event) => {
	try {
		let { accessToken } = (await readBody(event)) as tokensJWT;
		if (!accessToken) return false;
		let data = verifyAccessToken(accessToken);

		if (!data) return false;
		return data;
	} catch (error: any) {
		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});

		event.node.res.statusCode = 500;
		return {
			code: 500,
			message: "Something went wrong while verifying access token!",
		} as commonError;
	}
});
