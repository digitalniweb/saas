import { loginInformation } from "~/digitalniweb-types";
import {
	tokenType,
	tokensJWT,
	userLoginResponse,
	userStore,
} from "~/digitalniweb-types/users";
import { commonError } from "~/digitalniweb-types/customHelpers/logger";
import { filterStoreparams } from "~/custom/users";
import { JwtPayload } from "jsonwebtoken";

interface State {
	user: userStore | null;
}

export const useUserStore = defineStore("user", {
	state: (): State => ({
		user: null,
	}),
	getters: {
		logged: (state) => state.user?.role?.RoleType?.name === "admin",
	},
	actions: {
		getToken(type: tokenType) {
			if (!import.meta.client) return undefined;
			return localStorage?.getItem(
				type == "access" ? "access_token" : "refresh_token"
			);
		},
		setToken(token: string, type: tokenType) {
			if (!import.meta.client) return undefined;
			localStorage?.setItem(
				type == "access" ? "access_token" : "refresh_token",
				token
			);
		},
		deleteToken(type: tokenType) {
			if (!import.meta.client) return undefined;
			localStorage?.removeItem(
				type == "access" ? "access_token" : "refresh_token"
			);
		},
		async verifyAccessToken() {
			// front-end (client) jwt verification
			if (import.meta.server) return;
			let accessToken = this.getToken("access");
			let refreshToken = this.getToken("refresh");
			if (!accessToken || !refreshToken) return;
			let data = await useFetch<
				userLoginResponse | JwtPayload,
				commonError
			>("/api/user/verifyAccessToken", {
				method: "POST",
				body: { accessToken } as tokensJWT,
			});

			if (
				typeof data.data.value === "string" &&
				data.data.value === "TokenExpiredError"
			) {
				data = await useFetch<
					userLoginResponse | JwtPayload,
					commonError
				>("/api/user/verifyRefreshToken", {
					method: "POST",
					body: { refreshToken } as tokensJWT,
				});
			}
			if (!data.data.value || data.error.value) {
				this.deleteToken("access");
				this.deleteToken("refresh");
				return;
			}
			if (!this.user) this.user = {} as userStore;
			if (!data?.data?.value) return null;
			this.user = await filterStoreparams(data.data.value);
		},
		logout() {
			this.user = null;
			this.deleteToken("access");
			this.deleteToken("refresh");
		},
		async login(data: loginInformation) {
			let loginResponse = await useFetch<userLoginResponse, commonError>(
				"/api/user/login",
				{
					method: "POST",
					body: data,
					// this shouldn't be here but in calls which need authorization/authentication
					// headers: {
					// 	...useAddJWTAuthHeader(),
					// },
				}
			);

			// if error
			if (loginResponse?.error?.value?.data) return loginResponse;

			if (loginResponse.data?.value?.access_token)
				this.setToken(loginResponse.data.value.access_token, "access");

			if (loginResponse.data?.value?.refresh_token)
				this.setToken(
					loginResponse.data.value.refresh_token,
					"refresh"
				);

			if (!this.user) this.user = {} as userStore;
			if (!loginResponse?.data?.value) return null;
			this.user = await filterStoreparams(loginResponse.data.value);

			return true;
		},
	},
});
