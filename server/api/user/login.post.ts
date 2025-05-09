import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { User } from "~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";

import type { loginInformation } from "~/digitalniweb-types";
import { userLoginData } from "../../../custom/helpers/usersAuth";
import type { InferAttributes } from "sequelize";
import type { resourceIdsType } from "~/digitalniweb-types/apps/communication";
import type { msCallOptions } from "~/digitalniweb-types/custom/helpers/remoteProcedureCall";

export default eventHandler(async (event) => {
	let ua = getHeader(event, "user-agent");
	if (!ua) throw new Error("User-agent not defined while logging in.");

	let body = (await readBody(event)) as loginInformation & resourceIdsType;
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
});
