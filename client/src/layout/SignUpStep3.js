import React from 'react';

import SignUpStep3Container from '../containers/SignUp/Step3';

const SignUpStep3 = () => {
  return (
    <div className="sign-up__page ">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <h4 className="sign-up__header mt-5">
              Step 3. Complete your registration. Join Accept pay network
            </h4>
            <h6 className="sign-up__subheader mt-4">Please, complete the list below</h6>
          </div>
        </div>
      </div>
      <SignUpStep3Container />
    </div>
  );
};

export default SignUpStep3;
