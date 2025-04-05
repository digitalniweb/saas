import type { userJWT } from "../digitalniweb-types/users.js";
declare module "h3" {
	interface H3EventContext {
		verifiedUser: userJWT;
	}
}
