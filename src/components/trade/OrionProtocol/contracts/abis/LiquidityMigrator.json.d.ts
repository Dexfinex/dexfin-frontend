/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
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
 "name": "WETH9",
 "outputs": [
 {
 "internalType": "contract IWETH9",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "exchange",
 "outputs": [
 {
 "internalType": "contract IExchangeWithAtomic",
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
 "name": "exchangeAllowances",
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
 "name": "_exchange",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_WETH9",
 "type": "address"
 }
 ],
 "name": "initialize",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pairAddress",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "tokensToMigrate",
 "type": "uint256"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash0",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32",
 "name": "secretHash1",
 "type": "bytes32"
 },
 {
 "internalType": "uint64",
 "name": "expiration",
 "type": "uint64"
 },
 {
 "internalType": "uint24",
 "name": "targetChainId",
 "type": "uint24"
 }
 ],
 "name": "migrate",
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
 "name": "renounceOwnership",
 "outputs": [],
 "stateMutability": "nonpayable",
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
 }
]
export = data