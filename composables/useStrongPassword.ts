import isStrongPasswordValidator from "validator/es/lib/isStrongPassword";
import { StrongPasswordOptions } from "validator";
import { generatePassword as generateStrongPassword } from "~/digitalniweb-custom/functions/randomGenerator";

import { useSnackBarsStore } from "@/store/snackBars";
import type { languages } from "~/digitalniweb-types";

type strongPasswordOptions = StrongPasswordOptions & {
	returnScore?: false | undefined;
};
export const useStrongPassword = () => {
	const store = useSnackBarsStore();
	const strongPasswordOptions: strongPasswordOptions = {
		minLength: 12,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	};
	const passwordRegisterRules = (lang: languages = "cs") => {
		let message = {
			cs: `Zadejte prosím silné heslo (minimálně ${strongPasswordOptions.minLength} znaků, z toho minimálně ${strongPasswordOptions.minLowercase} malé a ${strongPasswordOptions.minUppercase} velké písmeno, ${strongPasswordOptions.minNumbers} číslice, ${strongPasswordOptions.minSymbols} symbol)`,
		} as { [key in languages]: string };
		return message[lang];
	};

	const isStrongPassword = (
		password = "",
		options = strongPasswordOptions
	) => {
		return isStrongPasswordValidator(password, options);
	};
	const getPasswordScore = (
		password = "",
		options = strongPasswordOptions
	): number => {
		return isStrongPasswordValidator(password, {
			...options,
			returnScore: true,
		});
	};

	const generatePassword = async (
		passwordMinLength = 12,
		passwordMaxLength = 20
	) => {
		let password = generateStrongPassword(
			passwordMinLength,
			passwordMaxLength
		);

		try {
			await navigator.clipboard.writeText(password);
			store.setSnackBar({
				text: "Heslo bylo vygenerováno a uloženo do Vaší schránky.<br> Uložte si jej na bezpečné místo pomocí kláves ctrl+v",
				icon: "check",
				color: "light-green",
				timeout: 10000,
			});
		} catch (err) {
			store.setSnackBar({
				text: "Heslo bylo vygenerováno. Prosím zkopírujte si jej a uložte na bezpečné místo.",
				icon: "alert-circle-check-outline",
				color: "light-blue",
				timeout: 10000,
			});
		}
		return password;
	};

	return {
		strongPasswordOptions,
		isStrongPassword,
		getPasswordScore,
		generatePassword,
		passwordRegisterRules,
	};
};
