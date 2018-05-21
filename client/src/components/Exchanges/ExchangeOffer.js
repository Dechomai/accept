import './ExchangeOffer.scss';

import React from 'react';
import classNames from 'classnames';
import UserLink from '../../components/common/UserLink/UserLink';
import PropTypes from 'prop-types';

const ExchangeOffer = ({isOwner}) => {
  return (
    <div className="exchange-offer">
      <div className="exchange-offer__wrapper">
        <div
          className={classNames('exchange-offer__section', {
            'exchange-offer__section--is-owner': isOwner
          })}>
          <UserLink
            user={{firstName: 'Mr.Big', lastName: 'Huge', username: 'Hui'}}
            isOwner={isOwner}
          />
        </div>
        <div className="exchange-offer__section">
          <UserLink
            user={{firstName: 'Mr.Big', lastName: 'Huge', username: 'Hui'}}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
};

ExchangeOffer.propTypes = {
  isOwner: PropTypes.bool.isRequired
};

export default ExchangeOffer;
