
const notFound = (err) => (err || {}).response && (err.response || {}).status === 404;

export default notFound;
