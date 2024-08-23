import path from "path";
import { promises as fsPromises } from "fs";
import util from "util";
import rimraf from "rimraf";
import { verifyUser } from "~/custom/helpers/usersAuth";

const { readdir, stat, rename, unlink, lstat } = fsPromises;
export default eventHandler(async (event) => {
	let verify = verifyUser(event);
	if (typeof verify === "string") return verify;

	let query = getQuery(event);
	console.log(getHeaders(event));
	console.log(query);
	let itemsFolder = await readdir(path.dirname(`./../..${query.path}`));
	console.log(itemsFolder);

	return ["test.jpg"];
});
