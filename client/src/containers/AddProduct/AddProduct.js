import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {compose} from 'ramda';

import AddProductForm from '../../components/AddProductForm/AddProductForm';

const AddProduct = () => {
  return <AddProductForm />;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(AddProduct);
