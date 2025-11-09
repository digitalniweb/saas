import { diff } from "deep-object-diff";
import deepToRaw from "~~/custom/helpers/toRawDeep";
/**
 * Use as `let formdataCustomName = useFormData(object);`
 */
export const useFormData = () => {
	/**
	 * use this as ref(formdataCustomName.dataClone) i.e. as data for form
	 */
	const cloneData = <T extends Record<string, any>>(dataOriginal: T) =>
		// JSON.parse(JSON.stringify(dataOriginal));
		// structuredClone(toRaw(dataOriginal));
		structuredClone(deepToRaw(dataOriginal));

	const dataDifference = <T extends Record<string, any>>(
		dataOriginal: T,
		dataClone: T
	) => diff(dataOriginal, dataClone) as Partial<T>;

	/**
	 * puts diffData to dataOriginal by mutating dataOriginal object
	 */
	const saveDataDifference = <T extends Record<string, any>>(
		dataOriginal: T,
		diffData: Partial<T>
	) => {
		for (const key in diffData) {
			if (!Object.prototype.hasOwnProperty.call(diffData, key)) return;
			if (!Object.prototype.hasOwnProperty.call(dataOriginal, key))
				return;
			if (typeof diffData[key] !== "undefined")
				dataOriginal[key] = diffData[key];
		}
	};

	return {
		cloneData,
		dataDifference,
		saveDataDifference,
	};
};
