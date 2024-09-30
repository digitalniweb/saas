import { diff } from "deep-object-diff";
/**
 * Use as `let formdataCustomName = useFormData(object);`
 */
export const useFormData = <T extends object>(dataOriginal: T) => {
	/**
	 * use this as ref(formdataCustomName.dataClone) i.e. as data for form
	 */
	const dataClone = <Partial<T>>structuredClone(toRaw(dataOriginal));

	const dataDifference = () => diff(dataOriginal, dataClone) as Partial<T>;

	/**
	 * puts
	 */
	const saveDataDifference = (diffData: Partial<T>) => {
		for (const key in diffData) {
			if (!Object.prototype.hasOwnProperty.call(diffData, key)) return;
			if (!Object.prototype.hasOwnProperty.call(dataOriginal, key))
				return;
			if (typeof diffData[key] !== "undefined")
				dataOriginal[key] = diffData[key];
		}
	};

	return {
		dataClone,
		dataDifference,
		saveDataDifference,
	};
};
