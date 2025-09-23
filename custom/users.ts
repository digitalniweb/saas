import { userStoreParams } from "~~/digitalniweb-custom/variables/user";
import type { userStore, userLoginResponse } from "~~/digitalniweb-types/users";

const filterStoreparams = async function (loginResponse: userLoginResponse) {
	let userStore = {} as userStore;
	userStoreParams.forEach((prop) => {
		if (loginResponse?.[prop] === undefined) return;
		(userStore as any)[prop] = loginResponse[prop];
	});
	return userStore;
};
export { filterStoreparams };
