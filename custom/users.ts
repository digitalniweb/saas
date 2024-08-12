import { userStoreParams } from "~/digitalniweb-custom/variables/user";
import { userStore, userLoginResponse } from "~/digitalniweb-types/users";

import { useModulesStore } from "~/store/modules";
const filterStoreparams = async function (loginResponse: userLoginResponse) {
	let userStore = {} as userStore;
	userStoreParams.forEach((prop) => {
		if (loginResponse?.[prop] === undefined) return;
		(userStore as any)[prop] = loginResponse[prop];
	});
	if (userStore.role.name === "owner") {
		// owner has all website's privileges (modules)
		let modules = useModulesStore();
		await modules.loadWebsiteModules();
		userStore.UserModulesIds = [...modules.website];
	}
	return userStore;
};
export { filterStoreparams };
