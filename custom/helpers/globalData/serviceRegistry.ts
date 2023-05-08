/**
 * this is actually a dummy file for a real service registry in "Microservices"
 * Because I am importing this file nad functions in "digitalniweb-custom/helpers/serviceRegistryCache.ts" which is used in "Apps" and "Microservices" I need to have this file here as well. But here it is just a dummy file which mimics the real service registry in "Microservices" but returns false for all functions.
 */
import { microservices } from "~/digitalniweb-types";
import { microserviceRegistryInfo } from "~/digitalniweb-types/customFunctions/globalData";

/**
 * In "Microservices" this function returns the service registry information for a microservice
 */
export async function getServiceRegistryServices(options: {
	name?: microservices;
	id?: number;
}): Promise<microserviceRegistryInfo | undefined | false> {
	return false;
}
/**
 * In "Microservices" this function returns the service registry information for microservice "globalData"
 */
export async function getServiceRegistryInfo(): Promise<
	microserviceRegistryInfo | false
> {
	return false;
}
