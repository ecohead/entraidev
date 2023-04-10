import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

import Logger from '../core/logger.js';
import Environment from './environment.js';
import BaseClass from '../core/base_class.js';
import { hasClassInPrototype } from './object.js';
import type { Constructor } from './types.js';

export default class Filesystem {
	public static toPath(pathOrUrl: string | URL): string {
		if (typeof pathOrUrl === 'string') return pathOrUrl;
		return fileURLToPath(pathOrUrl);
	}

	static async #recursiveSearch(directory: string, output: Array<string>): Promise<Array<unknown>> {
		return Promise.all(
			await fs
				.readdir(directory, { withFileTypes: true })
				.then((entries) => {
					return entries.map((entry) => {
						const childPath = path.join(directory, entry.name);
						return entry.isDirectory() ? Filesystem.#recursiveSearch(childPath, output) : output.push(childPath);
					});
				}),
		);
	}

	protected static async readDirRecursive(pathOrUrl: string | URL): Promise<string[]> {
		const directory = Filesystem.toPath(pathOrUrl);
		const output: Array<string> = [];
		await Filesystem.#recursiveSearch(directory, output);

		return output.flat(Number.POSITIVE_INFINITY);
	}

	public static async loadDirectory<ReturnClass extends BaseClass, AsConstructor extends boolean = false>(pathOrUrl: string | URL): Promise<Array<AsConstructor extends true ? Constructor<ReturnClass> : ReturnClass>> {
		const directory = Filesystem.toPath(pathOrUrl);

		/**
		 * Read the directory given in parameters.
		 */
		let list: string[] = [];
		try {
			list = await Filesystem.readDirRecursive(directory);
		} catch (error) {
			Logger.instance.error(error);

			return [];
		}

		/**
		 * Filter list to retrieve only interesting files.
		 */
		const files = list.filter((file) => {
			const extension = path.extname(file);
			const isJavascriptFile = ['.js', '.ts'].includes(extension);
			const isIndexFile = file.endsWith('index.js') || file.endsWith('index.ts');

			return isJavascriptFile && !isIndexFile;
		});

		if (files.length <= 0) {
			return [];
		}

		const enabledFiles: Array<AsConstructor extends true ? Constructor<ReturnClass> : ReturnClass> = [];

		/**
		 * Check that file is an instance of the expected class and the feature is enabled.
		 */
		for await (const file of files) {
			const value = await import(pathToFileURL(file).href);

			const hasDefaultExport = typeof value.default === 'function';
			const isGoodConstructor = hasClassInPrototype(value.default, BaseClass);

			if (!hasDefaultExport || !isGoodConstructor) {
				continue;
			}

			const classObject = value.default as AsConstructor extends true ? Constructor<ReturnClass> : ReturnClass;

			// @ts-expect-error We are sure that `enabled` static property
			// exists because of the `hasOwn` first check.
			if (Object.hasOwn(classObject, 'enabled') && classObject.enabled) {
				enabledFiles.push(classObject);
			}
		}

		if (enabledFiles.length > 0 && Environment.isDev()) {
			Logger.instance.info(`Loaded ${enabledFiles.length} files in directory ${directory}`);
		}

		return enabledFiles;
	}
}
