
/**
 * Find environment variables by one or more occurrences in the parameter name.
 * @param {Array<string>} occurrences - Array of strings to find variables.
 * @param {Function} callback - The callback function is called on each iteration of the loop passing through the array of found variables. Used to process found values before returning a result.
 * @return {Array}
 */
const find = (occurrences: Array<string>, callback = (key) => {}) => {
	return Object.keys(process.env || {})
		.filter((key) => occurrences.filter((item) => key.includes(item)).length === occurrences.length)
		.map((key) => {
			occurrences.forEach((item) => (key = key.replace(item, '')));

			return callback(key);
		});
};

export default find;
