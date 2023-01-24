import { microservices } from "../index.js";
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_NAME: microservices;
			APP_UNIQUE_NAME: string;
			APP_SAAS_HOST_APIKEY: string;
			APP_SAAS_TENANTS_APIKEY: string;
			APP_TYPE: "app" | "saas-host" | "saas-tenants";

			HOST: string;
			PORT: number;

			DB_HOST?: string;
			DB_USER?: string;
			DB_PASSWORD?: string;
			DB_NAME?: string;
			DB_DRIVER?: string;

			DEFAULT_LANGUAGE?: string;

			NODE_ENV: "development" | "production";
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
