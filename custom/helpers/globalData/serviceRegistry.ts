/**
 * this is actually a dummy file for a real service registry in "Microservices"
 * Because I am importing this file nad functions in "digitalniweb-custom/helpers/serviceRegistryCache.ts" which is used in "Apps" and "Microservices" I need to have this file here as well. But here it is just a dummy file which mimics the real service registry in "Microservices" but returns false for all functions.
 */
import {
	getServiceRegistryInfo as getServiceRegistryInfoType,
	getMainServiceRegistry as getMainServiceRegistryType,
} from "../../../digitalniweb-types/custom/helpers/globalData/serviceRegistry.js";

import { getServiceRegistryServices as getServiceRegistryServicesType } from "../../../digitalniweb-types/custom/helpers/globalData/serviceRegistry.js";

/**
 * In "Microservices" this function returns the service registry information for a microservice
 */
export const getServiceRegistryServices: getServiceRegistryServicesType =
	async () => false;
/**
 * In "Microservices" this function returns the service registry information for microservice "globalData"
 */
export const getServiceRegistryInfo: getServiceRegistryInfoType = async () =>
	false;

/**
 * In "globalData" microservice this function returns a 'Microservice'
 */
export const getMainServiceRegistry: getMainServiceRegistryType = async () =>
	null;
