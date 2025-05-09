import { verifyAccessToken } from "~/custom/verifyTokens";

import type { tokensJWT } from "~/digitalniweb-types/users";

export default eventHandler(async (event) => {
	let { accessToken } = (await readBody(event)) as tokensJWT;
	if (!accessToken) return false;
	let data = verifyAccessToken(accessToken);

	if (!data) return false;
	return data;
});
