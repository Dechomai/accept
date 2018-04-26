import React from 'react';

import AddServiceContainer from '../containers/Service/Editor';

const AddService = () => {
  return (
    <div className="add-service__page ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-4 mb-4">Offer Service</h4>
          </div>
        </div>
      </div>
      <AddServiceContainer />
    </div>
  );
};

export default AddService;
