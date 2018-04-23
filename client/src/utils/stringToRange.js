const toCharCode = (s = '') => s.charCodeAt(0) || 0;
const sum = arr => arr.reduce((a, b) => a + b, 0);

const stringToRange = (string, range) => sum(string.split('').map(toCharCode)) % range;

export default stringToRange;
