import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { rimraf } from "rimraf";

export default eventHandler(async (event): Promise<boolean> => {
	try {
		let query = getQuery(event);
		let storagePath = process.env.FILEBROWSER_LOCAL_ROOT_PATH + query.path;
		if (!existsSync(storagePath)) return false;
		if (query.type === "dir") {
			await rimraf(storagePath);
		} else if (query.type === "file") {
			await unlink(storagePath);
		}
		return true;
	} catch (error) {
		// console.log(error);
		return false;
	}
});
