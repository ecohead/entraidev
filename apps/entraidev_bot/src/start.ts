import { start as startCommands } from './commands/index.js';
import { start as startEvents } from './events/index.js';
import { start as startInteractions } from './interactions/index.js';
import Logger from './core/logger.js';
import Discord from './core/client.js';

async function launchBot() {
	try {
		await Discord.initClient();
		await startEvents();
		await startCommands();
		startInteractions();
	} catch (error) {
		Logger.instance.error(error);
		return void 1;
	}
}

await launchBot();
