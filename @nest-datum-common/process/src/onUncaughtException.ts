
const onUncaughtException = (err) => {
	console.error('CRITICAL ERROR', err.message);
};

export default onUncaughtException;
