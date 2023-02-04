const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Read .env file and return an array of all environment variables.
 * @param {string} fileName - File name. Default: .env
 * @return {Array}
 */
const all = (fileName: string = '.env') => {
	const envFilePath = path.resolve(process.env.PWD, fileName);

	return fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);
};

export default all;
