/**
 * Converts an object into a string of key-value pairs separated by a specified divider.
 *
 * @param {object} item The object to be converted into a string of key-value pairs.
 * @param {string} [divider=','] The string used to separate keys and values. Defaults to ','.
 * @return {string} A string representation of the object's key-value pairs.
 */
export function objectToParams(item: object, divider: string = ','): string {
	return Object.entries(item)
		.map(([key, value]) => `${key}${divider}${value}`)
		.join(',');
}
