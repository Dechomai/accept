export const BASE_MESSAGES = {
  required: 'The field is required.'
};

const REGEXES = {
  lettersAndDigits: /^[a-zA-Z0-9_.-]*$/,
  lettersDigitsAndSpaces: /^[a-zA-Z0-9 _.-]*$/,
  digitsOnly: /^[0-9_.-]*$/
};

const MIN_LENGTH_NAME = 3,
  MAX_LENGTH_NAME = 50,
  MIN_LENGTH_PHONE = 3,
  MAX_LENGTH_PHONE = 20,
  MIN_LENGTH_ADDRESS = 5,
  MAX_LENGTH_ADDRESS = 100,
  MIN_LENGTH_USERNAME = 3,
  MAX_LENGTH_USERNAME = 40;

export const validations = {
  name: {
    minLength: {
      value: MIN_LENGTH_NAME,
      message: `Minimal length ${MIN_LENGTH_NAME}`
    },
    maxLength: {
      value: MAX_LENGTH_NAME,
      message: `Max length ${MAX_LENGTH_NAME}`
    },
    allowedSymbols: {
      regex: REGEXES.lettersAndDigits,
      message: 'Please, use letters and digits only'
    }
  },
  phoneNumber: {
    minLength: {
      value: MIN_LENGTH_PHONE,
      message: `Minimal length ${MIN_LENGTH_PHONE}`
    },
    maxLength: {
      value: MAX_LENGTH_PHONE,
      message: `Max length ${MAX_LENGTH_PHONE}`
    },
    allowedSymbols: {
      regex: REGEXES.digitsOnly,
      message: 'Please, use digits only'
    }
  },
  address: {
    minLength: {
      value: MIN_LENGTH_ADDRESS,
      message: `Minimal length ${MIN_LENGTH_PHONE}`
    },
    maxLength: {
      value: MAX_LENGTH_ADDRESS,
      message: `Max length ${MAX_LENGTH_PHONE}`
    },
    allowedSymbols: {
      regex: REGEXES.lettersDigitsAndSpaces,
      message: 'Please, use digits, numbers and spaces only'
    }
  },
  username: {
    minLength: {
      value: MIN_LENGTH_USERNAME,
      message: `Minimal length ${MIN_LENGTH_PHONE}`
    },
    maxLength: {
      value: MAX_LENGTH_USERNAME,
      message: `Max length ${MAX_LENGTH_PHONE}`
    },
    allowedSymbols: {
      regex: REGEXES.lettersAndDigits,
      message: 'Please, use letters and digits only'
    }
  }
};
