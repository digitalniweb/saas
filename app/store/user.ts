import type { loginInformation } from "~~/digitalniweb-types";
import type {
	tokenType,
	tokensJWT,
	userLoginResponse,
	userStore,
} from "~~/digitalniweb-types/users";

import { useModulesStore } from "@/store/modules";

import { filterStoreparams } from "~~/custom/users";
import type { JwtPayload } from "jsonwebtoken";
import type { modules } from "~~/digitalniweb-types/functionality/modules";

interface State {
	user: userStore | null;
}

export const useUserStore = defineStore("user", {
	state: (): State => ({
		user: null,
	}),
	getters: {
		logged: (state) => !!state.user,
		role: (state) => state.user?.role?.RoleType?.name,
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
			let data = await useFetch<userLoginResponse | JwtPayload>(
				"/api/user/verifyAccessToken",
				{
					method: "POST",
					body: { accessToken } as tokensJWT,
				}
			);

			if (
				typeof data.data.value === "string" &&
				data.data.value === "TokenExpiredError"
			) {
				data = await useFetch<userLoginResponse | JwtPayload>(
					"/api/user/verifyRefreshToken",
					{
						method: "POST",
						body: { refreshToken } as tokensJWT,
					}
				);
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
		async login(data: loginInformation): Promise<true | null> {
			let { fetchData } = useApiCall();
			let loginResponse = await fetchData<userLoginResponse>(
				"/api/user/login",
				{
					body: data,
					method: "POST",
				}
			);

			if (loginResponse?.access_token)
				this.setToken(loginResponse.access_token, "access");

			if (loginResponse?.refresh_token)
				this.setToken(loginResponse.refresh_token, "refresh");

			if (!this.user) this.user = {} as userStore;
			if (!loginResponse) return null;
			this.user = await filterStoreparams(loginResponse);

			return true;
		},
		hasModule(moduleName: modules) {
			const modulesStore = useModulesStore();
			let module = modulesStore.getModule(moduleName);
			if (!module) return false;
			return this.user?.UserModulesIds?.includes(module.id);
		},
		/**
		 * User has to have all modules from list = AND
		 */
		hasModules(moduleNames: modules[]) {
			for (let index = 0; index < moduleNames.length; index++) {
				const module = moduleNames[index];
				if (!this.hasModule(module)) return false;
			}
			return true;
		},
		/**
		 * User has to have at least one module from list = OR
		 */
		hasSomeModules(moduleNames: modules[]) {
			for (let index = 0; index < moduleNames.length; index++) {
				const module = moduleNames[index];
				if (this.hasModule(module)) return true;
			}
			return false;
		},
	},
});
