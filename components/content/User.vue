<template>
	<v-row align="center" justify="center" class="my-5 pt-5">
		<v-col cols="12">
			<v-card class="elevation-12">
				<v-toolbar
					color="primary"
					prominent
					flat
					src="https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
				>
					<v-overlay class="absolute" z-index="0"></v-overlay>
					<v-toolbar-title class="relative white--text">
						{{ headline }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form ref="form" lazy-validation :disabled="disabled">
						<v-row v-if="formdata.Tenant">
							<v-col cols="12" lg="4" v-if="loggedIn">
								<v-card
									img="https://images.pexels.com/photos/50987/money-card-business-credit-card-50987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
									to="/"
									hover
								>
									<v-overlay
										absolute
										z-index="0"
										light
									></v-overlay>
									<v-card-title
										class="text-h4 white--text relative justify-center"
										v-if="formdata.credit !== null"
									>
										{{ formdata.credit }}
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
							<v-col cols="12" lg="4" v-if="loggedIn">
								<!-- :to="
										getModulePath({
											module: 'tenant-websites',
											returnString: true,
										})
									" -->
								<v-card
									img="https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
									height="100%"
									class="d-flex justify-center align-center"
									hover
								>
									<v-overlay
										absolute
										z-index="0"
										light
									></v-overlay>
									<v-card-title
										class="text-h4 white--text relative"
									>
										Moje weby
									</v-card-title>
								</v-card>
							</v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-0">Osobní údaje</h2>
							</v-col>
							<v-col cols="12" md="2">
								<v-text-field
									id="academicDegree"
									label="Titul"
									name="academicDegree"
									counter="10"
									prepend-inner-icon="mdi-school"
									v-model="formdata.Tenant.academicDegree"
									dense
								/>
							</v-col>
							<v-col cols="12" md="5">
								<v-text-field
									id="firstName"
									label="Křestní jméno"
									counter="30"
									name="firstName"
									prepend-inner-icon="mdi-account"
									v-model="formdata.Tenant.firstName"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 1) ||
											'Vyplňte prosím Vaše jméno',
									]"
									validate-on="blur"
									dense
								/>
							</v-col>
							<v-col cols="12" md="5">
								<v-text-field
									id="lastName"
									label="Příjmení"
									name="lastName"
									counter="30"
									prepend-inner-icon="mdi-account"
									v-model="formdata.Tenant.lastName"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 1) ||
											'Vyplňte prosím Vaše příjmení',
									]"
									validate-on="blur"
									dense
								/>
							</v-col>
							<v-col cols="12">
								<v-text-field
									id="telephone"
									label="Telefonní číslo"
									name="telephone"
									counter="20"
									prepend-inner-icon="mdi-cellphone"
									v-model="formdata.Tenant.telephone"
									:rules="isMobilePhone()"
									validate-on="blur"
									dense
							/></v-col>
							<v-col cols="12">
								<v-select
									:items="countries"
									label="Stát"
									v-model="selectedCountry"
									item-title="text"
									item-value="id"
									prepend-inner-icon="mdi-map"
									dense
									disabled
								></v-select>
							</v-col>
							<v-col cols="12" md="8">
								<v-text-field
									id="city"
									label="Město"
									name="city"
									prepend-inner-icon="mdi-map-marker"
									v-model="formdata.Tenant.city"
									counter="50"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 2) ||
											'Vyplňte prosím město',
									]"
									validate-on="blur"
									dense
							/></v-col>
							<v-col cols="12" md="4">
								<v-text-field
									id="zip"
									label="PSČ"
									name="zip"
									counter="10"
									prepend-inner-icon="mdi-map-marker"
									v-model="formdata.Tenant.zip"
									:rules="isPostalCode()"
									validate-on="blur"
									dense
							/></v-col>
							<v-col cols="12" md="6">
								<v-text-field
									id="streetAddress"
									label="Ulice"
									name="streetAddress"
									counter="50"
									prepend-inner-icon="mdi-map-marker"
									v-model="formdata.Tenant.streetAddress"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											(v && v.length > 3) ||
											'Vyplňte prosím ulici',
									]"
									validate-on="blur"
									dense
							/></v-col>
							<v-col cols="12" md="3">
								<v-text-field
									id="houseNumber"
									label="Číslo orientační"
									name="houseNumber"
									prepend-inner-icon="mdi-map-marker"
									v-model="formdata.Tenant.houseNumber"
									:rules="[
										(v) =>
											!!v || 'Vyplňte prosím toto pole',
										(v) =>
											/^\d*$/.test(v || '') ||
											'Vyplňte prosím orientační číslo',
									]"
									validate-on="blur"
									dense
									counter="6"
							/></v-col>
							<v-col cols="12" md="3">
								<v-text-field
									id="landRegistryNumber"
									label="Číslo popisné"
									name="landRegistryNumber"
									prepend-inner-icon="mdi-map-marker"
									v-model="formdata.Tenant.landRegistryNumber"
									:rules="[
										(v) =>
											/^\d*$/.test(v || '') ||
											'Vyplňte prosím číslo popisné',
									]"
									validate-on="blur"
									dense
									counter="6"
							/></v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-3">
									<v-btn
										tile
										:color="
											formdata.Tenant.company === true
												? 'default'
												: 'green'
										"
										@click="formdata.Tenant.company = false"
									>
										<v-icon left>mdi-account</v-icon>
										Osoba
									</v-btn>
									/
									<v-btn
										tile
										:color="
											formdata.Tenant.company === false
												? 'default'
												: 'green'
										"
										@click="formdata.Tenant.company = true"
									>
										<v-icon left>mdi-domain</v-icon>
										Firma
									</v-btn>
								</h2>
							</v-col>
							<v-card
								elevation="0"
								class="col-12 py-0"
								:disabled="!formdata.Tenant.company"
							>
								<v-row>
									<v-col cols="12">
										<v-text-field
											label="Název firmy"
											prepend-inner-icon="mdi-domain"
											type="text"
											v-model="
												formdata.Tenant.companyName
											"
											:rules="[
												(v) =>
													!formdata?.Tenant
														?.company ||
													!!formdata.Tenant
														.companyName ||
													'Vyplňte název firmy.',
											]"
											validate-on="blur"
											dense
											counter="200"
										/>
									</v-col>
									<v-col cols="6">
										<v-text-field
											label="IČO"
											prepend-inner-icon="mdi-card-account-details-outline"
											type="text"
											v-model="formdata.Tenant.tin"
											:rules="[
												(v) =>
													!formdata?.Tenant
														?.company ||
													!!formdata.Tenant.tin ||
													'Vyplňte IČO',
											]"
											validate-on="blur"
											dense
											counter="15"
										/>
									</v-col>
									<v-col cols="6">
										<v-text-field
											label="DIČ"
											prepend-inner-icon="mdi-card-account-details-outline"
											type="text"
											v-model="formdata.Tenant.vatId"
											:rules="[
												(v) =>
													!formdata?.Tenant
														?.company ||
													!!formdata.Tenant.vatId ||
													'Vyplňte DIČ',
											]"
											validate-on="blur"
											dense
											counter="15"
										/>
									</v-col>
								</v-row>
							</v-card>
						</v-row>
						<v-row>
							<v-col cols="12" class="pb-0 mt-10">
								<h2 class="overline mb-0">
									Přihlašovací údaje
								</h2>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Email (bude sloužit jako přihlašovací údaj)"
									prepend-inner-icon="mdi-email"
									type="email"
									v-model="formdata.email"
									:rules="emailRules()"
									validate-on="blur"
									dense
									counter="100"
								/>
							</v-col>

							<v-col cols="12" md="6">
								<v-text-field
									id="password"
									label="Heslo"
									name="password"
									prepend-inner-icon="mdi-lock"
									v-model="password"
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
									dense
								/>
								<CustomPasswordScore :password="password" />
							</v-col>
							<v-col cols="12" md="6">
								<v-text-field
									id="passwordCheck"
									label="Ověření hesla"
									name="passwordCheck"
									prepend-inner-icon="mdi-lock"
									v-model="passwordCheck"
									:rules="[
										passwordCheck === password ||
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
									dense
								/>
							</v-col>
							<v-col cols="12" class="pb-0">
								<h2 class="overline mb-0">Dodatečné údaje</h2>
							</v-col>
							<v-col cols="12">
								<v-checkbox
									v-model="
										formdata.Tenant.subscribeNewsletters
									"
									label="Chci dostávat novinky formou newsletteru"
									dense
									v-if="formdata.Tenant"
								/>
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
		Tenant as TenantType,
		User as UserType,
	} from "~/digitalniweb-types/models/users";
	import isMobilePhoneVal from "validator/es/lib/isMobilePhone";
	import isPostalCodeVal from "validator/es/lib/isPostalCode";

	const { isStrongPassword, generatePassword } = useStrongPassword();

	type additionalFormdataOptions = {
		agreement: boolean;
		passwordCheck: string;
	};

	const loggedIn = ref(false);

	const disabled = ref(false);

	const headline = ref("headline");
	const formdata = ref({
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
		email: "test@test.cz",
	} as UserType & additionalFormdataOptions);

	const countries = ref([{ id: 1, text: "Česká republika" }]);
	const selectedCountry = ref(
		countries.value.find(
			(country) => country.id === formdata.value?.Tenant?.countryId
		)
	);

	const password = ref("");
	const passwordCheck = ref("");
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
	const emailRules = () => [
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) =>
			/.+@.+\..+/.test(v) || "Zadejte prosim platné přihlašovací údaje",
	];
	const passwordRules = () => [
		(v: string) => !!v || "Vyplňte prosím toto pole",
		(v: string) => isStrongPassword(v) || "Zadejte prosím silné heslo",
	];
	const passwordRulesNotMandatory = () => [
		(v: string) =>
			!!!v || isStrongPassword(v) || "Zadejte prosím silné heslo",
	];
	const generateStrongPassword = async () => {
		let generatedPassword = await generatePassword();
		password.value = generatedPassword;
		passwordCheck.value = generatedPassword;
	};
	const saveUser = () => {};
	const registerUser = () => {};
</script>
