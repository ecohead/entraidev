import path from 'node:path';
import { Awaitable, ClientEvents } from 'discord.js';

import Filesystem from '../helpers/filesystem.js';
import AbstractEventSubscriber from '../core/events/abstract_event_subscriber.js';
import Discord from '../core/client.js';
import { ValueOf } from '../helpers/types.js';

export async function start() {
	const eventSubscribers = await Filesystem.loadDirectory<AbstractEventSubscriber, false>(path.join(process.cwd(), 'src/events'));

	/**
	 * Add retrieved event subscribers to the discord client.
	 */
	for (const eventSubscriber of eventSubscribers) {
		// @ts-expect-error Error in accessing static member while
		// we ensure that method is available on the object provided.
		const subscribedEvents = Object.entries(eventSubscriber.getSubscribedEvents());

		for (const [eventName, callbacks] of subscribedEvents) {
			/**
			 * Necessary to overload the two types below
			 * because `Object.entries` alter the original ones.
			 */
			const event = eventName as keyof ClientEvents;
			const listeners = callbacks as Array<[(...event: ValueOf<ClientEvents>) => Awaitable<void>, boolean]>;

			/**
			 * Add retrieved events to the client.
			 */
			for (const [listener, once] of listeners) {
				Discord.addEventListener(event,listener, once);
			}
		}
	}
}
