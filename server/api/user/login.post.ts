import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { loginInformation } from "~/digitalniweb-types";
import {
	commonError,
	customLogObject,
} from "~/digitalniweb-types/customHelpers/logger";

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
		let data = await microserviceCall({
			name: "users",
			method: "POST",
			path: "/api/users/authenticate",
			data: body,
			scope: "all",
		});

		if (data?.status >= 400) event.node.res.statusCode = data.status;

		let responseData = data.data as User | commonError; // if data.status >= 400 -> commonError

		return responseData;
	} catch (error: any) {
		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});
		return false;
	}
});
