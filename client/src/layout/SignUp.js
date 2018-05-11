import React from 'react';

import SignUpContainer from '../containers/SignUp/SignUp';

const SignUp = () => {
  return (
    <div className="sign-up__page ">
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <h4 className="sign-up__header mt-5">Step2. Create personal profile</h4>
            <h6 className="sign-up__subheader mt-4">Please fill in all the required fields</h6>
          </div>
        </div>
      </div>
      <SignUpContainer />
    </div>
  );
};

export default SignUp;
