import { existsSync } from "fs";
import { mkdir } from "fs/promises";

export default eventHandler(async (event): Promise<boolean> => {
	try {
		let query = getQuery(event);
		if (!process.env.FILEBROWSER_LOCAL_ROOT_PATH || query.path)
			return false;
		let storagePath = process.env.FILEBROWSER_LOCAL_ROOT_PATH + query.path;
		if (existsSync(storagePath)) return false;
		await mkdir(storagePath, { recursive: true });
		return true;
	} catch (error) {
		// console.log(error);
		return false;
	}
});
