
const arr = (value) => typeof value === 'string'
	&& value[0] === '['
	&& value[value.length - 1] === ']';

export default arr;
