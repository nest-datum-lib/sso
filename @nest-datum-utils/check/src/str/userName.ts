import str from './index.js';

const userName = (value) => str(value)
	&& value.length >= 1
	&& value[0] !== ' ' // mustn't start with space
	&& value[value.length - 1] !== ' ' // mustn't end woth space
	&& value.length <= 30 // no more than 30 chars
	&& value[0] === value[0].toUpperCase() // must start with capital letter
	&& /^[a-zA-Zа-яА-Я0-9'-_\s]+$/.test(value) // only these chars allowed
	&& /^(?!.* {2})[^\n]*$/.test(value); // no more than 1 space in a row

export default userName;
