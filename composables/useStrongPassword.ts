import isStrongPasswordValidator from "validator/es/lib/isStrongPassword";
import validatorTypes from "validator";
import generator from "generate-password";

// this is gotten from "validatorTypes.isStrongPassword() 'options' parameter"
type strongPasswordOptions = validatorTypes.StrongPasswordOptions & {
	returnScore?: false | undefined;
};
export const useStrongPassword = () => {
	const strongPasswordOptions: strongPasswordOptions = {
		minLength: 12,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
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
	) => {
		return isStrongPasswordValidator(password, {
			...options,
			returnScore: true,
		});
	};

	const generatePassword = async (
		passwordMinLength = 12,
		passwordMaxLength = 20
	) => {
		let password = generator.generate({
			length: Math.floor(
				Math.random() * (passwordMaxLength - passwordMinLength) +
					passwordMinLength
			),
			lowercase: true,
			uppercase: true,
			numbers: true,
			symbols: true,
			strict: true,
		});
		// !!! needs to be done
		/* formdata.password = password;
		formdata.passwordCheck = password;

		$refs.form.resetValidation();
		try {
			await navigator.clipboard.writeText(password);
			$store.dispatch("setSnackBars", {
				text: "Heslo bylo vygenerováno a uloženo do Vaší schránky.<br> Uložte si jej na bezpečné místo pomocí kláves ctrl+v",
				icon: "check",
				color: "light-green",
				timeout: 10000,
			});
		} catch (err) {
			$store.dispatch("setSnackBars", {
				text: "Heslo bylo vygenerováno. Prosím zkopírujte si jej a uložte na bezpečné místo.",
				icon: "alert-circle-check-outline",
				color: "light-blue",
				timeout: 10000,
			});
			showPassword = true;
		} */
		return password;
	};

	return {
		strongPasswordOptions,
		isStrongPassword,
		getPasswordScore,
		generatePassword,
	};
};
