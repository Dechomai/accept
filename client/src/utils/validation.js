const isNotANumber = val => val && isNaN(Number(val));
const isRequired = val => !val || (typeof val === 'string' && !val.trim());

export const rules = {
  required: {
    predicate: val => isRequired(val),
    message: 'The field is required.'
  },
  number: {
    predicate: val => isNotANumber(val),
    message: 'Please, enter valid number'
  },
  digits: {
    predicate: val => val && !/^[0-9-]*$/.test(val),
    message: 'Please, use digits only'
  },
  alphanumeric: {
    predicate: val => val && !/^[a-zA-Z0-9]*$/.test(val),
    message: 'Please, use letters and digits only'
  },
  lettersAndDigits: {
    predicate: val => val && !/^[a-zA-Z0-9_.-]*$/.test(val),
    message: 'Please, use letters and digits only'
  },
  lettersDigitsAndSpaces: {
    predicate: val => val && !/^[a-zA-Z0-9 _.-]*$/.test(val),
    message: 'Please, use digits, numbers and spaces only'
  },
  commonText: {
    predicate: val => val && !/^([a-zA-Z0-9,:;*()$#@% _.\-\\/'"`]|\r\n|\r|\n)*$/.test(val),
    message:
      'Please, use digits, numbers and spaces and following symbols (, : ; * () $ # @ %) only'
  },
  price: {
    predicate: val =>
      (val && !/^\d+(\.\d{1,2})?$/.test(val)) ||
      parseFloat(val) < 0.01 ||
      parseFloat(val) > 2000000,
    message:
      'Price is invalid. Please, enter a real number between 0.01 and 2 000 000 with 2 decimals after dot.\n' +
      'Example: 555.05'
  },
  photosCount: {
    predicate: val => val && val.length,
    message: 'Please add at least one photo'
  },
  youtubeUrl: {
    predicate: val => val && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(val),
    message: 'Only youtube url allows'
  },
  minLength: len => val =>
    val && (val.length < len ? `Please, use minimum ${len} characters` : null),
  maxLength: len => val => val && (val.length > len ? `Please, use up to ${len} characters.` : null)
};

export const getMessage = (fieldRules, value, values) => {
  for (const rule of fieldRules) {
    if (typeof rule === 'string' && rules[rule]) {
      if (rules[rule].predicate(value)) {
        return rules[rule].message;
      }
    }
    if (typeof rule === 'function') {
      const msg = rule(value, values);
      if (msg) return msg;
    }
  }
  return null;
};

const createValidator = (rulesMap = {}) => values => {
  return Object.entries(rulesMap).reduce((acc, [name, fieldRules]) => {
    const msg = getMessage(fieldRules, values[name], values);
    if (msg) acc[name] = msg;
    return acc;
  }, {});
};

export default createValidator;
