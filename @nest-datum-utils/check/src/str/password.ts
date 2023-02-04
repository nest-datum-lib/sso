import str from './index';

const password = (value = '') => str(value) 
	&& value.length >= 8 
	&& value.length <= 255
	&& /\d/.test(value)
	&& /\p{L}/u.test(value);

export default password;
