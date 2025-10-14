import { existsSync, promises as fsPromises } from "fs";
import path from "path";
import { verifyUser } from "~~/custom/helpers/usersAuth";
const { readdir, mkdir, stat } = fsPromises;

import type {
	fileSystemDirectory,
	fileSystemFile,
	fileSystemItems,
} from "~~/digitalniweb-types/filesystem";

/**
 * TODO:
 *  * Add various folders according to role's types; admin/user
 *  * Change folder structure via nginx with website and user info
 */
export default eventHandler(async (event): Promise<fileSystemItems> => {
	verifyUser(event);
	// let userVerified = event.context.verifiedUser; // use (user's) "uuid" and "websiteUuid" in path

	let query = getQuery(event);
	// let storagePath = `./local-storage/${process.env.APP_NAME}/websites/${userVerified.websiteUuid}/users/${userVerified.uuid}`;
	let storagePath = process.env.FILEBROWSER_LOCAL_ROOT_PATH;
	if (!storagePath || !query.path) return { dirs: [], files: [] };
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

			if (isFile) {
				let file = {
					path: query.path + item.name,
				} as fileSystemFile;
				file.name = path.basename(file.path);
				let fileStat = await stat(`${storagePath}${file.path}`);

				file.mtime = fileStat.mtime;
				file.size = fileStat.size;
				file.extension = path.extname(file.path).slice(1);
				files.push(file);
			} else {
				let dir = {
					path: query.path + item.name,
				} as fileSystemDirectory;
				dir.basename = path.basename(dir.path);
				dir.path += "/";
				dirs.push(dir);
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
