import { verifyRefreshToken } from "~/custom/verifyTokens";

import type { tokensJWT } from "~/digitalniweb-types/users";

export default eventHandler(async (event) => {
	let { refreshToken } = (await readBody(event)) as tokensJWT;
	if (!refreshToken) return;
	let data = await verifyRefreshToken(refreshToken);
	return data;
	// event.node.res.statusCode = error?.status ?? 500;
});
