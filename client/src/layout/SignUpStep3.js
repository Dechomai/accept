import React from 'react';
import autobind from 'autobindr';

import SignUpStep3Container from '../containers/SignUp/Step3';

class SignUpStep3 extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      step4Visible: false
    };
  }

  handleChangeStep4Visibility() {
    this.setState({
      step4Visible: !this.state.step4Visible
    });
  }

  render() {
    return (
      <div className="sign-up__page ">
        <div className="container">
          <div className="row text-center">
            <div className="col-12">
              <h4 className="sign-up__header mt-5">
                {this.state.step4Visible
                  ? 'Completed!'
                  : 'Step 3. Complete your registration. Join Accept pay network'}
              </h4>
              {!this.state.step4Visible && (
                <h6 className="sign-up__subheader mt-4">Please, complete the list below</h6>
              )}
            </div>
          </div>
        </div>
        <SignUpStep3Container
          step4Visible={this.state.step4Visible}
          changeStep4Visibility={this.handleChangeStep4Visibility}
        />
      </div>
    );
  }
}

export default SignUpStep3;
