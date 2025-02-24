<template>
	<v-row align="center" justify="center" class="my-5">
		<v-col cols="12" lg="4" xl="6">
			<v-card class="elevation-12">
				<v-toolbar color="primary" prominent flat>
					<template v-slot:image>
						<v-img
							src="https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
							cover
							class="overlay-dark"
						/>
					</template>
					<v-toolbar-title>
						{{ props.headline }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form ref="form" lazy-validation :disabled="disabled">
						<v-row v-if="userType === 'tenant'">
							<v-col cols="12" v-if="loggedIn">
								<v-card
									img="https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
									to="/"
									hover
								>
									<v-card-title
										class="text-h4 white--text relative justify-center"
										v-if="userStore.user?.credit !== null"
									>
										{{ userStore.user?.credit }}
										<v-icon right color="yellow" small
											>mdi-currency-sign</v-icon
										>
									</v-card-title>

									<v-card-subtitle
										class="white--text relative text-center"
									>
										Aktuální zůstatek kreditů
									</v-card-subtitle>

									<v-card-actions
										class="text-h4 white--text relative justify-center"
									>
										Dobít kredit
									</v-card-actions>
								</v-card>
							</v-col>
							<v-col cols="12" v-if="loggedIn">
								<v-card
									img="https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
									height="100%"
									class="d-flex justify-center align-center"
									hover
								>
									<v-card-title> Moje weby </v-card-title>
								</v-card>
							</v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-0">Osobní údaje</h2>
							</v-col>
							<v-col cols="12" md="2">
								<v-text-field
									variant="underlined"
									id="academicDegree"
									label="Titul"
									name="academicDegree"
									counter="10"
									prepend-inner-icon="mdi-school"
									v-model="tenantData.academicDegree"
								/>
							</v-col>
							<v-col cols="12" md="5">
								<v-text-field
									variant="underlined"
									id="firstName"
									label="Křestní jméno"
									counter="30"
									name="firstName"
									prepend-inner-icon="mdi-account"
									v-model="tenantData.firstName"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 1) ||
											'Vyplňte prosím Vaše jméno',
									]"
									validate-on="blur"
								/>
							</v-col>
							<v-col cols="12" md="5">
								<v-text-field
									variant="underlined"
									id="lastName"
									label="Příjmení"
									name="lastName"
									counter="30"
									prepend-inner-icon="mdi-account"
									v-model="tenantData.lastName"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 1) ||
											'Vyplňte prosím Vaše příjmení',
									]"
									validate-on="blur"
								/>
							</v-col>
							<v-col cols="12">
								<v-text-field
									variant="underlined"
									id="telephone"
									label="Telefonní číslo"
									name="telephone"
									counter="20"
									prepend-inner-icon="mdi-cellphone"
									v-model="tenantData.telephone"
									:rules="isMobilePhone()"
									validate-on="blur"
							/></v-col>
							<v-col cols="12">
								<v-select
									:items="countries"
									label="Stát"
									v-model="selectedCountry"
									item-title="text"
									item-value="id"
									prepend-inner-icon="mdi-map"
									disabled
								></v-select>
							</v-col>
							<v-col cols="12" md="8">
								<v-text-field
									variant="underlined"
									id="city"
									label="Město"
									name="city"
									prepend-inner-icon="mdi-map-marker"
									v-model="tenantData.city"
									counter="50"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 2) ||
											'Vyplňte prosím město',
									]"
									validate-on="blur"
							/></v-col>
							<v-col cols="12" md="4">
								<v-text-field
									variant="underlined"
									id="zip"
									label="PSČ"
									name="zip"
									counter="10"
									prepend-inner-icon="mdi-map-marker"
									v-model="tenantData.zip"
									:rules="isPostalCode()"
									validate-on="blur"
							/></v-col>
							<v-col cols="12" md="6">
								<v-text-field
									variant="underlined"
									id="streetAddress"
									label="Ulice"
									name="streetAddress"
									counter="50"
									prepend-inner-icon="mdi-map-marker"
									v-model="tenantData.streetAddress"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 3) ||
											'Vyplňte prosím ulici',
									]"
									validate-on="blur"
							/></v-col>
							<v-col cols="12" md="3">
								<v-text-field
									variant="underlined"
									id="houseNumber"
									label="Číslo orientační"
									name="houseNumber"
									prepend-inner-icon="mdi-map-marker"
									v-model="tenantData.houseNumber"
									:rules="[
										(v: number) =>
											!!v || 'Vyplňte prosím toto pole',
										(v: any | null) =>
											/^\d*$/.test(v || '') ||
											'Vyplňte prosím orientační číslo',
									]"
									validate-on="blur"
									counter="6"
								></v-text-field>
							</v-col>
							<v-col cols="12" md="3">
								<v-text-field
									variant="underlined"
									id="landRegistryNumber"
									label="Číslo popisné"
									name="landRegistryNumber"
									prepend-inner-icon="mdi-map-marker"
									v-model="tenantData.landRegistryNumber"
									:rules="[
										(v: any) =>
											/^\d*$/.test(v || '') ||
											'Vyplňte prosím číslo popisné',
									]"
									validate-on="blur"
									counter="6"
								></v-text-field>
							</v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-3">Registrovat jako</h2>
								<v-btn
									tile
									:color="
										tenantData.company === true
											? 'default'
											: 'green'
									"
									@click="
										changeTenantProperty('company', false)
									"
								>
									<v-icon left>mdi-account</v-icon>
									Osoba
								</v-btn>
								/
								<v-btn
									tile
									:color="
										tenantData.company === false
											? 'default'
											: 'green'
									"
									@click="
										changeTenantProperty('company', true)
									"
								>
									<v-icon left>mdi-domain</v-icon>
									Firma
								</v-btn>
							</v-col>
							<v-col cols="12">
								<v-card
									elevation="0"
									class="py-0"
									:disabled="!tenantData.company"
								>
									<v-row>
										<v-col cols="12">
											<v-text-field
												variant="underlined"
												label="Název firmy"
												prepend-inner-icon="mdi-domain"
												type="text"
												v-model="tenantData.companyName"
												:rules="[
													(v) =>
														!tenantData?.company ||
														!!tenantData.companyName ||
														'Vyplňte název firmy.',
												]"
												validate-on="blur"
												counter="200"
											/>
										</v-col>
										<v-col cols="6">
											<v-text-field
												variant="underlined"
												label="IČO"
												prepend-inner-icon="mdi-card-account-details-outline"
												type="text"
												v-model="tenantData.tin"
												:rules="[
													(v) =>
														!tenantData?.company ||
														!!tenantData.tin ||
														'Vyplňte IČO',
												]"
												validate-on="blur"
												counter="15"
											/>
										</v-col>
										<v-col cols="6">
											<v-text-field
												variant="underlined"
												label="DIČ"
												prepend-inner-icon="mdi-card-account-details-outline"
												type="text"
												v-model="tenantData.vatId"
												:rules="[
													(v) =>
														!tenantData?.company ||
														!!tenantData.vatId ||
														'Vyplňte DIČ',
												]"
												validate-on="blur"
												counter="15"
											/>
										</v-col>
									</v-row> </v-card
							></v-col>
						</v-row>
						<v-row>
							<v-col cols="12" class="pb-0 mt-10">
								<h2 class="overline mb-0">
									Přihlašovací údaje
								</h2>
							</v-col>
							<v-col cols="12">
								<v-text-field
									variant="underlined"
									label="Email (bude sloužit jako přihlašovací údaj)"
									prepend-inner-icon="mdi-email"
									type="text"
									v-model="userData.email"
									:rules="emailRules()"
									validate-on="blur"
									counter="100"
								/>
							</v-col>

							<v-col cols="12" md="6">
								<v-text-field
									variant="underlined"
									id="password"
									label="Heslo"
									name="password"
									prepend-inner-icon="mdi-lock"
									v-model="userData.password"
									:rules="
										type === 'registration'
											? passwordRules()
											: passwordRulesNotMandatory()
									"
									validate-on="input lazy"
									:append-inner-icon="
										'mdi-' +
										(showPassword
											? 'eye-outline'
											: 'eye-off-outline')
									"
									append-icon="mdi-head-cog-outline"
									@click:append-inner="
										() => (showPassword = !showPassword)
									"
									@click:append="generateStrongPassword()"
									:type="showPassword ? 'text' : 'password'"
								/>
								<CustomPasswordScore
									:password="userData.password"
								/>
							</v-col>
							<v-col cols="12" md="6">
								<v-text-field
									variant="underlined"
									id="passwordCheck"
									label="Ověření hesla"
									name="passwordCheck"
									prepend-inner-icon="mdi-lock"
									v-model="aditionalData.passwordCheck"
									:rules="[
										aditionalData.passwordCheck ===
											userData.password ||
											'Musí se shodovat s Vámi zadaným heslem!',
									]"
									validate-on="input lazy"
									:append-inner-icon="
										'mdi-' +
										(showPassword
											? 'eye-outline'
											: 'eye-off-outline')
									"
									@click:append-inner="
										() => (showPassword = !showPassword)
									"
									:type="showPassword ? 'text' : 'password'"
								/>
							</v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-0">Dodatečné údaje</h2>
							</v-col>
							<v-col cols="12">
								<v-checkbox
									v-model="tenantData.subscribeNewsletters"
									label="Chci dostávat novinky formou newsletteru"
									v-if="userType === 'tenant'"
								/>
								<v-checkbox
									v-model="aditionalData.agreement"
									:rules="[
										(v) =>
											!!v ||
											'Musíte souhlasit s obchodními podmínkami',
									]"
									:disabled="type === 'profile'"
								>
									<template v-slot:label>
										Souhlasím s
										<a
											href="/obchodni-podminky"
											target="_blank"
											@click.stop
											class="ml-1"
										>
											obchodními podmínkami
										</a>
									</template>
								</v-checkbox>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn
						v-if="!loggedIn"
						color="primary"
						block
						@click="registerUser"
						:disabled="disabled"
						:loading="disabled"
					>
						<v-icon class="mr-2">mdi-account-plus</v-icon>
						Registrovat
					</v-btn>
					<v-btn
						v-else
						color="primary"
						x-large
						block
						@click="saveUser"
						:disabled="disabled"
						:loading="disabled"
					>
						<v-icon class="mr-2">mdi-account-edit</v-icon>
						Uložit
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import {
		Tenant,
		Tenant as TenantType,
		User as UserType,
	} from "~/digitalniweb-types/models/users";
	import isMobilePhoneVal from "validator/es/lib/isMobilePhone";
	import isPostalCodeVal from "validator/es/lib/isPostalCode";
	import { useUserStore } from "../../../store/user";
	import { InferAttributes } from "sequelize";

	const userStore = useUserStore();

	const { isStrongPassword, generatePassword, passwordRegisterRules } =
		useStrongPassword();

	const props = defineProps<{
		headline: string;
		type: "register" | "edit";
		userType: "user" | "tenant";
	}>();

	type additionalFormdataOptions = {
		agreement: boolean;
		passwordCheck: string;
	};

	const loggedIn = ref(false);

	const disabled = ref(false);

	const userData = ref<Pick<UserType, "email" | "password">>({
		email: "",
		password: "",
	});
	type tenantRegisterType = Omit<
		InferAttributes<TenantType>,
		"id" | "UserId"
	>;
	const tenantData = ref<
		Omit<tenantRegisterType, "houseNumber" | "landRegistryNumber"> & {
			houseNumber: null | number;
			landRegistryNumber: null | number;
		}
	>({
		academicDegree: "",
		firstName: "",
		lastName: "",
		telephone: "",
		city: "",
		zip: "",
		streetAddress: "",
		countryId: 1,
		houseNumber: null,
		landRegistryNumber: null,
		company: false,
		companyName: "",
		tin: "",
		vatId: "",
		subscribeNewsletters: false,
	});
	const aditionalData = ref({
		agreement: false,
		passwordCheck: "",
	}) as Ref<additionalFormdataOptions>;

	/* const formdata = ref({
		Tenant: {
			academicDegree: "Ing.",
			firstName: "John",
			lastName: "Doe",
			telephone: "123-456-7890",
			city: "Sample City",
			zip: "12345",
			streetAddress: "123 Main Street",
			countryId: 1,
			houseNumber: 123,
			landRegistryNumber: 456,
			company: true,
			companyName: "ABC Inc.",
			tin: "123456789",
			vatId: "VAT123",
			subscribeNewsletters: true,
		} as TenantType,
		email: "",
		password: "",
		passwordCheck: "",
		agreement: false,
	} as InferAttributes<UserType> & additionalFormdataOptions); */

	const countries = ref([{ id: 1, text: "Česká republika" }]);
	const selectedCountry = ref(
		countries.value.find(
			(country) => country.id === tenantData.value?.countryId
		)
	);

	const showPassword = ref(false);

	const type = ref("registration");

	const isMobilePhone = () => [
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) =>
			isMobilePhoneVal(v || "") || "Vyplňte prosím Vaše telefonní číslo",
	];
	const isPostalCode = () => [
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) =>
			isPostalCodeVal(v || "", "any") ||
			"Vyplňte prosím Vaše poštovní směrovací číslo",
	];
	const passwordRules = () => [
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) => isStrongPassword(v) || passwordRegisterRules(),
	];
	const passwordRulesNotMandatory = () => [
		(v: string) =>
			!!!v || isStrongPassword(v) || "Zadejte prosím silné heslo",
	];
	const generateStrongPassword = async () => {
		let generatedPassword = await generatePassword();
		userData.value.password = generatedPassword;
		aditionalData.value.passwordCheck = generatedPassword;
	};
	const saveUser = () => {};
	const registerUser = () => {};

	const emailRules = () => useEmailRules();

	const changeTenantProperty = (
		property: keyof tenantRegisterType,
		value: any
	) => {
		(tenantData.value[property] as any) = value;
	};
</script>
