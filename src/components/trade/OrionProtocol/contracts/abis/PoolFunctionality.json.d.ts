/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "_factory",
 "type": "address"
 },
 {
 "internalType": "enum IPoolFunctionality.FactoryType",
 "name": "_type",
 "type": "uint8"
 },
 {
 "internalType": "address",
 "name": "_WETH",
 "type": "address"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "constructor"
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
 "name": "st",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "rt",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "st_r",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "st_a",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rt_r",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rt_a",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "f",
 "type": "address"
 }
 ],
 "name": "OrionPoolSwap",
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
 "name": "tokenA",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "tokenB",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amountADesired",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountBDesired",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountAMin",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountBMin",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "addLiquidityFromExchange",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "amountA",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountB",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "liquidity",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 },
 {
 "components": [
 {
 "internalType": "uint112",
 "name": "amount_spend",
 "type": "uint112"
 },
 {
 "internalType": "uint112",
 "name": "amount_receive",
 "type": "uint112"
 },
 {
 "internalType": "address",
 "name": "orionpool_router",
 "type": "address"
 },
 {
 "internalType": "bool",
 "name": "is_exact_spend",
 "type": "bool"
 },
 {
 "internalType": "bool",
 "name": "supportingFee",
 "type": "bool"
 },
 {
 "internalType": "bool",
 "name": "isInContractTrade",
 "type": "bool"
 },
 {
 "internalType": "bool",
 "name": "isSentETHEnough",
 "type": "bool"
 },
 {
 "internalType": "bool",
 "name": "isFromWallet",
 "type": "bool"
 },
 {
 "internalType": "address",
 "name": "asset_spend",
 "type": "address"
 },
 {
 "internalType": "address[]",
 "name": "path",
 "type": "address[]"
 }
 ],
 "internalType": "struct IPoolFunctionality.SwapData",
 "name": "swapData",
 "type": "tuple"
 }
 ],
 "name": "doSwapThroughOrionPool",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "amountOut",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountIn",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "factories",
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
 "name": "factory",
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
 "name": "getFactoriesLength",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getWETH",
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
 "internalType": "address[]",
 "name": "tokens",
 "type": "address[]"
 },
 {
 "internalType": "address[]",
 "name": "tos",
 "type": "address[]"
 },
 {
 "internalType": "uint256[]",
 "name": "amounts",
 "type": "uint256[]"
 }
 ],
 "name": "increaseAllowances",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "a",
 "type": "address"
 }
 ],
 "name": "isFactory",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "curFactory",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "tokenA",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "tokenB",
 "type": "address"
 }
 ],
 "name": "pairFor",
 "outputs": [
 {
 "internalType": "address",
 "name": "pair",
 "type": "address"
 }
 ],
 "stateMutability": "view",
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
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "supportedFactories",
 "outputs": [
 {
 "internalType": "enum IPoolFunctionality.FactoryType",
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
 "name": "_factories",
 "type": "address[]"
 },
 {
 "internalType": "enum IPoolFunctionality.FactoryType[]",
 "name": "_types",
 "type": "uint8[]"
 }
 ],
 "name": "updateFactories",
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