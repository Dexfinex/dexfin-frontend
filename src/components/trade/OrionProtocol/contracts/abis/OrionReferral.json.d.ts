/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "referrer",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amountAccrued",
 "type": "uint256"
 }
 ],
 "name": "FeeAccrued",
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
 "indexed": false,
 "internalType": "address",
 "name": "verifier",
 "type": "address"
 }
 ],
 "name": "VerifierUpdate",
 "type": "event"
 },
 {
 "inputs": [
 {
 "components": [
 {
 "internalType": "address",
 "name": "referrer",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "bytes",
 "name": "signature",
 "type": "bytes"
 }
 ],
 "internalType": "struct OrionReferral.FeeOrder",
 "name": "order",
 "type": "tuple"
 }
 ],
 "name": "getFee",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IERC20",
 "name": "rewardToken_",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "verifier_",
 "type": "address"
 }
 ],
 "name": "initialize",
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
 "inputs": [],
 "name": "rewardToken",
 "outputs": [
 {
 "internalType": "contract IERC20",
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
 "name": "verifier_",
 "type": "address"
 }
 ],
 "name": "setVerifier",
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
 "name": "totalFeeAccrued",
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
 "inputs": [],
 "name": "verifier",
 "outputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 }
]

export = data