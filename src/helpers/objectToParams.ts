// noinspection GrazieInspection

/**
 * Converts an object into a comma-separated string of key-value pairs.
 * Nested objects are flattened using dot notation.
 *
 * @example
 * ```ts
 * const options = {
 *     driver: 'qcow2',
 *     size: '1G',
 *     encrypt: {
 *         format: 'luks',
 *         key: {
 *             secret: 'sec0',
 *         },
 *     },
 *     lazy_refcounts: true,
 * };
 *
 * console.log(objectToParams(options)); // driver=qcow2,size=1G,encrypt.format=luks,encrypt.key.secret=sec0,lazy_refcounts=true
 * ```
 *
 * @param {object} item The object to convert.
 * @param {string} [divider='='] The separator between keys and values.
 * @returns {string} The flattened key-value pairs.
 */
export function objectToParams(item: object, divider: string = '='): string {
	const params: string[] = [];

	const flatten = (obj: object, prefix: string = ''): void => {
		for (const [key, value] of Object.entries(obj)) {
			const path = prefix ? `${prefix}.${key}` : key;

			if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
				flatten(value, path);
			} else if (value !== undefined) {
				params.push(`${path}${divider}${value}`);
			}
		}
	};

	flatten(item);

	return params.join(',');
}
