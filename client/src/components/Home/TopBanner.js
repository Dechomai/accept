import './TopBanner.scss';
import React from 'react';
import {Button} from 'reactstrap';

const TopBanner = () => {
  return (
    <div className="top-banner">
      <div className="top-banner__content">
        <h1 className="top-banner__content__text">Buy, Sell or Trade with Accept</h1>
        <a href="/signup">
          <Button color="primary" className="top-banner__content__btn">
            Sign Up Now
          </Button>
        </a>
      </div>
    </div>
  );
};

export default TopBanner;
