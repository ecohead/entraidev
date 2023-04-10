import BaseClass from '../base_class.js';
import { Interaction, SlashCommandBuilder } from 'discord.js';

export default abstract class AbstractCommand extends BaseClass {
	protected static command?: SlashCommandBuilder;
	protected static commandName?: string;
	protected static commandDescription?: string;

	protected static getBuilder() {
		if (!this.command) {
			this.command = new SlashCommandBuilder()
				.setName(this.commandName ?? 'change_me')
				.setDescription(this.commandDescription ?? 'change_me');
		}

		return this.command;
	}

	public static create(): SlashCommandBuilder {
		return this.getBuilder();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static async handle(interaction: Interaction): Promise<void> {
		return;
	}
}
