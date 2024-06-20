import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to) => {
	if (import.meta.server) return;
	if (!to.path.startsWith("/admin")) {
		return;
	}
	const user = useUserStore();

	if (user?.$state.user?.role?.RoleType?.name !== "admin") {
		// !!! this doesn't account language - need to be done
		return await navigateTo("/login");
	}
});
