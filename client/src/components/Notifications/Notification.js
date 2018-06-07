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
    default:
      return null;
  }
};

const Notification = ({notification, onClick}) => {
  const {exchange} = notification;

  const initiatorItemPrimaryImageUrl = getPrimaryImage(exchange.initiatorItem);
  const initiatorImgUrl = initiatorItemPrimaryImageUrl
    ? getImageThumbnail(initiatorItemPrimaryImageUrl)
    : '/assets/img/placeholder.png';
  const partnerItemPrimaryImageUrl = getPrimaryImage(exchange.partnerItem);
  const partnerImgUrl = partnerItemPrimaryImageUrl
    ? getImageThumbnail(partnerItemPrimaryImageUrl)
    : '/assets/img/placeholder.png';

  return (
    <div
      className={classNames('notification', {
        'notification--read': notification.status === 'read'
      })}
      onClick={onClick}>
      <div className="notification__images">
        <div
          className="notification__initiator-img"
          style={{backgroundImage: `url(${initiatorImgUrl})`}}
        />
        <div
          className="notification__partner-img"
          style={{backgroundImage: `url(${partnerImgUrl})`}}
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
