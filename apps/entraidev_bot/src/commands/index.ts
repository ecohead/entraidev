import path from 'node:path';

import Filesystem from '../helpers/filesystem.js';
import Discord from '../core/client.js';
import AbstractCommand from '../core/commands/abstract_command.js';

export async function start() {
	const commands = await Filesystem.loadDirectory<AbstractCommand, false>(path.join(process.cwd(), 'src/commands'));

	for (const command of commands) {
		// @ts-expect-error Error in accessing static member while
		// we ensure that method is available on the object provided.
		Discord.addEventListener('interactionCreate', command.handle);
	}

	await Discord.registerCommands(commands.map((command) => {
		// @ts-expect-error Error in accessing static member while
		// we ensure that method is available on the object provided.
		return command.create();
	}));
}
