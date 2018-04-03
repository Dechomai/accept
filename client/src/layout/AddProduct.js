import React from 'react';

import AddProductContainer from '../containers/AddProduct/AddProduct';

const AddProduct = () => {
  return (
    <div className="add-product__page ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-4 mb-4">Create your listing</h4>
          </div>
        </div>
      </div>
      <AddProductContainer />
    </div>
  );
};

export default AddProduct;
