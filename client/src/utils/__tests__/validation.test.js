import createValidator, {rules} from '../validation';

describe('Utils > validation', () => {
  describe('createValidator', () => {
    it('should always return function', () => {
      expect(typeof createValidator()).toEqual('function');
    });

    describe('created validator', () => {
      let validator;

      it('should always return object', () => {
        validator = createValidator();
        expect(validator()).toEqual({});
        validator = createValidator({});
        expect(validator({})).toEqual({});
      });

      it('should run default validation rules', () => {
        const originalRequiredPredicate = rules.required.predicate;
        const mockFn = jest.fn();
        rules.required.predicate = mockFn;
        validator = createValidator({
          foo: ['required']
        });
        validator({
          foo: 'bar'
        });
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith('bar');
        rules.required.predicate = originalRequiredPredicate;
      });

      it('should run custom validation rules', () => {
        const mockFn = jest.fn();
        validator = createValidator({
          foo: [mockFn]
        });
        const rules = {
          foo: 'bar'
        };
        expect(validator(rules));
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledWith('bar', rules);
      });

      it('should return first message found', () => {
        const withMessage = jest.fn().mockImplementation(() => 'msg');
        const withOutMessage = jest.fn().mockImplementation(() => null);
        validator = createValidator({
          foo: [withMessage, withOutMessage]
        });
        expect(
          validator({
            foo: 'bar'
          })
        ).toEqual({
          foo: 'msg'
        });

        validator = createValidator({
          foo: [withOutMessage, withMessage]
        });
        expect(
          validator({
            foo: 'bar'
          })
        ).toEqual({
          foo: 'msg'
        });
      });

      it('should return empty object if no message found', () => {
        const mockFn = jest.fn();
        validator = createValidator({
          foo: [mockFn]
        });
        expect(
          validator({
            foo: 'bar'
          })
        ).toEqual({});
      });
    });
  });
});
