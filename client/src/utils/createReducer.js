const throwIfNotProvided = () => {
  throw Error('createReducer: initialState not provided');
};

const createReducer = (initialState = throwIfNotProvided(), handlers) => (
  state = initialState,
  action
) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action.payload, action);
  }
  return state;
};

export default createReducer;
