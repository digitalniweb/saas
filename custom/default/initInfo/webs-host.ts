import { CreationAttributes } from "sequelize";
import { webinformationChannels } from "~/digitalniweb-types";
import { WebInformation } from "~/digitalniweb-types/models/content";

export const webInformation: Omit<
	CreationAttributes<WebInformation>,
	"websiteId" | "websitesMsId"
>[] = [
	{
		name: "name",
		value: "Digitální web",
	},
	{
		name: "description",
		value: "Tvorba moderních webových stránek, aplikací, hosting, SEO",
	},
	{
		name: "motto",
		value: "Buďte digitální",
	},
	{
		name: "image",
		value: "/files/files/default/digitalniweb.jpg",
	},
	{
		name: "logo",
		value: "/files/files/default/logo.jpg",
	},
	{
		name: "favicon",
		value: "/files/files/default-favicon-dw.png",
	},
	{
		name: "owner",
		value: "Bc. Tomáš Koudelka",
	},
	{
		name: "tin",
		value: "03059529",
	},
	{
		name: "vatId",
		value: "",
	},
	{
		name: "country",
		value: "Česká republika",
	},
	{
		name: "city",
		value: "Prostějov",
	},
	{
		name: "zip",
		value: "79604",
	},
	{
		name: "streetAddress",
		value: "Václava Špály",
	},
	{
		name: "landRegistryNumber",
		value: "0123",
	},
	{
		name: "houseNumber",
		value: "1",
	},
	{
		name: "addressPattern",
		value: "CITY, ZIP, STREET HOUSENUMBER",
	},
	{
		name: "telephone",
		value: "+420777123546789",
	},
	{
		name: "email",
		value: "email@digitalniweb.cz",
	},
	{
		name: "bankAccountNumber",
		value: "",
	},
	{
		name: "bankCode",
		value: "",
	},
	{
		name: "bankName",
		value: "",
	},
	{
		name: "name",
		value: "Digital web",
	},
	{
		name: "image",
		value: "/files/files/default/digitalniweb.jpg",
	},
	{
		name: "logo",
		value: "/files/files/default/logo.jpg",
	},
	{
		name: "titlePostfix",
		value: "Digitální web",
	},
	{
		name: "socialChannels",
		value: JSON.stringify([] as webinformationChannels),
	},
];
