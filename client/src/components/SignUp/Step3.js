import './Step3.scss';

import React from 'react';
import {Button, Alert} from 'reactstrap';
import Icon from '../common/Icon/Icon';

const SignUp = () => {
  return (
    <div className="sign-up">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-8">
            <div className="sign-up-step3 mt-5">
              <div className="sign-up-step3__block">
                <div className="row">
                  <div className="col-8">
                    <div className="sign-up-step3__info">
                      <div className="sign-up-step3__status" />
                      <h5 className="sign-up-step3__header">Metamask Plugin</h5>
                      <p className="sign-up-step3__description">
                        Looks like you don`t have MetaMask, please install it by the following link{' '}
                        <a href="https://metamask.io/">metamask.io</a> and press check again
                      </p>
                      <Button outline color="primary">
                        Check again
                      </Button>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="sign-up-step3__photo">
                      <img
                        className="sign-up-step3__photo__img"
                        src="/assets/img/metamask-plugin.png"
                        alt="Accept"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sign-up-step3__block">
                <div className="row">
                  <div className="col-8">
                    <div className="sign-up-step3__info">
                      <div className="sign-up-step3__status sign-up-step3__status--failed" />
                      <h5 className="sign-up-step3__header">Account connection</h5>
                      <p className="sign-up-step3__description">
                        Please, create/select MetaMask account which you would like to connect to
                        our Accept Pay Network and press <b>connect account button</b>
                      </p>
                      <Alert color="warning">
                        <Icon name="alert" size="16" />
                        <div>Once you connect Account, you couldn’t change it.</div>
                      </Alert>
                      <div className="form-group">
                        <label>Account address</label>
                        <input className="form-control" type="text" />
                      </div>
                      <Button outline color="primary">
                        Connect account
                      </Button>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="sign-up-step3__photo">
                      <img
                        className="sign-up-step3__photo__img"
                        src="/assets/img/acc-connection.png"
                        alt="Accept"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sign-up-step3__block">
                <div className="row">
                  <div className="col-8">
                    <div className="sign-up-step3__info">
                      <div className="sign-up-step3__status sign-up-step3__status--completed" />
                      <h5 className="sign-up-step3__header">Join our Accept Pay Network</h5>
                      <p className="sign-up-step3__description">
                        Please, connect to custom RPC and incert following URL
                      </p>
                      <Alert color="warning">
                        <Icon name="alert" size="16" />
                        <div>Once you connect Account, you couldn’t change it.</div>
                      </Alert>
                      <div className="form-group">
                        <label>Accept Pay Network URL</label>
                        <input className="form-control" type="text" />
                      </div>
                      <Button outline color="primary">
                        Check connection
                      </Button>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="sign-up-step3__photo">
                      <img
                        className="sign-up-step3__photo__img"
                        src="/assets/img/join-accept.png"
                        alt="Accept"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sign-up__footer">
        <button className="btn btn-primary">Create profile</button>
      </div>
    </div>
  );
};

export default SignUp;
