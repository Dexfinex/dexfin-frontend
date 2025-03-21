/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 { "internalType": "address", "name": "_smartVote", "type": "address" },
 {
 "internalType": "address",
 "name": "_libStakingReward",
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
 "name": "pool",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "address",
 "name": "smart",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint8",
 "name": "decimals",
 "type": "uint8"
 }
 ],
 "name": "CreateSmartReward",
 "type": "event"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" }
 ],
 "name": "allStake",
 "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" }
 ],
 "name": "claimReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" }
 ],
 "name": "createSmartReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "uint256", "name": "amount", "type": "uint256" },
 { "internalType": "uint256", "name": "lock_period", "type": "uint256" }
 ],
 "name": "create_lock_period",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "address", "name": "account", "type": "address" }
 ],
 "name": "getBoost",
 "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "address", "name": "account", "type": "address" }
 ],
 "name": "getReward",
 "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "address", "name": "account", "type": "address" }
 ],
 "name": "getStake",
 "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "uint256", "name": "amount", "type": "uint256" }
 ],
 "name": "increase_amount",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 {
 "internalType": "uint256",
 "name": "new_lock_period",
 "type": "uint256"
 }
 ],
 "name": "increase_lock_period",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "libStakingReward",
 "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
 "name": "listSmartReward",
 "outputs": [
 {
 "internalType": "contract IStakingReward",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "address", "name": "account", "type": "address" }
 ],
 "name": "lockTimePeriod",
 "outputs": [{ "internalType": "uint48", "name": "", "type": "uint48" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" },
 { "internalType": "address", "name": "account", "type": "address" }
 ],
 "name": "lockTimeStart",
 "outputs": [{ "internalType": "uint48", "name": "", "type": "uint48" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "smartVote",
 "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 { "internalType": "address", "name": "pool", "type": "address" }
 ],
 "name": "withdraw",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 }
]

export = data