import './Step4.scss';

import React from 'react';
import {Button} from 'reactstrap';
import config from '../../config';
import clipboard from '../../services/clipboard';
import PropTypes from 'prop-types';

const copyTokenContractAddressToClipboard = () => {
  clipboard.write(config.bcTokenContractAddress);
};

const SignUpStep4 = ({onClickOk}) => {
  return (
    <div className="sign-up">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-8">
            <div className="sign-up-step4__wrapper">
              <div className="sign-up-step4">
                <div className="sign-up-step4__gift">
                  <img className="sign-up-step4__gift__img" src="/assets/img/gift.png" alt="" />
                </div>
                <h5 className="sign-up-step4__title">
                  AcceptPay welcomes new users with bonus Fulcrum tokens!
                </h5>
                <p className="sign-up-step4__gift-text">
                  After you complete the final step of registration your selected MetaMask account
                  will be granted with X Fulcrum tokens and Y ethereum
                </p>
                <Button className="sign-up-step4__gift-btn" color="primary" onClick={onClickOk}>
                  OK
                </Button>
                <div className="sign-up-step4__contract-address">
                  <h5 className="mb-3">How to see bonus tokens in MetaMask?</h5>
                  <p className="sign-up-step4__contract-address__info">
                    In order to display your current Fulcrum balance in MetaMask, please use “Add
                    Token” option within MetaMask plugin by using the following token address
                  </p>
                  <div className="form-group">
                    <label>Token contract Address</label>
                    <div className="sign-up-step4__contract-address__url">
                      {config.bcTokenContractAddress}
                      <Button color="copy" onClick={copyTokenContractAddressToClipboard}>
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="sign-up-step4__info-images">
                    <img
                      className="sign-up-step4__info-images__img"
                      src="/assets/img/contract-address1.png"
                      alt=""
                    />
                    <img
                      className="sign-up-step4__info-images__img"
                      src="/assets/img/contract-address2.png"
                      alt=""
                    />
                    <img
                      className="sign-up-step4__info-images__img"
                      src="/assets/img/contract-address3.png"
                      alt=""
                    />
                  </div>
                  <p className="sign-up-step4__contract-address__info">
                    Regardless of whether you’ve added a Fulcrum token within MetaMask plugin, the
                    welcome bonus will still be added to your balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SignUpStep4.propTypes = {
  onClickOk: PropTypes.func.isRequired
};

export default SignUpStep4;
