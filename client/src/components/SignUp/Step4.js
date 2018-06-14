import './Step4.scss';

import React from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';

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
                <h5 className="sign-up-step4__title">Welcome bonus for registration</h5>
                <p className="sign-up-step4__gift-text">
                  You`ve successfully created an Account. Your selected MetaMask account is granted
                  with 20 Fulcrum tokens.
                </p>
                <div className="sign-up-step4__contract-address">
                  <h5 className="mb-3">Display your tokens</h5>
                  <p className="sign-up-step4__contract-address__info">
                    In order to display your current Fulcrum balance in MetaMask, please use “Add
                    Token” option within MetaMask plugin by using the following token address:
                  </p>
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
                    welcome bonus is already on your balance
                  </p>
                  <div className="sign-up-step4__gift-btn__wrapper">
                    <Button
                      className="sign-up-step4__gift-btn text-center"
                      color="primary"
                      onClick={onClickOk}>
                      OK
                    </Button>
                  </div>
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
