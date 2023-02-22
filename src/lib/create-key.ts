export function createKey(...args: Array<number | string>): string {
	return args.join("+");
}
