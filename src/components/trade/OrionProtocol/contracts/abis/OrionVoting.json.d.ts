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
 "inputs": [
 {
 "internalType": "address",
 "name": "poolAddress",
 "type": "address"
 },
 {
 "internalType": "uint56",
 "name": "amount",
 "type": "uint56"
 }
 ],
 "name": "cease",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint56",
 "name": "amount",
 "type": "uint56"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "claimRewards",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool_address",
 "type": "address"
 }
 ],
 "name": "getPoolRewards",
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
 "name": "getRewardPerVotingToken",
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
 "name": "rewards_token",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "governance_contract_address",
 "type": "address"
 }
 ],
 "name": "initialize",
 "outputs": [],
 "stateMutability": "payable",
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
 "name": "pool_states_",
 "outputs": [
 {
 "internalType": "uint8",
 "name": "state",
 "type": "uint8"
 },
 {
 "internalType": "uint56",
 "name": "votes",
 "type": "uint56"
 },
 {
 "internalType": "uint256",
 "name": "last_acc_reward_per_voting_token",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "acc_reward",
 "type": "uint256"
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
 "name": "reward_rate_",
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
 "name": "rewards_token_",
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
 "name": "pool_address",
 "type": "address"
 },
 {
 "internalType": "uint8",
 "name": "new_state",
 "type": "uint8"
 }
 ],
 "name": "setPoolState",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint64",
 "name": "rewards",
 "type": "uint64"
 },
 {
 "internalType": "uint64",
 "name": "duration",
 "type": "uint64"
 }
 ],
 "name": "setRewards",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "totalSupply",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "",
 "type": "uint56"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "total_supply_",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "",
 "type": "uint56"
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
 },
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "user_votes_",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "voted_amount",
 "type": "uint56"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "poolAddress",
 "type": "address"
 },
 {
 "internalType": "uint56",
 "name": "amount",
 "type": "uint56"
 }
 ],
 "name": "vote",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool_address",
 "type": "address"
 }
 ],
 "name": "votes",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "",
 "type": "uint56"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 }
]
export = data