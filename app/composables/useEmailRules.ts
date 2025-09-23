export const useEmailRules = (required: boolean = true) => [
	(v: string) => (required && (!!v || "Vyplňte prosím toto pole")) || true,
	(v: string) =>
		v == "" ||
		/.+@.+\..+/.test(v) ||
		"Zadejte prosim platné přihlašovací údaje",
];
