
const description = (value) => typeof value === 'string'
	&& (value.length === 0 
		|| (/^[a-zA-Zа-яА-Я 0-9-',!?"()@$:;+=&.%]+$/.test(value) && value.length < 255));

export default description;
