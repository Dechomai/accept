import React from 'react';
import AllServicesContainer from '../containers/Services/All';

const AllServices = () => {
  return (
    <div className="all-Services__page mb-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-5">Services</h4>
          </div>
        </div>
        <AllServicesContainer />
      </div>
    </div>
  );
};

export default AllServices;
