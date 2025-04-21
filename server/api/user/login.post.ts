import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";
import { log } from "~/digitalniweb-custom/helpers/logger";
import type { loginInformation } from "~/digitalniweb-types";
import type {
	commonError,
	customLogObject,
} from "~/digitalniweb-types/customHelpers/logger";
import { userLoginData } from "../../../custom/helpers/usersAuth";
import type { InferAttributes } from "sequelize";
import type { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import type { msCallOptions } from "~/digitalniweb-types/custom/helpers/remoteProcedureCall";

export default eventHandler(async (event) => {
	try {
		let ua = getHeader(event, "user-agent");
		if (!ua)
			throw {
				type: "routing",
				status: "warning",
				error: "User-agent not defined while logging in.",
			} as customLogObject;

		let body = (await readBody(event)) as loginInformation &
			resourceIdsType;
		body.ua = ua;

		let callOptions = {
			name: "users",
			method: "POST",
			path: "/api/users/authenticate",
			data: body,
		} as msCallOptions;

		if (body.usersMsId) callOptions.id = body.usersMsId;
		else callOptions.scope = "all";

		let data = await microserviceCall<InferAttributes<User>>(callOptions);

		if (data?.status >= 400) {
			event.node.res.statusCode = data.status;
			return data.data;
		}

		if (!data.data) return;
		return await userLoginData(
			data.data,
			Number(data?.headers?.["x-ms-id"]),
			true
		);

		// if (data?.status >= 400) event.node.res.statusCode = data.status;

		// let responseData = data.data; // if data.status >= 400 -> commonError

		// if (!responseData || typeof data.headers === "undefined")
		// 	throw {
		// 		type: "routing",
		// 		status: "warning",
		// 		error: "No response data while logging in.",
		// 		code: 500,
		// 	} as customLogObject;
		// if ("code" in responseData && responseData.code) return responseData;
	} catch (error: any) {
		if (error?.status >= 400 && error?.status < 500) {
			event.node.res.statusCode = error.status;
			return {
				code: error.status,
				message: "Unauthorized behaviour while logging in",
				...error.response.data,
			} as commonError;
		}

		if (error?.status >= 500)
			log({
				type: "routing",
				error,
			});
		return {
			code: 500,
			message: "Something went wrong while logging in!",
			...error.response.data,
		} as commonError;
	}
});
