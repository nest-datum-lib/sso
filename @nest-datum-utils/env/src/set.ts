const fs = require('fs');
const os = require('os');
const path = require('path');

import all from './all';

/**
 * Update the value of an existing key or create a new variable. The file is overwritten synchronously.
 * @param {string} key - Variable name.
 * @param {string} value - Variable value
 * @param {string} fileName - File name. Default: .env
 * @return {Array}
 */
const set = (key: string, value: string|number, fileName: string = '.env') => {
	const envFilePath = path.resolve(process.env.PWD, fileName);
	const envVars = all(fileName);
	const targetLine = envVars.find((line) => line.split('=')[0] === key);
	
	if (targetLine !== undefined) {
		const targetLineIndex = envVars.indexOf(targetLine);
		
		envVars.splice(targetLineIndex, 1, `${key}=${value}`);
	}
	else {
		envVars.push(`${key}=${value}`);
	}
	fs.writeFileSync(envFilePath, envVars.join(os.EOL));

	return envVars;
};

export default set;
