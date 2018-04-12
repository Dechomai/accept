import React from 'react';
import AllProductsContainer from '../containers/Products/AllProducts';

const AllProducts = () => {
  return (
    <div className="all-products__page mb-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4 className="mt-5">All Products</h4>
          </div>
        </div>
        <AllProductsContainer />
      </div>
    </div>
  );
};

export default AllProducts;
