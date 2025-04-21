<template>
	<customForm :formHeader="formHeader" :disabled="disabled">
		<v-row>
			<v-col cols="12">
				<v-text-field
					variant="underlined"
					id="name"
					:label="translate('Name')"
					name="name"
					counter="127"
					prepend-inner-icon="mdi-domain"
					v-model="formdata.name"
				/>
				<customFormPickFiles
					:object="formdata"
					property="mainImage"
					name="Main image"
					:translation="{ 'Main image': { cs: 'Hlavní obrázek' } }"
				/>
				<customFormPickFiles
					:object="formdata"
					property="logo"
					name="Logo"
				/>
				<customFormPickFiles
					:object="formdata"
					property="favicon"
					name="Favicon"
				/>

				<v-text-field
					variant="underlined"
					id="googleTagManager"
					label="Google Tag Manager"
					name="googleTagManager"
					counter="31"
					prepend-inner-icon="mdi-tag"
					v-model="formdata.googleTagManager"
				/>

				<v-switch
					id="googleTagManagerActive"
					color="green"
					inset
					:label="translate('Google Tag Manager Active')"
					name="googleTagManagerActive"
					v-model="formdata.googleTagManagerActive"
				/>

				<v-text-field
					variant="underlined"
					id="owner"
					:label="translate('Owner')"
					name="owner"
					counter="127"
					prepend-inner-icon="mdi-account"
					v-model="formdata.owner"
				/>
				<v-text-field
					variant="underlined"
					id="tin"
					:label="translate('TIN')"
					name="tin"
					counter="15"
					prepend-inner-icon="mdi-card-account-details"
					v-model="formdata.tin"
				/>

				<v-text-field
					variant="underlined"
					id="vatId"
					:label="translate('VAT ID')"
					name="vatId"
					counter="15"
					prepend-inner-icon="mdi-card-account-details"
					v-model="formdata.vatId"
				/>

				<v-text-field
					variant="underlined"
					id="country"
					:label="translate('Country')"
					name="country"
					counter="31"
					prepend-inner-icon="mdi-earth"
					v-model="formdata.country"
				/>
				<v-text-field
					variant="underlined"
					id="city"
					:label="translate('City')"
					name="city"
					counter="31"
					prepend-inner-icon="mdi-city"
					v-model="formdata.city"
				/>

				<v-text-field
					variant="underlined"
					id="zip"
					:label="translate('zip')"
					name="zip"
					counter="15"
					prepend-inner-icon="mdi-home-search"
					v-model="formdata.zip"
				/>

				<v-text-field
					variant="underlined"
					id="streetAddress"
					:label="translate('Street')"
					name="streetAddress"
					counter="63"
					prepend-inner-icon="mdi-home-city"
					v-model="formdata.streetAddress"
				/>

				<v-text-field
					variant="underlined"
					id="houseNumber"
					:label="translate('House number')"
					name="houseNumber"
					counter="7"
					prepend-inner-icon="mdi-home-floor-1"
					v-model="formdata.houseNumber"
				/>

				<v-text-field
					variant="underlined"
					id="landRegistryNumber"
					:label="translate('Land Registry Number')"
					name="landRegistryNumber"
					counter="31"
					prepend-inner-icon="mdi-home-floor-2"
					v-model="formdata.landRegistryNumber"
				/>

				<v-text-field
					variant="underlined"
					id="addressPattern"
					:label="translate('Address Pattern')"
					name="addressPattern"
					counter="63"
					prepend-inner-icon="mdi-home-edit"
					v-model="formdata.addressPattern"
				/>

				<v-text-field
					variant="underlined"
					id="fullAddress"
					:label="translate('Full Address')"
					name="fullAddress"
					counter="255"
					prepend-inner-icon="mdi-home-map-marker"
					v-model="formdata.fullAddress"
				/>

				<v-text-field
					variant="underlined"
					id="telephone"
					:label="translate('Telephone')"
					name="telephone"
					counter="15"
					prepend-inner-icon="mdi-phone"
					v-model="formdata.telephone"
				/>

				<v-text-field
					variant="underlined"
					id="email"
					:label="translate('Email')"
					name="email"
					counter="63"
					prepend-inner-icon="mdi-email"
					v-model="formdata.email"
				/>

				<v-text-field
					variant="underlined"
					id="bankName"
					:label="translate('Bank name')"
					name="bankName"
					counter="31"
					prepend-inner-icon="mdi-bank"
					v-model="formdata.bankName"
				/>

				<v-text-field
					variant="underlined"
					id="bankAccountNumber"
					:label="translate('Bank Account Number')"
					name="bankAccountNumber"
					counter="31"
					prepend-inner-icon="mdi-numeric"
					v-model="formdata.bankAccountNumber"
				/>

				<v-text-field
					variant="underlined"
					id="bankCode"
					:label="translate('Bank Code')"
					name="bankCode"
					counter="31"
					prepend-inner-icon="mdi-numeric"
					v-model="formdata.bankCode"
				/>

				<v-text-field
					variant="underlined"
					id="bankIBAN"
					:label="translate('Bank IBAN')"
					name="bankIBAN"
					counter="31"
					prepend-inner-icon="mdi-alphabetical-variant"
					v-model="formdata.bankIBAN"
				/>
				<v-btn
					color="primary"
					x-large
					block
					@click="saveWebInformation"
					:disabled="disabled"
					:loading="disabled"
				>
					<v-icon class="mr-2">mdi-check</v-icon>
					Uložit
				</v-btn>
			</v-col>
		</v-row>
	</customForm>
</template>
<script setup lang="ts">
	import { useSnackBarsStore } from "~/store/snackBars";
	let snackBarStore = useSnackBarsStore();

	let translations = {
		"Main image": {
			cs: "Hlavní obrázek",
		},
		"Google Tag Manager Active": {
			cs: "Google Tag Manager Aktivní",
		},
		Owner: {
			cs: "Majitel",
		},
		TIN: {
			cs: "IČ",
		},
		"VAT ID": {
			cs: "DIČ",
		},
		Country: {
			cs: "Země",
		},
		ZIP: {
			cs: "PSČ",
		},
		"Street Address": {
			cs: "Ulice",
		},
		"Land Registry Number": {
			cs: "Číslo katastrálního území",
		},
		"House number": {
			cs: "Číslo domu",
		},
		"Address Pattern": {
			cs: "Vzor adresy",
		},
		"Full Address": {
			cs: "Celá adresa",
		},
		"Bank name": {
			cs: "Název banky",
		},
		"Bank Account Number": {
			cs: "Číslo bankovního účtu",
		},
		"Bank Code": {
			cs: "Kód banky",
		},
		"Bank IBAN": {
			cs: "Bankovní IBAN",
		},
	};

	const { translate } = useTranslations(translations);

	import { useWebInformationStore } from "~/store/webInformation";
	import type { formHeader } from "~/types/components/form";
	const formHeader = ref<formHeader>({
		image: "https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		headline: "Informace o webu",
	});

	const disabled = ref(false);
	const webInformationStore = useWebInformationStore();

	let formDataFunctions = useFormData();

	let formdataWebInformation = formDataFunctions.cloneData(
		webInformationStore.data
	);

	const formdata = ref(formdataWebInformation);

	const saveWebInformation = async () => {
		disabled.value = true;
		let dataDifference = formDataFunctions.dataDifference(
			webInformationStore.data,
			formdataWebInformation
		);
		if (Object.getOwnPropertyNames(dataDifference).length === 0) {
			disabled.value = false;
			snackBarStore.setSnackBar({
				text: translate("NoChangeMade"),
				color: "orange",
			});
			return;
		}
		try {
			let saveDataResponse =
				await webInformationStore.saveData(dataDifference);
			if (!saveDataResponse || !saveDataResponse[0]) throw "err";

			formDataFunctions.saveDataDifference(
				webInformationStore.data,
				dataDifference
			);
			snackBarStore.setSnackBar({
				text: "Informace o webu byly uloženy.",
				color: "green",
			});
		} catch {
			snackBarStore.setSnackBar({
				text: "Nepodařilo se uložit informace o webu.",
				color: "red",
				icon: "alert-circle",
			});
		}
		disabled.value = false;
	};
</script>
