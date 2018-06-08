import './Notification.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {getPrimaryImage, getImageThumbnail} from '../../utils/img';

const formatTitle = notification => {
  const {exchange, subject} = notification;
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
    case 'Exchange.validated':
      return (
        <div className="notification__title">
          <b>Validated: </b>
          <span>Your partner has received </span>
          <span className="notification__highlight">{exchange.initiatorItem.title} </span>
          <span>in exchange for </span>
          <span className="notification__highlight">{exchange.partnerItem.title}</span>
        </div>
      );
    case 'Exchange.reported': {
      const {status, partnerItem, initiatorItem} = exchange;
      const currentUserItem = status === 'reportedByInitiator' ? partnerItem : initiatorItem;
      const otherUserItem = status === 'reportedByInitiator' ? initiatorItem : partnerItem;
      return (
        <div className="notification__title">
          <b>Reported: </b>
          <span>A problem with </span>
          <span className="notification__highlight">{currentUserItem.title} </span>
          <span>in exchange for </span>
          <span className="notification__highlight">{otherUserItem.title} </span>
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
  return primary ? getImageThumbnail(primary) : '/assets/img/placholder.png';
}

const Notification = ({notification, user, onClick}) => {
  const {exchange} = notification;
  const isInitiator = exchange.initiator === user.id;

  const currentUserImgUrl = getImageUrl(isInitiator ? exchange.initiatorItem : exchange.partnerItem);
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
  onClick: PropTypes.func
};

export default Notification;
