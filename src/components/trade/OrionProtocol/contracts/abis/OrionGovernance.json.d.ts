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
 "name": "user",
 "type": "address"
 },
 {
 "internalType": "uint56",
 "name": "lock_increase_amount",
 "type": "uint56"
 }
 ],
 "name": "acceptLock",
 "outputs": [],
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
 "internalType": "uint56",
 "name": "new_lock_amount",
 "type": "uint56"
 }
 ],
 "name": "acceptNewLockAmount",
 "outputs": [],
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
 "internalType": "uint56",
 "name": "lock_decrease_amount",
 "type": "uint56"
 }
 ],
 "name": "acceptUnlock",
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
 "name": "balances_",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "balance",
 "type": "uint56"
 },
 {
 "internalType": "uint56",
 "name": "locked_balance",
 "type": "uint56"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "basic_fee_percent",
 "outputs": [
 {
 "internalType": "uint16",
 "name": "",
 "type": "uint16"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint56",
 "name": "burn_size",
 "type": "uint56"
 }
 ],
 "name": "burn",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "burn_vote_end_",
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
 "name": "extra_fee_percent",
 "outputs": [
 {
 "internalType": "uint16",
 "name": "",
 "type": "uint16"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "extra_fee_seconds",
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
 "name": "fee_total",
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
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getAvailableWithdrawBalance",
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
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getBalance",
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
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getLockedBalance",
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
 "name": "getReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "getRewardForDuration",
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
 "name": "getTotalBalance",
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
 "name": "user",
 "type": "address"
 }
 ],
 "name": "getTotalLockedBalance",
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
 "name": "wallet",
 "type": "address"
 }
 ],
 "name": "getVaults",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint56",
 "name": "amount",
 "type": "uint56"
 },
 {
 "internalType": "uint64",
 "name": "created_time",
 "type": "uint64"
 }
 ],
 "internalType": "struct OrionGovernance.UserVault[]",
 "name": "",
 "type": "tuple[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "staking_token",
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
 "name": "lastTimeRewardApplicable",
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
 "name": "lastUpdateTime",
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
 "name": "reward",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "_rewardsDuration",
 "type": "uint256"
 }
 ],
 "name": "notifyRewardAmount",
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
 "name": "periodFinish",
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
 "inputs": [],
 "name": "rewardRate",
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
 "inputs": [],
 "name": "rewardsDuration",
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
 "internalType": "uint64",
 "name": "burn_vote_end",
 "type": "uint64"
 }
 ],
 "name": "setBurnVoteEnd",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint16",
 "name": "extra_fee_percent_",
 "type": "uint16"
 },
 {
 "internalType": "uint64",
 "name": "extra_fee_seconds_",
 "type": "uint64"
 },
 {
 "internalType": "uint16",
 "name": "basic_fee_percent_",
 "type": "uint16"
 }
 ],
 "name": "setVaultParameters",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "voting_contract_address",
 "type": "address"
 }
 ],
 "name": "setVotingContractAddress",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint56",
 "name": "adding_amount",
 "type": "uint56"
 }
 ],
 "name": "stake",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "staking_token_",
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
 "name": "total_balance_",
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
 "name": "total_votes_burn_",
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
 "name": "total_votes_dont_burn_",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "user_burn_votes_",
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
 "internalType": "uint256",
 "name": "index",
 "type": "uint256"
 }
 ],
 "name": "vaultWithdraw",
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
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "vaults_",
 "outputs": [
 {
 "internalType": "uint56",
 "name": "amount",
 "type": "uint56"
 },
 {
 "internalType": "uint64",
 "name": "created_time",
 "type": "uint64"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint56",
 "name": "voting_amount",
 "type": "uint56"
 },
 {
 "internalType": "bool",
 "name": "vote_for_burn",
 "type": "bool"
 }
 ],
 "name": "voteBurn",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "voteBurnAvailable",
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
 "name": "voting_contract_address_",
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
 "internalType": "uint56",
 "name": "removing_amount",
 "type": "uint56"
 }
 ],
 "name": "withdraw",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 }
]
export = data