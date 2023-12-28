// import { defineStore } from "pinia";
// import jwt from "jsonwebtoken";
import { loggedUser, loginInformation } from "~/digitalniweb-types";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";
import { User } from "~/digitalniweb-types/models/users";

interface State {
	token: string | null;
	user: loggedUser | null;
}

export const useUserStore = defineStore("user", {
	state: (): State => ({
		token: null,
		user: null,
	}),
	actions: {
		setToken(token: string) {
			this.token = token;
			// this.user = jwt.decode(token) as loggedUser;
		},
		logout() {
			this.token = null;
			this.user = null;
		},
		async login(data: loginInformation) {
			console.log("data", data);
			let loginResponse = await useFetch<User, commonError>(
				"/api/user/login",
				{
					method: "POST",
					body: data,
				}
			);
			// console.log("user", loginResponse.data?.value);
			// console.log("err", loginResponse?.error?.value?.data);
			return loginResponse;
		},
	},
});
