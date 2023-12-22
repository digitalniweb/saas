import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { loginInformation } from "~/digitalniweb-types";
import { customLogObject } from "~/digitalniweb-types/customHelpers/logger";

export default eventHandler(async (event) => {
	try {
		let ua = getHeader(event, "user-agent");
		if (!ua)
			throw {
				type: "routing",
				status: "warning",
				error: "User-agent not defined while logging in.",
			} as customLogObject;

		let body = (await readBody(event)) as loginInformation;
		body.ua = ua;
		let { data: userData }: { data: User } = await microserviceCall({
			name: "users",
			method: "POST",
			path: "/api/users/authenticate",
			data: body,
			scope: "all",
		});
		let user = userData;
		return user;
	} catch (error: any) {
		log({
			type: "routing",
			error,
		});
		return false;
	}
});
