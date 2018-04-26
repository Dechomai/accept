import React from 'react';

import EditServiceContainer from '../containers/Service/Editor';

const EditProduct = () => {
  return (
    <div className="add-service__page ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-4 mb-4">Edit your service</h4>
          </div>
        </div>
      </div>
      <EditServiceContainer />
    </div>
  );
};

export default EditProduct;
