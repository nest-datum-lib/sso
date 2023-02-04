import { strId } from '@nest-datum-utils/check';

const exists = (value) => strId(value) && value !== '0';

export default exists;
