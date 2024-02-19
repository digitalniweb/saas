<template>
	<customForm :formHeader="formHeader" :disabled="disabled">
		<v-row>
			<v-col cols="12">
				<v-text-field
					variant="underlined"
					id="name"
					:label="translations.name.cs"
					name="name"
					counter="127"
					prepend-inner-icon="mdi-domain"
					v-model="formdata.name"
					dense
				/>
				<v-text-field
					variant="underlined"
					id="mainImage"
					:label="translations.mainImage.cs"
					name="mainImage"
					counter="255"
					prepend-inner-icon="mdi-image"
					v-model="formdata.mainImage"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="logo"
					:label="translations.logo.cs"
					name="logo"
					counter="255"
					prepend-inner-icon="mdi-image"
					v-model="formdata.logo"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="favicon"
					:label="translations.favicon.cs"
					name="favicon"
					counter="255"
					prepend-inner-icon="mdi-image"
					v-model="formdata.favicon"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="googleTagManager"
					:label="translations.googleTagManager.cs"
					name="googleTagManager"
					counter="31"
					prepend-inner-icon="mdi-tag"
					v-model="formdata.googleTagManager"
					dense
				/>

				<v-checkbox
					id="googleTagManagerActive"
					:label="translations.googleTagManagerActive.cs"
					name="googleTagManagerActive"
					v-model="formdata.googleTagManagerActive"
				/>

				<v-text-field
					variant="underlined"
					id="owner"
					:label="translations.owner.cs"
					name="owner"
					counter="127"
					prepend-inner-icon="mdi-account"
					v-model="formdata.owner"
					dense
				/>
				<v-text-field
					variant="underlined"
					id="tin"
					:label="translations.tin.cs"
					name="tin"
					counter="15"
					prepend-inner-icon="mdi-card-account-details"
					v-model="formdata.tin"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="vatId"
					:label="translations.vatId.cs"
					name="vatId"
					counter="15"
					prepend-inner-icon="mdi-card-account-details"
					v-model="formdata.vatId"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="country"
					:label="translations.country.cs"
					name="country"
					counter="31"
					prepend-inner-icon="mdi-earth"
					v-model="formdata.country"
					dense
				/>
				<v-text-field
					variant="underlined"
					id="city"
					:label="translations.city.cs"
					name="city"
					counter="31"
					prepend-inner-icon="mdi-city"
					v-model="formdata.city"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="zip"
					:label="translations.zip.cs"
					name="zip"
					counter="15"
					prepend-inner-icon="mdi-home-search"
					v-model="formdata.zip"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="streetAddress"
					:label="translations.streetAddress.cs"
					name="streetAddress"
					counter="63"
					prepend-inner-icon="mdi-home-city"
					v-model="formdata.streetAddress"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="houseNumber"
					:label="translations.houseNumber.cs"
					name="houseNumber"
					counter="7"
					prepend-inner-icon="mdi-home-floor-1"
					v-model="formdata.houseNumber"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="landRegistryNumber"
					:label="translations.landRegistryNumber.cs"
					name="landRegistryNumber"
					counter="31"
					prepend-inner-icon="mdi-home-floor-2"
					v-model="formdata.landRegistryNumber"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="addressPattern"
					:label="translations.addressPattern.cs"
					name="addressPattern"
					counter="63"
					prepend-inner-icon="mdi-home-edit"
					v-model="formdata.addressPattern"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="fullAddress"
					:label="translations.fullAddress.cs"
					name="fullAddress"
					counter="255"
					prepend-inner-icon="mdi-home-map-marker"
					v-model="formdata.fullAddress"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="telephone"
					:label="translations.telephone.cs"
					name="telephone"
					counter="15"
					prepend-inner-icon="mdi-phone"
					v-model="formdata.telephone"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="email"
					:label="translations.email.cs"
					name="email"
					counter="63"
					prepend-inner-icon="mdi-email"
					v-model="formdata.email"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="bankName"
					:label="translations.bankName.cs"
					name="bankName"
					counter="31"
					prepend-inner-icon="mdi-bank"
					v-model="formdata.bankName"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="bankAccountNumber"
					:label="translations.bankAccountNumber.cs"
					name="bankAccountNumber"
					counter="31"
					prepend-inner-icon="mdi-numeric"
					v-model="formdata.bankAccountNumber"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="bankCode"
					:label="translations.bankCode.cs"
					name="bankCode"
					counter="31"
					prepend-inner-icon="mdi-numeric"
					v-model="formdata.bankCode"
					dense
				/>

				<v-text-field
					variant="underlined"
					id="bankIBAN"
					:label="translations.bankIBAN.cs"
					name="bankIBAN"
					counter="31"
					prepend-inner-icon="mdi-alphabetical-variant"
					v-model="formdata.bankIBAN"
					dense
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
	let translations = {
		name: {
			en: "Name",
			cs: "Jméno",
		},
		mainImage: {
			en: "Main image",
			cs: "Hlavní obrázek",
		},
		logo: {
			en: "Logo",
			cs: "Logo",
		},
		favicon: {
			en: "Favicon",
			cs: "Favicon",
		},
		googleTagManager: {
			en: "Google Tag Manager",
			cs: "Google Tag Manager",
		},
		googleTagManagerActive: {
			en: "Google Tag Manager Active",
			cs: "Google Tag Manager Aktivní",
		},
		owner: {
			en: "Owner",
			cs: "Majitel",
		},
		tin: {
			en: "TIN",
			cs: "IČ",
		},
		vatId: {
			en: "VAT ID",
			cs: "DIČ",
		},
		country: {
			en: "Country",
			cs: "Země",
		},
		city: {
			en: "City",
			cs: "Město",
		},
		zip: {
			en: "ZIP",
			cs: "PSČ",
		},
		streetAddress: {
			en: "Street Address",
			cs: "Ulice",
		},
		landRegistryNumber: {
			en: "Land Registry Number",
			cs: "Číslo katastrálního území",
		},
		houseNumber: {
			en: "House Number",
			cs: "Číslo domu",
		},
		addressPattern: {
			en: "Address Pattern",
			cs: "Vzor adresy",
		},
		fullAddress: {
			en: "Full Address",
			cs: "Plná adresa",
		},
		telephone: {
			en: "Telephone",
			cs: "Telefon",
		},
		email: {
			en: "Email",
			cs: "Email",
		},
		bankName: {
			en: "Bank Name",
			cs: "Název banky",
		},
		bankAccountNumber: {
			en: "Bank Account Number",
			cs: "Číslo bankovního účtu",
		},
		bankCode: {
			en: "Bank Code",
			cs: "Kód banky",
		},
		bankIBAN: {
			en: "Bank IBAN",
			cs: "Bankovní IBAN",
		},
	};
	import { useSnackBarsStore } from "~/store/snackBars";
	import { useWebInformationStore } from "~/store/webInformation";
	import { formHeader } from "~/types/components/form";
	const formHeader = ref<formHeader>({
		image: "https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
		headline: "Informace o webu",
	});

	const disabled = ref(false);
	const webInformationStore = useWebInformationStore();

	let formdataWebInformation = useFormData(webInformationStore.data);

	const formdata = ref(formdataWebInformation.dataClone);

	const saveWebInformation = async () => {
		disabled.value = true;
		let dataDifference = formdataWebInformation.dataDifference();
		if (Object.getOwnPropertyNames(dataDifference).length === 0) {
			disabled.value = false;
			useSnackBarsStore().setSnackBar({
				text: "Nebyly zaregistrovány žádné změny.",
				color: "orange",
			});
			return;
		}
		try {
			await webInformationStore.saveData(dataDifference);
			formdataWebInformation.saveDataDifference(dataDifference);
			useSnackBarsStore().setSnackBar({
				text: "Informace o webu byly uloženy.",
				color: "green",
			});
		} catch {
			useSnackBarsStore().setSnackBar({
				text: "Nepodařilo se uložit informace o webu.",
				color: "red",
				icon: "alert-circle",
			});
		}
		disabled.value = false;
	};
</script>
