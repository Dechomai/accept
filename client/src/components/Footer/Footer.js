import './Footer.scss';

import React from 'react';
import {Link} from 'react-router';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row pt-4 pb-5">
          <div className="col-6">
            <img src="/assets/logo.svg" alt="" />
          </div>
          <div className="col-6 text-right">
            <Link className="footer__link" to="/products">
              Products
            </Link>
            <Link className="footer__link" to="/services">
              Services
            </Link>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <div className="container">
          <div className="row py-2">
            <div className="col-12">
              <small>Copyright © 2020 AcceptPay Ltd. All Rights Reserved</small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
