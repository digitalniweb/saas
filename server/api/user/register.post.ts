import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import type {
	commonError,
	customLogObject,
} from "~/digitalniweb-types/customHelpers/logger";
import { userLoginData } from "../../../custom/helpers/usersAuth";
import type { InferAttributes } from "sequelize";

export default eventHandler(async (event) => {
	try {
		let ua = getHeader(event, "user-agent");
		if (!ua)
			throw {
				type: "routing",
				status: "warning",
				error: "User-agent not defined while registering.",
			} as customLogObject;

		let body = (await readBody(event)) as User;

		return { ua, body };

		let data = await microserviceCall<InferAttributes<User>>({
			name: "users",
			method: "POST",
			path: "/api/users/register",
			data: body,
		});
	} catch (error: any) {
		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});
		return {
			code: 500,
			message: "Something went wrong while registering user!",
		} as commonError;
	}
});
