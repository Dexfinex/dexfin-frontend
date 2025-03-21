/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "publicKey",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_baseAsset",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "assetPrices",
 "outputs": [
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "baseAsset",
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
 "name": "chainLinkETHAggregator",
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
 "name": "added",
 "type": "address[]"
 },
 {
 "internalType": "address[]",
 "name": "removed",
 "type": "address[]"
 }
 ],
 "name": "changePriceProviderAuthorization",
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
 }
 ],
 "name": "getChainLinkPriceData",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address[]",
 "name": "assetAddresses",
 "type": "address[]"
 }
 ],
 "name": "givePrices",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint64",
 "name": "price",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 }
 ],
 "internalType": "struct PriceOracle.PriceDataOut[]",
 "name": "",
 "type": "tuple[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "oraclePublicKey",
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
 "name": "",
 "type": "address"
 }
 ],
 "name": "priceProviderAuthorization",
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
 "components": [
 {
 "internalType": "address[]",
 "name": "assetAddresses",
 "type": "address[]"
 },
 {
 "internalType": "uint64[]",
 "name": "prices",
 "type": "uint64[]"
 },
 {
 "internalType": "uint64",
 "name": "timestamp",
 "type": "uint64"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct PriceOracle.Prices",
 "name": "priceFeed",
 "type": "tuple"
 }
 ],
 "name": "provideDataAddressAuthorization",
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
 "internalType": "address[]",
 "name": "assets",
 "type": "address[]"
 },
 {
 "internalType": "address[]",
 "name": "aggregatorAddresses",
 "type": "address[]"
 }
 ],
 "name": "setChainLinkAggregators",
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