
(async () => {
	const { fileTypeFromFile } = await import('file-type');
	const extension = await fileTypeFromFile(process.argv[2]);

	console.log(extension);
})();
