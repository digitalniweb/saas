import { verifyRefreshToken } from "~/custom/verifyTokens";
import { log } from "~/digitalniweb-custom/helpers/logger";
import type { commonError } from "~/digitalniweb-types/customHelpers/logger";
import type { tokensJWT } from "~/digitalniweb-types/users";

export default eventHandler(async (event) => {
	try {
		let { refreshToken } = (await readBody(event)) as tokensJWT;
		if (!refreshToken) return;
		let data = await verifyRefreshToken(refreshToken);
		return data;
	} catch (error: any) {
		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});

		event.node.res.statusCode = error?.status ?? 500;
		return {
			code: error?.status ?? 500,
			message: "Something went wrong while verifying refresh token!",
		} as commonError;
	}
});
