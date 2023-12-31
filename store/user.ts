import { loggedUser, loginInformation } from "~/digitalniweb-types";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";

interface State {
	user: loggedUser | null;
}

export const useUserStore = defineStore("user", {
	state: (): State => ({
		user: null,
	}),
	actions: {
		setToken(token: string) {
			if (this.user) this.user.token = token;
			// this.user = jwt.decode(token) as loggedUser;
		},
		logout() {
			this.user = null;
		},
		async login(data: loginInformation) {
			console.log("data", data);
			let loginResponse = await useFetch<loggedUser, commonError>(
				"/api/user/login",
				{
					method: "POST",
					body: data,
				}
			);

			// if error
			if (loginResponse?.error?.value?.data) return loginResponse;

			// else user
			this.user = loginResponse.data?.value;
			return true;
		},
	},
});
