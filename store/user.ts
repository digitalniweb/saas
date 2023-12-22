// import { defineStore } from "pinia";
// import jwt from "jsonwebtoken";
import { loggedUser, loginInformation } from "~/digitalniweb-types";

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
			let user = await useFetch("/api/user/login", {
				method: "POST",
				body: data,
			});
			console.log("user", user);
		},
	},
});
