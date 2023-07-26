import str from './index.js';

const password = (value) => str(value)
	&& value[0] !== ' ' // mustn't start with space
	&& value[value.length - 1] !== ' ' // mustsn't end with space
	&& value.length >= 8  // at least 8 chars
	&& value.length <= 100 // no more than 100 chars
	&& /\d/.test(value) // at least 1 digid should contain
	&& /^[A-Za-zА-Яа-я0-9\s~!?@#$%^&*_+()\[\]{}><\\\/|"'.,:;-]+$/.test(value); // only these chars allowed

export default password;
