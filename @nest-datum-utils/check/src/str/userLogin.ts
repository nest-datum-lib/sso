import str from './index.js';

const userLogin = (value) => str(value)
    && value.length >= 6
    && value[0] !== ' ' // mustn't start with space
    && value[value.length - 1] !== ' ' // mustn't end woth space
    && value.length <= 30 // no more than 30 chars
    && /^[A-Za-z0-9\-_\.]+$/.test(value) // only these chars allowed
    && !/\s/.test(value)

export default userLogin;
