import numeric from '../numeric';
import str from './index';

const date = (value = '') => {
	if (!value) {
		return false;
	}
	let processedValue;

	if (str(value) || numeric(value)) {
		processedValue = new Date(value);
	}
	return ((processedValue || value) instanceof Date && !Number.isNaN(processedValue || value));
};

export default date;
