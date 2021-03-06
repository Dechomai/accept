import './Notification.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';

export const formatTitle = notification => {
  const {exchange, subject, recepient} = notification;
  const isInitiator = exchange.initiator === recepient;
  switch (subject) {
    case 'Exchange.new':
      return (
        <div className="notification__title">
          <b>New Offer: </b>
          <span className="notification__highlight">{exchange.initiatorItem.title} </span>
          <span>exchange for </span>
          <span className="notification__highlight">{exchange.partnerItem.title}</span>
        </div>
      );
    case 'Exchange.accepted':
      return (
        <div className="notification__title">
          <b>Accepted: </b>
          <span className="notification__highlight">{exchange.initiatorItem.title} </span>
          <span>was accepted to trade for </span>
          <span className="notification__highlight">{exchange.partnerItem.title}</span>
        </div>
      );
    case 'Exchange.rejected':
      return (
        <div className="notification__title">
          <b>Rejected: </b>
          <span className="notification__highlight">{exchange.initiatorItem.title} </span>
          <span>in exchange for </span>
          <span className="notification__highlight">{exchange.partnerItem.title} </span>
          <span>offer was rejected</span>
        </div>
      );
    case 'Exchange.validated': {
      const {partnerItem, initiatorItem} = exchange;
      let item1, item2;
      if (isInitiator) {
        item1 = initiatorItem;
        item2 = partnerItem;
      } else {
        item1 = partnerItem;
        item2 = initiatorItem;
      }
      return (
        <div className="notification__title">
          <b>Validated: </b>
          <span>Your partner has received </span>
          <span className="notification__highlight">{item1.title} </span>
          <span>in exchange for </span>
          <span className="notification__highlight">{item2.title}</span>
        </div>
      );
    }

    case 'Exchange.reported': {
      const {status, partnerItem, initiatorItem} = exchange;
      const item1 = status === 'reportedByInitiator' ? partnerItem : initiatorItem;
      const item2 = status === 'reportedByInitiator' ? initiatorItem : partnerItem;
      return (
        <div className="notification__title">
          <b>Reported: </b>
          <span>A problem with </span>
          <span className="notification__highlight">{item1.title} </span>
          <span>in exchange for </span>
          <span className="notification__highlight">{item2.title} </span>
          <span>occured</span>
        </div>
      );
    }
    default:
      return null;
  }
};

const getImageUrl = item => {
  const primary = getPrimaryImage(item);
  return primary ? getImageThumbnail(primary) : '/assets/img/placeholder.png';
};

const Notification = ({notification, user, onClick}) => {
  const {exchange} = notification;
  const isInitiator = exchange.initiator === user.id;

  const currentUserImgUrl = getImageUrl(
    isInitiator ? exchange.initiatorItem : exchange.partnerItem
  );
  const otherUserImgUrl = getImageUrl(isInitiator ? exchange.partnerItem : exchange.initiatorItem);

  return (
    <div
      className={classNames('notification', {
        'notification--read': notification.status === 'read'
      })}
      onClick={onClick}>
      <div className="notification__images">
        <div
          className="notification__big-img"
          style={{backgroundImage: `url(${otherUserImgUrl})`}}
        />
        <div
          className="notification__small-img"
          style={{backgroundImage: `url(${currentUserImgUrl})`}}
        />
      </div>
      <div className="notification__text">{formatTitle(notification)}</div>
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

export default Notification;
