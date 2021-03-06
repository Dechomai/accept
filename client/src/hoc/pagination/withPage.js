import {withProps} from 'recompact';

export default limit =>
  withProps(({location}) => {
    const page = parseInt(location.query.page) - 1;
    return {
      skip: !page || page < 0 ? 0 : page * limit,
      limit
    };
  });
