// // !!! this needs to be done! This is just copy pasted from vue 2 project

// let webInfo = ref({} as webInformation);
// type replaceWithObjectMatchesOptions = {
// 	string: string;
// 	regexStringPattern: string;
// 	regexOptions: string;
// 	regexArray: string[];
// 	matchObject: { [key: string]: string };
// 	mapObject: { [key: string]: string };
// };
// export function replaceWithObjectMatches(
// 	options: replaceWithObjectMatchesOptions
// ) {
// 	options.string = options.string || ""; // original string - 'stat, mesto' -> 'CZ, Praha'
// 	options.regexStringPattern = options.regexStringPattern || ""; // should be string format not /(regex)/ format -> '(stat|mesto)'
// 	options.regexOptions = options.regexOptions || "g";
// 	options.regexArray = options.regexArray || []; // array to string: ['STAT', 'MESTO'] -> '(STAT|MESTO)'
// 	if (options.regexArray) {
// 		options.regexStringPattern = "(" + options.regexArray.join("|") + ")";
// 	}
// 	options.matchObject = options.matchObject || {}; // matchObject:{country: "Česká republika", city: "Praha"}
// 	options.mapObject = options.mapObject || {}; // mapObject = {'STAT': 'country', 'MESTO': 'city'}
// 	// (country|city|zip|streetAddress|houseNumber|landRegistryNumber)
// 	return options.string.replace(
// 		new RegExp(options.regexStringPattern, options.regexOptions),
// 		(matchWhole: string, matchFirst: string) =>
// 			options.mapObject
// 				? options.matchObject[options.mapObject[matchFirst]]
// 				: options.matchObject[matchFirst]
// 	);
// }

// // the comments should be uncommented, but they are throwing errors now
// export default function useFullAddress() {
// 	let regexArray = [
// 		"COUNTRY",
// 		"CITY",
// 		"ZIP",
// 		"STREET",
// 		"LANDREGISTRYNUMBER",
// 		"HOUSENUMBER",
// 	];
// 	let fullAddress = replaceWithObjectMatches({
// 		string: webInfo.addressPattern,
// 		matchObject: webInfo,
// 		mapObject: {
// 			// must be in order with 'regexArray'
// 			COUNTRY: "country",
// 			CITY: "city",
// 			PSC: "zip",
// 			ULICE: "streetAddress",
// 			CORIENTACNI: "houseNumber",
// 			CPOPISNE: "landRegistryNumber",
// 		},
// 		regexArray,
// 		matchObject: webInfo,
// 	});
// 	// webInfo.fullAddress = fullAddress;
// 	return fullAddress;
// }
