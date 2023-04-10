import { type Logger as PinoLogger, pino, transport } from 'pino';

export default class Logger {
	static #instance: PinoLogger;

	static get instance() {
		if (!Logger.#instance) {
			Logger.#instance = pino<Logger>(transport({ target: "pino-pretty" }));
		}

		return Logger.#instance;
	}
}
