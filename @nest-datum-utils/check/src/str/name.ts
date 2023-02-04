import description from './description';

const name = (value = '') => description(value) && value.length < 127;

export default name;
