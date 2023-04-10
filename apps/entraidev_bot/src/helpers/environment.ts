import dotenv from 'dotenv';
import z from 'zod';

const environmentSchema = z.object({
	TZ: z.string(),
	DISCORD_TOKEN: z.string(),
	API_TOKEN: z.string(),
	NODE_ENV: z.string(),
	APP_ID: z.string(),
	GUILD_ID: z.string(),
});

export default class Environment {
	static #envVariables: z.infer<typeof environmentSchema>;
	static #initialized = false;

	static #setupEnv() {
		if (!Environment.#initialized) {
			dotenv.config();

			process.env.TZ = 'Europe/Paris';
			// @ts-expect-error `@types/node` doesn't define this yet.
			process.setSourceMapsEnabled(true);

			try {
				Environment.#envVariables = environmentSchema.parse(process.env);
				Environment.#initialized = true;
			} catch (error) {
				throw new Error('Missing environment variables', { cause: error });
			}
		}
	}

	public static getEnv() {
		if (!Environment.#initialized) {
			Environment.#setupEnv();
		}

		return Environment.#envVariables;
	}

	public static isDev() {
		return ['dev', 'development'].includes(Environment.getEnv().NODE_ENV.toLowerCase());
	}
}
