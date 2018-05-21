import './Navigation.scss';

import React from 'react';
import {Link} from 'react-router';

import Icon from '../common/Icon/Icon';

const ExchangesNavigation = () => {
  return (
    <div className="exchanges-navigation">
      <Link
        to="/exchanges/incoming"
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">Incoming Offers</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
      <Link
        to="/exchanges/outcoming"
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">Outcoming Offers</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
      <Link
        to="/exchanges/pending"
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">Offers in Progress</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
      <Link
        to="/exchanges/reported"
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">Offers with Issues</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
      <Link
        to="/exchanges/archive"
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">Archive</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
    </div>
  );
};

export default ExchangesNavigation;
