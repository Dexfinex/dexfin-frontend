/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "_pair",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_router",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_WETH9",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "_stakingRewards",
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
 "internalType": "uint256",
 "name": "amount0V1",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount1V1",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount0V2",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount1V2",
 "type": "uint256"
 }
 ],
 "name": "TestCalc",
 "type": "event"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "tokensToMigrate",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount0Min",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amount1Min",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "deadline",
 "type": "uint256"
 }
 ],
 "name": "migrate",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 }
]
export = data