import products from '../products';
import {
  FETCH_PRODUCTS_REQUEST,
  // FETCH_PRODUCTS_SUCCESS,
  // FETCH_PRODUCTS_FAILURE,
  fetchProductsRequest,
  createProductRequest
  // fetchProductsSuccess,
  // fetchProductsFailure
} from '../../actions/products';

describe('Reducers > products', () => {
  let state;

  afterEach(() => {
    state = null;
  });

  it('should return object with "all" and "user" properties by default', () => {
    state = products(undefined, {type: 'TEST'});
    expect(state).toEqual({
      all: {},
      user: {}
    });
  });

  it('should create scope', () => {
    state = products(undefined, fetchProductsRequest('user', 0, 0));
    expect(state.user).not.toEqual({});
    state = products(undefined, fetchProductsRequest('all', 0, 0));
    expect(state.all).not.toEqual({});
    state = products(undefined, fetchProductsRequest('test-user-id', 0, 0));
    expect(state['test-user-id']).not.toEqual({});
  });

  it('should create params in scope', () => {
    state = products(undefined, fetchProductsRequest('user', 1, 2));
    expect(state.user).toHaveProperty('skip=1,limit=2');
    state = products(undefined, fetchProductsRequest('all', 10, 20));
    expect(state.all).toHaveProperty('skip=10,limit=20');
    state = products(undefined, fetchProductsRequest('test-user-id', 100, 200));
    expect(state['test-user-id']).toHaveProperty('skip=100,limit=200');
  });

  // TODO: test particular actions
  it(`should handle ${FETCH_PRODUCTS_REQUEST}`, () => {
    state = products(undefined, fetchProductsRequest('user', 1, 2));
    expect(state.user['skip=1,limit=2']).toHaveProperty('loading', true);
  });

  it('should invalidate state', () => {
    state = products(
      {
        all: {
          'skip=0,limit=10': {
            loading: false,
            error: null,
            data: [1, 2, 3],
            count: 0,
            listValid: true
          }
        },
        user: {
          'skip=10,limit=10': {
            loading: false,
            error: null,
            data: [4, 5, 6],
            count: 0,
            listValid: true
          }
        }
      },
      createProductRequest()
    );
    expect(state.all['skip=0,limit=10']).toHaveProperty('listValid', false);
    expect(state.user['skip=10,limit=10']).toHaveProperty('listValid', false);
  });
});
