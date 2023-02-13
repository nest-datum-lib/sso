import all from './all';

/**
 * Finds the key in .env files and returns the corresponding value.
 * @param {string} key - Key to find.
 * @returns {string|null} Value of the key.
 */
const get = (key: string) => (all())[key];

export default get;
