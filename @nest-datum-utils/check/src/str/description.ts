import str from './index';

const description = (value: any) => str(value)
	&& (value.length === 0 
		|| (/^[a-zA-Zа-яА-Я 0-9-',!?"()@$:;+=&.%\\]+$/.test(value)
			&& (!!(value).replace(/\s/g, '').length)
			&& value.length < 255));

export default description;
