
const email = (value = '') => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test((value || '').toLowerCase()));

export default email;

