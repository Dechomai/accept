import {shallow} from 'enzyme';

import {formatTitle} from '../Notification';

const notification = {
  status: 'new',
  subject: 'Exchange.validated',
  recepient: 'user1',
  exchange: {
    status: 'completed',
    initiator: 'user1',
    partner: 'user2',
    initiatorItem: {
      title: 'INITIATOR ITEM'
    },
    partnerItem: {
      title: 'PARTNER ITEM'
    }
  }
};

describe('Components > Notification', () => {
  describe(':formatTitle', () => {
    describe('Exchange.new', () => {
      it('should format title accordingly', () => {
        notification.subject = 'Exchange.new';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual('New Offer: INITIATOR ITEM exchange for PARTNER ITEM');
      });
    });

    describe('Exchange.accepted', () => {
      it('should format title accordingly', () => {
        notification.subject = 'Exchange.accepted';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Accepted: INITIATOR ITEM was accepted to trade for PARTNER ITEM'
        );
      });
    });

    describe('Exchange.rejected', () => {
      it('should format title accordingly', () => {
        notification.subject = 'Exchange.rejected';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Rejected: INITIATOR ITEM in exchange for PARTNER ITEM offer was rejected'
        );
      });
    });

    describe('Exchange.validated', () => {
      it('should format title accordingly for partner when initiator validates', () => {
        notification.subject = 'Exchange.validated';
        notification.recepient = 'user2';
        notification.exchange.initiator = 'user1';
        notification.exchange.partner = 'user2';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Validated: Your partner has received PARTNER ITEM in exchange for INITIATOR ITEM'
        );
      });

      it('should format title accordingly for initiator when partner validates', () => {
        notification.subject = 'Exchange.validated';
        notification.recepient = 'user1';
        notification.exchange.initiator = 'user1';
        notification.exchange.partner = 'user2';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Validated: Your partner has received INITIATOR ITEM in exchange for PARTNER ITEM'
        );
      });
    });

    describe('Exchange.reported', () => {
      it('should format title accordingly for exchange initiator', () => {
        notification.subject = 'Exchange.reported';
        notification.exchange.status = 'reportedByPartner';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Reported: A problem with INITIATOR ITEM in exchange for PARTNER ITEM occured'
        );
      });

      it('should format title accordingly for exchange partner', () => {
        notification.subject = 'Exchange.reported';
        notification.exchange.status = 'reportedByInitiator';
        const wrapper = shallow(formatTitle(notification));
        expect(wrapper.text()).toEqual(
          'Reported: A problem with PARTNER ITEM in exchange for INITIATOR ITEM occured'
        );
      });
    });
  });
});
