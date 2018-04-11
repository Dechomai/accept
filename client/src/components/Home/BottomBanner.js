import './BottomBanner.scss';
import React from 'react';
import {Button} from 'reactstrap';

import Icon from '../common/Icon/Icon';

const BottomBanner = () => {
  return (
    <div className="bottom-banner">
      <div className="bottom-banner__content">
        <h1 className="bottom-banner__content__text">Why Accept?</h1>
        <h4>We&apos;re more than a marketpalce</h4>
        <Button disabled color="primary" className="btn-with-icon bottom-banner__content__btn">
          <span>About Accept</span>
          <Icon name="arrow-right" className="ml-3" />
        </Button>
      </div>
    </div>
  );
};

export default BottomBanner;
