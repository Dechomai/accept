import './OffersPreview.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Button} from 'reactstrap';
import Offer from '../../../common/Offer/Offer';
import NewOffer from '../../../common/Offer/NewOffer';
import Icon from '../../../common/Icon/Icon';

class OffersPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {title, type, newPlaceholder, offers} = this.props;

    return (
      <div className="container about__offers">
        <div className="row about__offers__header">
          <div className="mr-auto">{title}</div>
          <Link to={`/profile/${type}`}>
            <Button size="sm" color="link" className="p-0 btn-with-icon">
              <span>View all</span>
              <Icon name="menu-right" />
            </Button>
          </Link>
        </div>
        <div className="row about__offers__container">
          <NewOffer placeholder={newPlaceholder} type={type} className="col-lg-3" />
          {offers.map((offer, i) => <Offer key={i} {...offer} className="col-lg-3" />)}
        </div>
      </div>
    );
  }
}

OffersPreview.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['product', 'service']).isRequired,
  newPlaceholder: PropTypes.string.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OffersPreview;
