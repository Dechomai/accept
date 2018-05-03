import React from 'react';
import autobind from 'autobindr';
import ExchangeStep1 from '../../components/Exchange/Step1';
// import ExchangeStep2 from '../../components/Exchange/Step2';

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      modalStep1: true,
      modalStep2: false
    };
  }

  toggle(modal) {
    this.setState({
      [modal]: !this.state[modal]
    });
    this.props.toggleExchangeContainer();
  }

  render() {
    return (
      <div>
        <ExchangeStep1
          isOpen={this.state.modalStep1}
          toggle={() => {
            this.toggle('modalStep1');
          }}
        />
        {/*<ExchangeStep2 />*/}
      </div>
    );
  }
}

export default Exchange;
