import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import { loginInformation } from "~/digitalniweb-types";
import {
	commonError,
	customLogObject,
} from "~/digitalniweb-types/customHelpers/logger";
import { userLoginData } from "../../../custom/helpers/usersAuth";

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
		if ("code" in responseData && responseData.code) return responseData;
		return userLoginData(responseData as User, true);
	} catch (error: any) {
		console.log(error);

		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});
		return {
			code: 500,
			message: "Something went wrong while logging in!",
		} as commonError;
	}
});
