import './Wallet.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

import clipboard from '../../services/clipboard';
import Icon from '../../components/common/Icon/Icon';
import {Button} from 'reactstrap';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  copyToClipboard() {
    clipboard.write(this.props.address);
  }

  render() {
    return (
      <div className="wallet">
        <Icon className="wallet__icon" name="wallet" />
        <div className="wallet__address">
          {this.props.address.substring(0, 20).toLowerCase()}...
        </div>
        <Button className="wallet__copy" color="copy" onClick={this.copyToClipboard}>
          Copy
        </Button>
      </div>
    );
  }
}

Wallet.propTypes = {
  address: PropTypes.string.isRequired
};

export default Wallet;
