export type Constructor<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...arguments_: any): T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueOf<a> = a extends any[] ? a[number] : a[keyof a];
