const fs = require('fs').promises;
const libre = require('libreoffice-convert');

const converTo = async (attempt = 0) => {
	if (process.argv[3] === 'pdf'
		|| process.argv[3] === 'PDF') {
		try {
			libre['convertAsync'] = require('util').promisify(libre.convert);
		}
		catch (err) {
			console.log(`convertTo error: libreoffice-convert does not answer.`);

			if (attempt < 5) {
				await (new Promise((resolve, reject) => setTimeout(() => resolve(true), 10000)));
				return await converTo(attempt + 1);
			}
			throw err;
		}
		const docxBuf = await fs.readFile(process.argv[2]);
		const pdfBuf = await libre['convertAsync'](docxBuf, '.pdf', undefined);

		await fs.writeFile(process.argv[2], pdfBuf);
		await (new Promise((resolve, reject) => setTimeout(() => resolve(true), 1000)));
	}
};

(async () => await converTo())();
