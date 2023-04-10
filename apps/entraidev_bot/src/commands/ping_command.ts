import { ChatInputCommandInteraction, Interaction } from 'discord.js';

import AbstractCommand from '../core/commands/abstract_command.js';

export default class PingCommand extends AbstractCommand {
	/**
	 * Inherited from `BaseClass`.
	 * @see BaseClass
	 */
	public static override enabled = true;

	/**
	 * Inherited from `AbstractCommand`.
	 * @see AbstractCommand
	 */
	protected static override commandName = 'ping';
	protected static override commandDescription = 'Test if the bot is working';

	/**
	 * Overrides corresponding to the current feature.
	 */
	public static override create() {
		return super.getBuilder();
	}

	public static override async handle(interaction: Interaction) {
		if (!(interaction instanceof ChatInputCommandInteraction)) {
			return;
		}

		if (interaction.commandName !== PingCommand.commandName) {
			return;
		}

		await interaction.reply({ content: 'pong', ephemeral: true });
	}
}
