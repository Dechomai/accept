module.exports = {
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'initiatorItem',
      outputs: [
        {name: 'name', type: 'string'},
        {name: 'quantity', type: 'uint256'},
        {name: 'hasFeedback', type: 'bool'},
        {name: 'isClientSatisfied', type: 'bool'}
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'accept',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'reject',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'initiator',
      outputs: [{name: '', type: 'address'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'initiate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'contractBalance',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'price',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'partnerItem',
      outputs: [
        {name: 'name', type: 'string'},
        {name: 'quantity', type: 'uint256'},
        {name: 'hasFeedback', type: 'bool'},
        {name: 'isClientSatisfied', type: 'bool'}
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'partner',
      outputs: [{name: '', type: 'address'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'state',
      outputs: [{name: '', type: 'uint8'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'cancel',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'token',
      outputs: [{name: '', type: 'address'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_isSatisfied', type: 'bool'}],
      name: 'giveInitiatorItemFeedback',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_isSatisfied', type: 'bool'}],
      name: 'givePartnerItemFeedback',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {name: 'initiatorItemName', type: 'string'},
        {name: 'initiatorItemQuantity', type: 'uint256'},
        {name: 'partnerItemName', type: 'string'},
        {name: 'partnerItemQuantity', type: 'uint256'},
        {name: '_price', type: 'uint256'},
        {name: '_initiator', type: 'address'},
        {name: '_partner', type: 'address'},
        {name: '_token', type: 'address'}
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [{indexed: false, name: '_state', type: 'uint8'}],
      name: 'ChangedState',
      type: 'event'
    }
  ]
};
