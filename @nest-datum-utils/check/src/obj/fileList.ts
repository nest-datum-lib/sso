import obj from './index';

const fileList = (value) => obj(value) && value.constructor.name === 'FileList';

export default fileList;
