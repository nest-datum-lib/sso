const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Read .env file and return an array of all environment variables.
 * @param {string} fileName - File name. Default: .env
 * @return {Array}
 */
const all = (fileName: string = '.env', notParsed = false) => {
	const envFilePath = path.resolve(process.env.PWD, fileName);
	const data = fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);

	if (notParsed) {
		return data;
	}

	let i = 0,
		output = {};

	while (i < data.length) {
		if (data[i]) {
			const dataItemSplit = data[i].split('=');

			output[dataItemSplit[0]] = dataItemSplit[1];
		}
		i++;
	}
	return output;
};

export default all;
