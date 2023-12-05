import { microserviceCall } from "~/digitalniweb-custom/helpers/remoteProcedureCall";
import { User } from "~/digitalniweb-types/models/users";
import { readBody } from "h3";

export default eventHandler(async (event) => {
	try {
		let body = await readBody(event);

		let user = (await microserviceCall({
			name: "users",
			path: "/api/login",
			data: body,
			scope: "all",
		})) as User | null;
		return user;
	} catch (error) {}
});
