export type If<C extends boolean, A extends any, B = any> = C extends true
	? A
	: C extends false
		? B
		: never;
