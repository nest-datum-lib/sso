
const model = (value) => {
	return value
		&& typeof value === 'object'
		&& value['id']
		&& typeof value['id'] === 'string';
};

export default model;
