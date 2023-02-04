
const bool = (value = '') => value === '1' 
	|| value === '0' 
	|| value.toLowerCase() === 'true'
	|| value.toLowerCase() === 'false';

export default bool;
