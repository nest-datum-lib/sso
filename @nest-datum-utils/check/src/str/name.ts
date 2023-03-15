import description from './description';

const name = (value: any) => description(value) 
	&& value.length < 127
	&& value.length >= 1;

export default name;
