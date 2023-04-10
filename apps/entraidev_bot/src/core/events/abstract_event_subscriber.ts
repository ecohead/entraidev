import type { Logger as PinoLogger } from 'pino';
import { Awaitable, Client, ClientEvents } from 'discord.js';

import Discord from '../client.js';
import Logger from '../logger.js';
import BaseClass from '../base_class.js';

export type TSubscribedEvents = { [E in keyof ClientEvents]?: Array<[(...event: ClientEvents[E]) => Awaitable<void>, boolean]> };

export default abstract class AbstractEventSubscriber extends BaseClass {
	protected static client: Client = Discord.client;
	protected static logger: PinoLogger = Logger.instance;

	public static getSubscribedEvents(): TSubscribedEvents {
		return {};
	}
}
