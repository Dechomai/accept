import {compose, lifecycle, branch, renderNothing} from 'recompact';

export default (absencePredicateFn = props => props.dataAbsent) =>
  compose(
    lifecycle({
      componentWillMount() {
        if (absencePredicateFn(this.props)) {
          this.props.onDataAbsent();
        }
      }
    }),
    branch(absencePredicateFn, renderNothing)
  );
