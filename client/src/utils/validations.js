export const BASE_MESSAGES = {
  required: 'The field is required.'
};

const REGEXES = {
  lettersAndDigits: /^[a-zA-Z0-9_.-]*$/,
  lettersDigitsAndSpaces: /^[a-zA-Z0-9 _.-]*$/,
  digitsOnly: /^[0-9_.-]*$/
};

const MIN_LENGTH_NAME = 2,
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
      message: `Please, use minimum ${MIN_LENGTH_NAME} characters`
    },
    maxLength: {
      value: MAX_LENGTH_NAME,
      message: `Please, use up to ${MAX_LENGTH_NAME} characters.`
    },
    allowedSymbols: {
      regex: REGEXES.lettersAndDigits,
      message: 'Please, use letters and digits only'
    }
  },
  phoneNumber: {
    minLength: {
      value: MIN_LENGTH_PHONE,
      message: `Please, use minimum ${MIN_LENGTH_PHONE} characters`
    },
    maxLength: {
      value: MAX_LENGTH_PHONE,
      message: `Please, use up to ${MAX_LENGTH_PHONE} characters.`
    },
    allowedSymbols: {
      regex: REGEXES.digitsOnly,
      message: 'Please, use digits only'
    }
  },
  address: {
    minLength: {
      value: MIN_LENGTH_ADDRESS,
      message: `Please, use minimum ${MIN_LENGTH_ADDRESS} characters`
    },
    maxLength: {
      value: MAX_LENGTH_ADDRESS,
      message: `Please, use up to ${MAX_LENGTH_ADDRESS} characters.`
    },
    allowedSymbols: {
      regex: REGEXES.lettersDigitsAndSpaces,
      message: 'Please, use digits, numbers and spaces only'
    }
  },
  username: {
    minLength: {
      value: MIN_LENGTH_USERNAME,
      message: `Please, use minimum ${MIN_LENGTH_USERNAME} characters`
    },
    maxLength: {
      value: MAX_LENGTH_USERNAME,
      message: `Please, use up to ${MAX_LENGTH_USERNAME} characters.`
    },
    allowedSymbols: {
      regex: REGEXES.lettersAndDigits,
      message: 'Please, use letters and digits only'
    }
  }
};
