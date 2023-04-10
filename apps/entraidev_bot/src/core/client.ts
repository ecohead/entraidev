import { once } from 'node:events';
import { Awaitable, Client, ClientEvents, REST, Routes, SlashCommandBuilder } from 'discord.js';

import Environment from '../helpers/environment.js';
import Logger from './logger.js';
import { synchronize } from './api/synchronize.js';

export default class Discord {
	static #client: Client;
	static #restClient: REST;

	static async initClient() {
		if (Discord.#client && Discord.#restClient) {
			return;
		}

		const environment = Environment.getEnv();
		const discordToken = environment.DISCORD_TOKEN;

		if (!Discord.#client) {
			Discord.#client = new Client({
				intents: ['Guilds', 'GuildMessages', 'MessageContent'],
			});

			await Promise.all([
				Discord.#client.login(discordToken),
				once(Discord.#client, 'ready'),
			]);

			await synchronize();
		}

		if (!Discord.#restClient) {
			Discord.#restClient = new REST().setToken(discordToken);
		}
	}

	public static get client() {
		return Discord.#client;
	}

	public static get restClient() {
		return Discord.#restClient;
	}

	public static async registerCommands(commands: Array<SlashCommandBuilder>) {
		const environment = Environment.getEnv();
		const applicationId = environment.APP_ID;
		const guildId = environment.GUILD_ID;

		try {
			await Discord.restClient.put(
				Routes.applicationGuildCommands(applicationId, guildId),
				{ body: commands.map((command) => command.toJSON()) },
			);
			Logger.instance.info('Commands updated on the server');
		} catch (error) {
			Logger.instance.error(error);
		}
	}

	/**
	 * Extends native behavior of EventEmitter that doesn't check if the listener
	 * passed in arguments already exists in the event's listeners array or not.
	 */
	public static addEventListener<K extends keyof ClientEvents>(event: K, listener: (...arguments_: ClientEvents[K]) => Awaitable<void>, once = false) {
		const attachedListeners = Discord.#client.listeners(event);

		if (attachedListeners.includes(listener)) {
			return;
		}

		once
			? Discord.#client.once(event, listener)
			: Discord.#client.on(event, listener);
	}

	public static removeEventListener<K extends keyof ClientEvents>(event: K, listener: (...arguments_: ClientEvents[K]) => Awaitable<void>) {
		Discord.#client.off(event, listener);
	}

	public static removeEventListeners(event: keyof ClientEvents) {
		Discord.#client.removeAllListeners(event);
	}
}
