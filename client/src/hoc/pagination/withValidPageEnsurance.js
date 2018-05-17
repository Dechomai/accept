import {lifecycle} from 'recompact';

export default (selectorFn, limit) =>
  lifecycle({
    componentWillUpdate(nextProps) {
      const count = selectorFn(nextProps);
      if (!count) return;

      const {router, location} = nextProps;
      const page = parseInt(location.query.page);
      if (!page || page < 1 || count <= (page - 1) * limit) {
        router.replace({
          pathname: location.pathname,
          query: {
            page: 1
          }
        });
      }
    }
  });
