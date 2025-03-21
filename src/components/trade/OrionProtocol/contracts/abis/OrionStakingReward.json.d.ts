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
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 }
 ],
 "name": "RewardAdded",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 }
 ],
 "name": "RewardPaid",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "Staked",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "balances_account",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewardPerToken",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "userRewardPerTokenPaid_account",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewards_account",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "voting_contract_getPoolRewards",
 "type": "uint256"
 }
 ],
 "name": "TestEarnedCalc",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "_rewardPerToken",
 "type": "uint256"
 }
 ],
 "name": "TestRewardPerToken",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "_rewardPerTokenStored",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "_voting_pool_accumulator_stored",
 "type": "uint256"
 }
 ],
 "name": "TestUpdateReward",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewards",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "userRewardPerTokenPaid",
 "type": "uint256"
 }
 ],
 "name": "TestUpdateRewardUser",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "Withdrawn",
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
 "name": "_balances",
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
 "name": "account",
 "type": "address"
 }
 ],
 "name": "balanceOf",
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
 "name": "account",
 "type": "address"
 }
 ],
 "name": "earned",
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
 "name": "asset",
 "type": "address"
 }
 ],
 "name": "emergencyAssetWithdrawal",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "exit",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "_stakingToken",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "voting_contract_address",
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
 "name": "rewardPerToken",
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
 "name": "rewardPerTokenStored",
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
 "name": "",
 "type": "address"
 }
 ],
 "name": "rewards",
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
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "stake",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "stakeTo",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "deadline",
 "type": "uint256"
 },
 {
 "internalType": "uint8",
 "name": "v",
 "type": "uint8"
 },
 {
 "internalType": "bytes32",
 "name": "r",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32",
 "name": "s",
 "type": "bytes32"
 }
 ],
 "name": "stakeWithPermit",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "stakingToken",
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
 "inputs": [],
 "name": "totalSupply",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "userRewardPerTokenPaid",
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
 "name": "voting_contract_",
 "outputs": [
 {
 "internalType": "contract IOrionVoting",
 "name": "",
 "type": "address"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "voting_pool_accumulator_stored_",
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
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "withdraw",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 }
]
export = data