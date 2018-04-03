import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';

import AddProductFrom from '../../components/AddProductForm/AddProductForm';

const AddProduct = () => {
  return <AddProductFrom />;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddProduct);
