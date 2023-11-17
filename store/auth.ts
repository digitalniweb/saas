import { defineStore } from "pinia";
import jwt from "jsonwebtoken";

interface State {
	token: string | null;
	user: any;
}

export const useAuthStore = defineStore("auth", {
	state: (): State => ({
		token: null,
		user: null,
	}),
	actions: {
		setToken(token: string) {
			this.token = token;
			this.user = jwt.decode(token);
		},
		logout() {
			this.token = null;
			this.user = null;
		},
	},
});
