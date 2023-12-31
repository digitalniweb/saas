<template>
	<v-row align="center" justify="center" class="my-5 pt-5">
		<v-col cols="12" sm="8" md="6" xl="4">
			<v-card class="elevation-12">
				<v-toolbar
					color="primary"
					prominent
					flat
					src="https://images.pexels.com/photos/6964507/pexels-photo-6964507.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
				>
					<v-overlay class="absolute" z-index="0"></v-overlay>
					<v-toolbar-title class="relative text-white"
						>Přihlásit se</v-toolbar-title
					>
				</v-toolbar>
				<v-card-text>
					<v-form ref="form" lazy-validation :disabled="disabled">
						<v-text-field
							variant="underlined"
							id="email"
							type="email"
							label="Přihlašovací údaje (email)"
							prepend-icon="mdi-account"
							v-model="formdata.email"
							:rules="useEmailRules()"
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
				<v-chip
					variant="flat"
					color="red"
					v-if="notValidLogin"
					class="mx-5"
					v-html="notValidLogin"
				></v-chip>
				<v-card-actions>
					<v-btn
						color="primary"
						@click="loginUser"
						:disabled="disabled"
						:loading="disabled"
						variant="flat"
					>
						<v-icon class="mr-2">mdi-login-variant</v-icon>
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
		</v-col>
	</v-row>
	<v-expand-transition>
		<v-row align="center" justify="center" class="my-0" v-show="showReset">
			<v-col cols="12" sm="8" md="6" xl="4">
				<v-card class="elevation-12 mb-5">
					<v-toolbar color="primary" flat>
						<v-toolbar-title>Zaslat nové heslo</v-toolbar-title>
						<v-spacer />
					</v-toolbar>
					<v-card-text>
						<v-form ref="resetForm" lazy-validation>
							<v-text-field
								variant="underlined"
								label="Přihlašovací údaje (email)"
								prepend-icon="mdi-account"
								type="email"
								v-model="formdata.emailReset"
								:rules="useEmailRules()"
								:disabled="disabled"
								validate-on-blur
								required
								@keyup.enter="resetPassword"
							/>
						</v-form>
					</v-card-text>
					<p v-if="resetSent" class="px-5">
						Pokud jste zde měli účet, pak na Vaši emailovou adresu
						byly zaslány nové přihlašovací údaje.<br />
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
							<v-icon class="mr-2"
								>mdi-email-arrow-right-outline</v-icon
							>
							Odeslat nové heslo
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-expand-transition>
</template>
<script setup lang="ts">
	import { VForm } from "vuetify/components";
	import { useUserStore } from "@/store/user";
	import { useLanguagesStore } from "@/store/languages";

	import { loginInformation } from "~/digitalniweb-types";
	const userStore = useUserStore();
	const languageStore = useLanguagesStore();

	const { strongPasswordOptions } = useStrongPassword();
	const disabled = ref(false);
	const showReset = ref(false);
	const notValidLogin = ref("");
	const resetSent = ref(false);
	const formdata = ref({
		email: "",
		password: "",
		emailReset: "",
	});
	const form = ref<InstanceType<typeof VForm>>();
	const resetForm = ref<InstanceType<typeof VForm>>();
	const loginUser = async () => {
		let blockedLoginTill = localStorage.getItem("blockedLoginTill");
		if (blockedLoginTill) {
			if (new Date() > new Date(blockedLoginTill)) {
				// Warning + time
				let formatter = new Intl.DateTimeFormat(
					languageStore.current || "en",
					{
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
					}
				);

				notValidLogin.value =
					"Před dalšími pokusy vyčkejte prosím do " +
					formatter.format(new Date(blockedLoginTill));
				return false;
			}
			localStorage.removeItem("blockedLoginTill");
		}
		let validate = await form?.value?.validate();
		if (!validate?.valid) return;
		let loginData: loginInformation = {
			email: formdata.value.email, // adminWrong@test.cz
			password: formdata.value.password, // 123456789!aA
		};
		try {
			let userInfo = await userStore.login(loginData);
			if (userInfo !== true && userInfo?.error?.value?.data) {
				notValidLogin.value = userInfo.error.value?.data?.message || "";
				return;
			}
			notValidLogin.value = "";
			console.log(userInfo);
		} catch (error) {
			notValidLogin.value = "Něco se pokazilo.";
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
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) =>
			(v && v.length >= (strongPasswordOptions.minLength || 8)) ||
			"Zadejte prosim platné přihlašovací údaje",
	];
</script>
