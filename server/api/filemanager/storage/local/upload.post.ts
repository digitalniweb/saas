import fs from "fs/promises";
export default eventHandler(async (event): Promise<boolean> => {
	try {
		let { path } = getQuery(event);
		if (!path) return false;
		let storagePath = process.env.FILEBROWSER_LOCAL_ROOT_PATH + path;
		let files = await readMultipartFormData(event);
		if (!files) return false;
		for (let file of files) {
			// let originalSize = file.data.byteLength;
			await fs.writeFile(storagePath + file.filename, file.data);
		}
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
});
