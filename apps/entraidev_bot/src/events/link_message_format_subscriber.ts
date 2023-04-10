import type { Message, PartialMessage } from 'discord.js';

import AbstractEventSubscriber, { type TSubscribedEvents } from '../core/events/abstract_event_subscriber.js';

export default class LinkMessageFormatSubscriber extends AbstractEventSubscriber {
	/**
	 * Inherited from `BaseClass`.
	 * @see BaseClass
	 */
	static override enabled = true;
	static override featureName = 'Validate format of posted links in #liens';

	/**
	 * Inherited from `AbstractEventSubscriber`.
	 * @see AbstractEventSubscriber
	 */
	public static override getSubscribedEvents(): TSubscribedEvents {
		return {
			messageCreate: [
				[LinkMessageFormatSubscriber.#handleNewMessage, false]
			],
			messageUpdate: [
				[LinkMessageFormatSubscriber.#handleUpdatedMessage, false]
			],
		}
	}

	/**
	 * Feature events callbacks.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static #handleNewMessage(message: Message) {
		console.log('new message received');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static #handleUpdatedMessage(oldMessage: Message|PartialMessage, newMessage: Message|PartialMessage) {
		console.log('old message updated');
	}
}
