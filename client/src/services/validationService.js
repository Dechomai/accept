import {validations, BASE_MESSAGES} from '../utils/validations';

const helpers = {
  minLength: (value, minLength) => value.length > 0 && value.length < minLength,
  maxLength: (value, maxLength) => value.length > maxLength,
  allowedSymbols: (value, regex) => !regex.test(value)
};

export const validateField = (value, type) => {
  let error;
  const {minLength, maxLength, allowedSymbols} = validations[type];

  if (!value) {
    error = BASE_MESSAGES.required;
  }

  if (minLength && helpers.minLength(value, minLength.value)) {
    error = minLength.message;
  }

  if (maxLength && helpers.maxLength(value, maxLength.value)) {
    error = maxLength.message;
  }

  if (allowedSymbols && helpers.allowedSymbols(value, allowedSymbols.regex)) {
    error = allowedSymbols.message;
  }

  return error;
};
