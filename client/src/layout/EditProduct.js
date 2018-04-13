import React from 'react';

import EditProductContainer from '../containers/Product/AddEdit';

const EditProduct = () => {
  return (
    <div className="add-product__page ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-4 mb-4">Edit your listing</h4>
          </div>
        </div>
      </div>
      <EditProductContainer />
    </div>
  );
};

export default EditProduct;
