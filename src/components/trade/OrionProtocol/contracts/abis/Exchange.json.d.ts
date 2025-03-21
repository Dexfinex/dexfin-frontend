/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [],
 "name": "AlreadyFilled",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ETHTransferFailed",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EthDepositRejected",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "Fallback",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "IncorrectPosition",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InsufficientBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InsufficientBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "NotCollateralAsset",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "NotEnoughBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "OnlyMatcher",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "Overflow",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ZeroReturnAmount",
 "type": "error"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes",
 "name": "secret",
 "type": "bytes"
 }
 ],
 "name": "AtomicClaimed",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 }
 ],
 "name": "AtomicLocked",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes",
 "name": "secret",
 "type": "bytes"
 }
 ],
 "name": "AtomicRedeemed",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 }
 ],
 "name": "AtomicRefunded",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint8",
 "name": "version",
 "type": "uint8"
 }
 ],
 "name": "Initialized",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "beneficiary",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "recipient",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bool",
 "name": "isDeposit",
 "type": "bool"
 },
 {
 "indexed": false,
 "internalType": "uint112",
 "name": "amount",
 "type": "uint112"
 },
 {
 "indexed": false,
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 }
 ],
 "name": "NewAssetTransaction",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "previousOwner",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "newOwner",
 "type": "address"
 }
 ],
 "name": "OwnershipTransferred",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "buyer",
 "type": "address"
 },
 {
 "indexed": true,
 "internalType": "address",
 "name": "seller",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint64",
 "name": "filledPrice",
 "type": "uint64"
 },
 {
 "indexed": false,
 "internalType": "uint192",
 "name": "filledAmount",
 "type": "uint192"
 },
 {
 "indexed": false,
 "internalType": "uint192",
 "name": "amountQuote",
 "type": "uint192"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "tradeId",
 "type": "bytes32"
 }
 ],
 "name": "Trade",
 "type": "event"
 },
 {
 "stateMutability": "nonpayable",
 "type": "fallback"
 },
 {
 "inputs": [],
 "name": "WETH",
 "outputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "assetRisks",
 "outputs": [
 {
 "internalType": "uint8",
 "name": "",
 "type": "uint8"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 }
 ],
 "name": "atomicSwaps",
 "outputs": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "bool",
 "name": "used",
 "type": "bool"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint24",
 "name": "targetChainId",
 "type": "uint24"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 }
 ],
 "name": "calcPosition",
 "outputs": [
 {
 "components": [
 {
 "internalType": "enum MarginalFunctionality.PositionState",
 "name": "state",
 "type": "uint8"
 },
 {
 "internalType": "int256",
 "name": "weightedPosition",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "totalPosition",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "totalLiabilities",
 "type": "int256"
 }
 ],
 "internalType": "struct MarginalFunctionality.Position",
 "name": "",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 }
 ],
 "name": "checkPosition",
 "outputs": [
 {
 "internalType": "bool",
 "name": "",
 "type": "bool"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "internalType": "bytes",
 "name": "secret",
 "type": "bytes"
 },
 {
 "internalType": "bytes",
 "name": "matcherSignature",
 "type": "bytes"
 }
 ],
 "name": "claimAtomic",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "deposit",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "uint112",
 "name": "amount",
 "type": "uint112"
 }
 ],
 "name": "depositAsset",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "uint112",
 "name": "amount",
 "type": "uint112"
 },
 {
 "internalType": "address",
 "name": "account",
 "type": "address"
 }
 ],
 "name": "depositAssetTo",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "account",
 "type": "address"
 }
 ],
 "name": "depositTo",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "limitOrder",
 "type": "tuple"
 },
 {
 "internalType": "uint24",
 "name": "chainId",
 "type": "uint24"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 },
 {
 "internalType": "uint64",
 "name": "lockOrderExpiration",
 "type": "uint64"
 }
 ],
 "internalType": "struct LibValidator.CrossChainOrder",
 "name": "userOrder",
 "type": "tuple"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "brokerOrder",
 "type": "tuple"
 },
 {
 "internalType": "uint64",
 "name": "filledPrice",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "filledAmount",
 "type": "uint64"
 }
 ],
 "name": "fillAndLockAtomic",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "buyOrder",
 "type": "tuple"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "sellOrder",
 "type": "tuple"
 },
 {
 "internalType": "uint64",
 "name": "filledPrice",
 "type": "uint64"
 },
 {
 "internalType": "uint112",
 "name": "filledAmount",
 "type": "uint112"
 }
 ],
 "name": "fillOrders",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint112",
 "name": "filledAmount",
 "type": "uint112"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "order",
 "type": "tuple"
 },
 {
 "internalType": "contract IAggregationExecutor",
 "name": "executor",
 "type": "address"
 },
 {
 "components": [
 {
 "internalType": "contract IERC20",
 "name": "srcToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "dstToken",
 "type": "address"
 },
 {
 "internalType": "address payable",
 "name": "srcReceiver",
 "type": "address"
 },
 {
 "internalType": "address payable",
 "name": "dstReceiver",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "minReturnAmount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "flags",
 "type": "uint256"
 }
 ],
 "internalType": "struct LibValidator.SwapDescription",
 "name": "desc",
 "type": "tuple"
 },
 {
 "internalType": "bytes",
 "name": "permit",
 "type": "bytes"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "fillThroughPools",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 }
 ],
 "name": "filledAmounts",
 "outputs": [
 {
 "internalType": "uint192",
 "name": "",
 "type": "uint192"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getBalance",
 "outputs": [
 {
 "internalType": "int192",
 "name": "",
 "type": "int192"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address[]",
 "name": "assetsAddresses",
 "type": "address[]"
 },
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getBalances",
 "outputs": [
 {
 "internalType": "int192[]",
 "name": "balances",
 "type": "int192[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getCollateralAssets",
 "outputs": [
 {
 "internalType": "address[]",
 "name": "",
 "type": "address[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "orderHash",
 "type": "bytes32"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "order",
 "type": "tuple"
 }
 ],
 "name": "getFilledAmounts",
 "outputs": [
 {
 "internalType": "int192",
 "name": "totalFilled",
 "type": "int192"
 },
 {
 "internalType": "int192",
 "name": "totalFeesPaid",
 "type": "int192"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getLiabilities",
 "outputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 },
 {
 "internalType": "uint192",
 "name": "outstandingAmount",
 "type": "uint192"
 }
 ],
 "internalType": "struct MarginalFunctionality.Liability[]",
 "name": "liabilitiesArray",
 "type": "tuple[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "initialize",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "liabilities",
 "outputs": [
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 },
 {
 "internalType": "uint192",
 "name": "outstandingAmount",
 "type": "uint192"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "liquidationPremium",
 "outputs": [
 {
 "internalType": "uint8",
 "name": "",
 "type": "uint8"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint24",
 "name": "targetChainId",
 "type": "uint24"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 }
 ],
 "internalType": "struct LibAtomic.LockOrder",
 "name": "swap",
 "type": "tuple"
 }
 ],
 "name": "lockAtomic",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "account",
 "type": "address"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint24",
 "name": "targetChainId",
 "type": "uint24"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 }
 ],
 "internalType": "struct LibAtomic.LockOrder",
 "name": "lockOrder",
 "type": "tuple"
 }
 ],
 "name": "lockAtomicByMatcher",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "owner",
 "outputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "positionOverdue",
 "outputs": [
 {
 "internalType": "uint64",
 "name": "",
 "type": "uint64"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "priceOverdue",
 "outputs": [
 {
 "internalType": "uint64",
 "name": "",
 "type": "uint64"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "claimReceiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibAtomic.RedeemOrder",
 "name": "order1",
 "type": "tuple"
 },
 {
 "internalType": "bytes",
 "name": "secret1",
 "type": "bytes"
 },
 {
 "components": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "claimReceiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibAtomic.RedeemOrder",
 "name": "order2",
 "type": "tuple"
 },
 {
 "internalType": "bytes",
 "name": "secret2",
 "type": "bytes"
 }
 ],
 "name": "redeem2Atomics",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "sender",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "receiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "claimReceiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "asset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibAtomic.RedeemOrder",
 "name": "order",
 "type": "tuple"
 },
 {
 "internalType": "bytes",
 "name": "secret",
 "type": "bytes"
 }
 ],
 "name": "redeemAtomic",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 }
 ],
 "name": "refundAtomic",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "renounceOwnership",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 }
 ],
 "name": "secrets",
 "outputs": [
 {
 "internalType": "bool",
 "name": "",
 "type": "bool"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "account",
 "type": "address"
 },
 {
 "internalType": "int192",
 "name": "amount",
 "type": "int192"
 }
 ],
 "name": "setAssetBalance",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "orionToken",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "priceOracleAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "allowedMatcher",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "WETH_",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "claimAtomicFee",
 "type": "uint64"
 }
 ],
 "name": "setBasicParams",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "stakeRisk",
 "outputs": [
 {
 "internalType": "uint8",
 "name": "",
 "type": "uint8"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IAggregationExecutor",
 "name": "executor",
 "type": "address"
 },
 {
 "components": [
 {
 "internalType": "contract IERC20",
 "name": "srcToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "dstToken",
 "type": "address"
 },
 {
 "internalType": "address payable",
 "name": "srcReceiver",
 "type": "address"
 },
 {
 "internalType": "address payable",
 "name": "dstReceiver",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "minReturnAmount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "flags",
 "type": "uint256"
 }
 ],
 "internalType": "struct LibValidator.SwapDescription",
 "name": "desc",
 "type": "tuple"
 },
 {
 "internalType": "bytes",
 "name": "permit",
 "type": "bytes"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "swap",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "spentAmount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "gasLeft",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "newOwner",
 "type": "address"
 }
 ],
 "name": "transferOwnership",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address[]",
 "name": "assets",
 "type": "address[]"
 },
 {
 "internalType": "uint8[]",
 "name": "risks",
 "type": "uint8[]"
 }
 ],
 "name": "updateAssetRisks",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address[]",
 "name": "_collateralAssets",
 "type": "address[]"
 },
 {
 "internalType": "uint8",
 "name": "_stakeRisk",
 "type": "uint8"
 },
 {
 "internalType": "uint8",
 "name": "_liquidationPremium",
 "type": "uint8"
 },
 {
 "internalType": "uint64",
 "name": "_priceOverdue",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "_positionOverdue",
 "type": "uint64"
 }
 ],
 "name": "updateMarginalSettings",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "limitOrder",
 "type": "tuple"
 },
 {
 "internalType": "uint24",
 "name": "chainId",
 "type": "uint24"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash",
 "type": "bytes32"
 },
 {
 "internalType": "uint64",
 "name": "lockOrderExpiration",
 "type": "uint64"
 }
 ],
 "internalType": "struct LibValidator.CrossChainOrder",
 "name": "userOrder",
 "type": "tuple"
 }
 ],
 "name": "validateCrossChainOrder",
 "outputs": [
 {
 "internalType": "bool",
 "name": "isValid",
 "type": "bool"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "senderAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherAddress",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "baseAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "quoteAsset",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "matcherFeeAsset",
 "type": "address"
 },
 {
 "internalType": "uint64",
 "name": "amount",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "matcherFee",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "nonce",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint8",
 "name": "buySide",
 "type": "uint8"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct LibValidator.Order",
 "name": "order",
 "type": "tuple"
 }
 ],
 "name": "validateOrder",
 "outputs": [
 {
 "internalType": "bool",
 "name": "isValid",
 "type": "bool"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "uint112",
 "name": "amount",
 "type": "uint112"
 }
 ],
 "name": "withdraw",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "assetAddress",
 "type": "address"
 },
 {
 "internalType": "uint112",
 "name": "amount",
 "type": "uint112"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "withdrawTo",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "stateMutability": "payable",
 "type": "receive"
 }
]
export = data