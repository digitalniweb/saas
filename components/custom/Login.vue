<template>
	<v-card class="elevation-12">
		<v-toolbar color="primary" class="py-5">
			<template v-slot:image>
				<v-img
					src="https://images.pexels.com/photos/6964507/pexels-photo-6964507.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
					cover
					class="overlay-dark"
				/>
			</template>
			<v-toolbar-title>
				<v-icon>mdi-account-arrow-left</v-icon>
				Přihlásit se
			</v-toolbar-title>
		</v-toolbar>
		<v-card-text>
			<v-form ref="form" lazy-validation :disabled="disabled">
				<v-text-field
					variant="underlined"
					id="email"
					type="email"
					label="Přihlašovací údaje (email)"
					prepend-icon="mdi-email"
					v-model="formdata.email"
					:rules="emailRules()"
					validate-on-blur
					required
					@keyup.enter="loginUser"
					:disabled="disabled"
				/>

				<v-text-field
					variant="underlined"
					id="password"
					label="Heslo"
					name="password"
					prepend-icon="mdi-lock"
					type="password"
					v-model="formdata.password"
					:rules="passwordRules"
					validate-on-blur
					required
					@keyup.enter="loginUser"
					:disabled="disabled"
				/>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-btn
				color="primary"
				@click="loginUser"
				:disabled="disabled"
				:loading="disabled"
				variant="flat"
			>
				<v-icon class="mr-2">mdi-login</v-icon>
				Přihlásit se
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				@click="showReset = !showReset"
				class="mt-5"
				x-small
				variant="text"
				>Zapomněli jste heslo?</v-btn
			>
		</v-card-actions>
	</v-card>
	<v-expand-transition>
		<v-card class="elevation-12 my-5" v-show="showReset">
			<v-toolbar>
				<v-toolbar-title>
					<v-icon size="x-small">mdi-lock</v-icon>
					Zaslat nové heslo
				</v-toolbar-title>
				<v-spacer />
			</v-toolbar>
			<v-card-text>
				<v-form ref="resetForm" lazy-validation>
					<v-text-field
						variant="underlined"
						label="Přihlašovací údaje (email)"
						prepend-icon="mdi-email"
						type="email"
						v-model="formdata.emailReset"
						:rules="emailRules()"
						:disabled="disabled"
						validate-on-blur
						required
						@keyup.enter="resetPassword"
					/>
				</v-form>
			</v-card-text>
			<p v-if="resetSent" class="px-5">
				Pokud jste zde měli účet, pak na Vaši emailovou adresu byly
				zaslány nové přihlašovací údaje.<br />
				Pokud email nevidíte, zkontrolujte prosím
				<strong>spam</strong>
				složku.
			</p>
			<v-card-actions>
				<v-btn
					color="primary"
					@click="resetPassword"
					:disabled="disabled"
					:loading="disabled"
					variant="flat"
				>
					<v-icon class="mr-2">mdi-send</v-icon>
					Odeslat nové heslo
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-expand-transition>
</template>
<script setup lang="ts">
	import { VForm } from "vuetify/components";
	import { useUserStore } from "@/store/user";
	import { useRouter } from "vue-router";

	import type {
		loginInformation,
		wrongLoginError,
		wrongLoginErrorMessageTranslate,
	} from "~/digitalniweb-types";
	import type { commonError } from "../../digitalniweb-types/customHelpers/logger";

	const { translate } = useTranslations();

	import { useSnackBarsStore } from "~/store/snackBars";
	let snackBarStore = useSnackBarsStore();

	const router = useRouter();

	const userStore = useUserStore();

	const { strongPasswordOptions } = useStrongPassword();
	const disabled = ref(false);
	const showReset = ref(false);
	const resetSent = ref(false);
	const formdata = ref({
		email: "",
		password: "",
		emailReset: "",
	});
	const form = ref<InstanceType<typeof VForm>>();
	const resetForm = ref<InstanceType<typeof VForm>>();

	const { prettyDateTime } = useDateTime();
	import { FetchError } from "ofetch";
	const loginUser = async () => {
		let blockedLoginTill =
			localStorage.getItem("blockedLoginTill") ?? undefined;
		if (blockedLoginTill) {
			if (Date.now() < new Date(blockedLoginTill).getTime()) {
				// Warning + time
				snackBarStore.setSnackBar({
					text:
						translate("LoginErrorTooManyAttempts") +
						"<br><strong>" +
						translate("Wait till") +
						" " +
						prettyDateTime(blockedLoginTill) +
						"</strong>",
					color: "orange",
				});
				return false;
			}
			localStorage.removeItem("blockedLoginTill");
		}
		let validate = await form?.value?.validate();
		if (!validate?.valid) return;

		try {
			let loginData: loginInformation = {
				email: formdata.value.email,
				password: formdata.value.password,
				type: "tenant",
			};

			await userStore.login(loginData);

			redirectAfterLogin();
		} catch (error: unknown) {
			if (
				typeof error === "object" &&
				error !== null &&
				"data" in error
			) {
				const err = error as FetchError;
				if ((err.data as commonError).error.blockedTill)
					localStorage.setItem(
						"blockedLoginTill",
						err.data.error.blockedTill
					);
				let errorMessage = err.data.error
					?.messageTranslate as wrongLoginErrorMessageTranslate;
				let errorMessageTranslated = "";
				if (errorMessage === "LoginErrorTooManyAttempts")
					errorMessageTranslated =
						translate(errorMessage) +
						"<br><strong>" +
						translate("Wait till") +
						" " +
						prettyDateTime(err.data.error.blockedTill) +
						"</strong>";
				else
					errorMessageTranslated = translate(
						errorMessage ?? err.data.message
					);
				if (
					(err.data.error as wrongLoginError).loginAttemptsCount &&
					(err.data.error as wrongLoginError).maxLoginAttempts &&
					(err.data.error as wrongLoginError).loginAttemptsCount !=
						(err.data.error as wrongLoginError).maxLoginAttempts
				)
					errorMessageTranslated +=
						" " +
						err.data.error.loginAttemptsCount +
						"/" +
						err.data.error.maxLoginAttempts;
				snackBarStore.setSnackBar({
					text: errorMessageTranslated,
					color: "orange",
				});
				return;
			}
			snackBarStore.setSnackBar({
				text: translate("Something went wrong"),
				color: "red",
			});
		}
	};
	const resetPassword = async () => {
		const validate = await resetForm?.value?.validate();
		if (!validate?.valid) return;
		disabled.value = true;
		resetSent.value = true;
		console.log("resetPassword");
		disabled.value = false;
	};
	const passwordRules = [
		(v: string) => !!v || translate("Fill in this field"),
		(v: string) =>
			(v && v.length >= (strongPasswordOptions.minLength || 10)) ||
			translate("Please enter valid login details"),
	];

	const redirectAfterLogin = async function () {
		// !!! commented stuff is from vue 2 needs to be ported to vue 3
		if (userStore?.user?.role?.RoleType?.name === "admin") {
			// await this.$store.dispatch("getAdminmenu", { force: true });
			if (
				router.currentRoute.value.query.redirect &&
				(router.currentRoute.value.query.redirect as string).startsWith(
					"/admin"
				)
			)
				return router.push(
					router.currentRoute.value.query.redirect as string
				);
			return router.push("/admin/");
		} else if (userStore?.user?.role?.RoleType?.name === "user") {
			if (userStore?.user?.Tenant) {
				// if (
				// 	router.currentRoute.value.query.redirect &&
				// 	(router.currentRoute.value.query.redirect ===
				// 		this.getModulePath({
				// 			module: "tenant-order",
				// 			returnString: true,
				// 		}) ||
				// 		router.currentRoute.value.query.redirect ===
				// 			this.getModulePath({
				// 				module: "tenant-profile",
				// 				returnString: true,
				// 			}))
				// )
				// 	return router.push(
				// 		router.currentRoute.value.query.redirect as string
				// 	);
				// return router.push(
				// 	this.getModulePath({
				// 		module: "tenant-profile",
				// 	})
				// );
			}
			return router.push("/");
		}
	};
	const emailRules = () => useEmailRules();
</script>
