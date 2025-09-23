import { microserviceCall } from "~~/digitalniweb-custom/helpers/remoteProcedureCall";
import type { User } from "~~/digitalniweb-types/models/users";
import { readBody, getHeader } from "h3";

import type { InferAttributes } from "sequelize";
import type { registerUser } from "~~/digitalniweb-types/users";

export default eventHandler(async (event) => {
	let ua = getHeader(event, "user-agent");
	if (!ua) throw new Error("User-agent not defined while registering.");

	let body = (await readBody(event)) as registerUser;

	let data = await microserviceCall<InferAttributes<User>>({
		name: "users",
		method: "POST",
		path: "/api/users/register",
		data: { ...body, ua },
	});

	return data.data;
});
