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
    predicate: val => !/^[0-9_.-]*$/.test(val),
    message: 'Please, use digits only'
  },
  lettersAndDigits: {
    predicate: val => !/^[a-zA-Z0-9_.-]*$/.test(val),
    message: 'Please, use letters and digits only'
  },
  lettersDigitsAndSpaces: {
    predicate: val => !/^[a-zA-Z0-9 _.-]*$/.test(val),
    message: 'Please, use digits, numbers and spaces only'
  },
  minLength: len => val => (val.length < len ? `Please, use minimum ${len} characters` : null),
  maxLength: len => val => (val.length > len ? `Please, use up to ${len} characters.` : null)
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

const createValidator = rulesMap => values =>
  Object.entries(rulesMap).reduce((acc, [name, fieldRules]) => {
    const msg = getMessage(fieldRules, values[name], values);
    if (msg) acc[name] = msg;
    return acc;
  }, {});

export default createValidator;
