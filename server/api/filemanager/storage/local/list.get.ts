import path, { basename } from "path";
import { existsSync, Dirent, promises as fsPromises } from "fs";
import util from "util";
import rimraf from "rimraf";
import { verifyUser } from "~/custom/helpers/usersAuth";
const { readdir, mkdir, stat, rename, unlink, lstat } = fsPromises;

import {
	fileSystemFile,
	fileSystemDirectory,
	fileSystemItems,
} from "~/digitalniweb-types/filesystem";

/**
 * TODO:
 *  * Add various folders according to role's types; admin/user
 *  * Change folder structure via nginx with website and user info
 */
export default eventHandler(async (event): Promise<fileSystemItems> => {
	verifyUser(event);
	let userVerified = event.context.verifiedUser; // use (user's) "uuid" and "websiteUuid" in path

	let query = getQuery(event);
	// let storagePath = `./local-storage/${process.env.APP_NAME}/websites/${userVerified.websiteUuid}/users/${userVerified.uuid}`;
	let storagePath = process.env.FILEBROWSER_LOCAL_ROOT_PATH;
	let currentDirname = storagePath + query.path;

	if (existsSync(storagePath)) await mkdir(storagePath, { recursive: true });
	try {
		let itemsFolder = await readdir(currentDirname, {
			withFileTypes: true,
		});
		let dirs = [] as fileSystemDirectory[];
		let files = [] as fileSystemFile[];
		for (let item of itemsFolder) {
			let isFile = item.isFile();
			let isDir = item.isDirectory();

			if (!isFile && !isDir) {
				continue;
			}
			if (isFile && item.name[0] === ".") continue;

			let result = {
				type: isFile ? "file" : ("dir" as const),
				path: query.path + item.name,
				basename: "",
				name: "",
				size: 0,
				extension: "",
			};

			result.basename = result.name = path.basename(result.path);

			if (isFile) {
				let fileStat = await stat(
					path.dirname(`${storagePath}${result.path}`)
				);
				result.size = fileStat.size;
				result.extension = path.extname(result.path).slice(1);
				result.name = path.basename(
					result.path,
					"." + result.extension
				);
				files.push(result);
			} else {
				result.path += "/";
				dirs.push(result);
			}
		}

		return {
			dirs,
			files,
		};
	} catch {
		// if (!error.message.startsWith("ENOENT: no such file or directory, scandir"))
		return {
			dirs: [],
			files: [],
		};
	}
});
