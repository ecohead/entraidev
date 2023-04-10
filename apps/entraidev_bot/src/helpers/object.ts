import { Constructor } from './types.js';

function rewindPrototypes(object: object, expectedClass: object): boolean {
	const objectPrototype = Object.getPrototypeOf(object);

	if (objectPrototype === null) {
		return false;
	}

	if (objectPrototype === expectedClass) {
		return true;
	}

	return rewindPrototypes(objectPrototype, expectedClass);
}

export function hasClassInPrototype(object: unknown, expectedClass: Constructor<unknown>) {
	if (!object || typeof object !== 'function') {
		return false;
	}

	return rewindPrototypes(object, expectedClass);
}
