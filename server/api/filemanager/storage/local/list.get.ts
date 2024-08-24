import path from "path";
import { promises as fsPromises } from "fs";
import util from "util";
import rimraf from "rimraf";
import { verifyUser } from "~/custom/helpers/usersAuth";

const { readdir, stat, rename, unlink, lstat } = fsPromises;
export default eventHandler(async (event) => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser; // use (user's) "uuid" and "websiteUuid" in path

	let query = getQuery(event);
	console.log(getHeaders(event));
	console.log(query);
	let itemsFolder = await readdir(path.dirname(`./../..${query.path}`));
	console.log(itemsFolder);

	return ["test.jpg"];
});
