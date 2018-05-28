module.exports = {
  abi: [
    {
      constant: false,
      inputs: [{name: 'newSellPrice', type: 'uint256'}, {name: 'newBuyPrice', type: 'uint256'}],
      name: 'setPrices',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{name: '', type: 'string'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_spender', type: 'address'}, {name: '_value', type: 'uint256'}],
      name: 'approve',
      outputs: [{name: '', type: 'bool'}],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {name: '_from', type: 'address'},
        {name: '_to', type: 'address'},
        {name: '_value', type: 'uint256'}
      ],
      name: 'transferFrom',
      outputs: [{name: '', type: 'bool'}],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{name: '', type: 'address'}],
      name: 'balances',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{name: '', type: 'uint8'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_value', type: 'uint256'}],
      name: 'burn',
      outputs: [{name: 'success', type: 'bool'}],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'sellPrice',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{name: '', type: 'address'}, {name: '', type: 'address'}],
      name: 'allowances',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{name: '_owner', type: 'address'}],
      name: 'balanceOf',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_from', type: 'address'}, {name: '_value', type: 'uint256'}],
      name: 'burnFrom',
      outputs: [{name: 'success', type: 'bool'}],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'buyPrice',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{name: '', type: 'address'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{name: '', type: 'string'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'buy',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: '_to', type: 'address'}, {name: '_value', type: 'uint256'}],
      name: 'transfer',
      outputs: [{name: '', type: 'bool'}],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [{name: '_owner', type: 'address'}, {name: '_spender', type: 'address'}],
      name: 'allowance',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: 'amount', type: 'uint256'}],
      name: 'sell',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [{name: 'newOwner', type: 'address'}],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {name: '_initialSupply', type: 'uint256'},
        {name: '_name', type: 'string'},
        {name: '_symbol', type: 'string'}
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, name: 'from', type: 'address'},
        {indexed: false, name: 'value', type: 'uint256'}
      ],
      name: 'Burn',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, name: '_from', type: 'address'},
        {indexed: true, name: '_to', type: 'address'},
        {indexed: false, name: '_value', type: 'uint256'}
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {indexed: true, name: '_owner', type: 'address'},
        {indexed: true, name: '_spender', type: 'address'},
        {indexed: false, name: '_value', type: 'uint256'}
      ],
      name: 'Approval',
      type: 'event'
    }
  ],
  bytecode:
    '0x60806040526012600460006101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b506040516200156b3803806200156b833981018060405281019080805190602001909291908051820192919060200180518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600460009054906101000a900460ff1660ff16600a0a8302600181905550600154600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600290805190602001906200012292919062000145565b5080600390805190602001906200013b92919062000145565b50505050620001f4565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200018857805160ff1916838001178555620001b9565b82800160010185558215620001b9579182015b82811115620001b85782518255916020019190600101906200019b565b5b509050620001c89190620001cc565b5090565b620001f191905b80821115620001ed576000816000905550600101620001d3565b5090565b90565b61136780620002046000396000f300608060405260043610610112576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806305fefda71461011757806306fdde031461014e578063095ea7b3146101de57806318160ddd1461024357806323b872dd1461026e57806327e235e3146102f3578063313ce5671461034a57806342966c681461037b5780634b750334146103c057806355b6ed5c146103eb57806370a082311461046257806379cc6790146104b95780638620410b1461051e5780638da5cb5b1461054957806395d89b41146105a0578063a6f2ae3a14610630578063a9059cbb1461063a578063dd62ed3e1461069f578063e4849b3214610716578063f2fde38b14610743575b600080fd5b34801561012357600080fd5b5061014c6004803603810190808035906020019092919080359060200190929190505050610786565b005b34801561015a57600080fd5b506101636107f3565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101a3578082015181840152602081019050610188565b50505050905090810190601f1680156101d05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101ea57600080fd5b50610229600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610895565b604051808215151515815260200191505060405180910390f35b34801561024f57600080fd5b50610258610987565b6040518082815260200191505060405180910390f35b34801561027a57600080fd5b506102d9600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610991565b604051808215151515815260200191505060405180910390f35b3480156102ff57600080fd5b50610334600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610abf565b6040518082815260200191505060405180910390f35b34801561035657600080fd5b5061035f610ad7565b604051808260ff1660ff16815260200191505060405180910390f35b34801561038757600080fd5b506103a660048036038101908080359060200190929190505050610aee565b604051808215151515815260200191505060405180910390f35b3480156103cc57600080fd5b506103d5610bf2565b6040518082815260200191505060405180910390f35b3480156103f757600080fd5b5061044c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610bf8565b6040518082815260200191505060405180910390f35b34801561046e57600080fd5b506104a3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c1d565b6040518082815260200191505060405180910390f35b3480156104c557600080fd5b50610504600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c66565b604051808215151515815260200191505060405180910390f35b34801561052a57600080fd5b50610533610e80565b6040518082815260200191505060405180910390f35b34801561055557600080fd5b5061055e610e86565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156105ac57600080fd5b506105b5610eab565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156105f55780820151818401526020810190506105da565b50505050905090810190601f1680156106225780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610638610f4d565b005b34801561064657600080fd5b50610685600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f6e565b604051808215151515815260200191505060405180910390f35b3480156106ab57600080fd5b50610700600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f83565b6040518082815260200191505060405180910390f35b34801561072257600080fd5b506107416004803603810190808035906020019092919050505061100a565b005b34801561074f57600080fd5b50610784600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611090565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107e157600080fd5b81600581905550806006819055505050565b606060028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561088b5780601f106108605761010080835404028352916020019161088b565b820191906000526020600020905b81548152906001019060200180831161086e57829003601f168201915b5050505050905090565b600081600860003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000600154905090565b6000600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610a1e57600080fd5b81600860008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550610ab384848461112e565b50600190509392505050565b60076020528060005260406000206000915090505481565b6000600460009054906101000a900460ff16905090565b600081600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610b3e57600080fd5b81600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816001600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a260019050919050565b60055481565b6008602052816000526040600020602052806000526040600020600091509150505481565b6000600760008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610cb657600080fd5b600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211151515610d4157600080fd5b81600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816001600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a26001905092915050565b60065481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f435780601f10610f1857610100808354040283529160200191610f43565b820191906000526020600020905b815481529060010190602001808311610f2657829003601f168201915b5050505050905090565b600060065434811515610f5c57fe5b049050610f6a30338361112e565b5050565b6000610f7b33848461112e565b905092915050565b6000600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600060055482029050803073ffffffffffffffffffffffffffffffffffffffff16311015151561103957600080fd5b61104433308461112e565b503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561108b573d6000803e3d6000fd5b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156110eb57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000808373ffffffffffffffffffffffffffffffffffffffff161415151561115557600080fd5b81600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156111a357600080fd5b600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020540111151561123157600080fd5b81600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905093925050505600a165627a7a7230582013ef27f45af01b48819f5b2efe718be812167350283677b823f4fe070ff9e4840029'
};
