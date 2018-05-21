import './Navigation.scss';

import React from 'react';
import {Link} from 'react-router';

import Icon from '../common/Icon/Icon';

const LINKS = [
  {to: '/exchanges/incoming', text: 'Incoming Offers'},
  {to: '/exchanges/outcoming', text: 'Outcoming Offers'},
  {to: '/exchanges/pending', text: 'Offers in Progress'},
  {to: '/exchanges/reported', text: 'Offers with Issues'},
  {to: '/exchanges/archive', text: 'Archive'}
];

const ExchangesNavigation = () => (
  <div className="exchanges-navigation">
    {LINKS.map(({to, text}) => (
      <Link
        key={to}
        to={to}
        className="exchanges-navigation__item"
        activeClassName="exchanges-navigation__item--active">
        <span className="exchanges-navigation__item__text">{text}</span>
        <Icon className="exchanges-navigation__item__icon" name="chevron-right" />
      </Link>
    ))}
  </div>
);

export default ExchangesNavigation;
