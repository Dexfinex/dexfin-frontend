/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "ORN_",
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
 "name": "account",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewardCumulativeTotal",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rateCumulative",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "timestamp",
 "type": "uint256"
 }
 ],
 "name": "ClaimReward",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "provider",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "value",
 "type": "uint256"
 },
 {
 "indexed": true,
 "internalType": "uint256",
 "name": "locktime",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "int128",
 "name": "mode",
 "type": "int128"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "ts",
 "type": "uint256"
 }
 ],
 "name": "Deposit",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "uint64",
 "name": "rewards",
 "type": "uint64"
 },
 {
 "indexed": false,
 "internalType": "uint64",
 "name": "duration",
 "type": "uint64"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewardCumulativeTotal",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rateCumulative",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "timestamp",
 "type": "uint256"
 }
 ],
 "name": "SetRewards",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "account",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewardCumulativeTotal",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rateCumulative",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "timestamp",
 "type": "uint256"
 }
 ],
 "name": "Stake",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "account",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rewardCumulativeTotal",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "rateCumulative",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "timestamp",
 "type": "uint256"
 }
 ],
 "name": "Unstake",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "provider",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint48",
 "name": "time_lock",
 "type": "uint48"
 },
 {
 "indexed": false,
 "internalType": "uint128",
 "name": "balance",
 "type": "uint128"
 },
 {
 "indexed": false,
 "internalType": "uint128",
 "name": "amount_token",
 "type": "uint128"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "value",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "totalSupplyT0",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "ts",
 "type": "uint256"
 }
 ],
 "name": "UpdateDeposit",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": true,
 "internalType": "address",
 "name": "provider",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "value",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "ts",
 "type": "uint256"
 }
 ],
 "name": "Withdraw",
 "type": "event"
 },
 {
 "inputs": [],
 "name": "ALPHA7",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "",
 "type": "uint128"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "ORN",
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
 "name": "START_TIME",
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
 "name": "allStake",
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
 },
 {
 "internalType": "uint256",
 "name": "time",
 "type": "uint256"
 }
 ],
 "name": "amountAt",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "pure",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint128",
 "name": "amount_token",
 "type": "uint128"
 },
 {
 "internalType": "uint256",
 "name": "time_lock",
 "type": "uint256"
 }
 ],
 "name": "amountByTokenAt",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "balance",
 "type": "uint128"
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
 },
 {
 "internalType": "uint256",
 "name": "time",
 "type": "uint256"
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
 "name": "balanceOf0",
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
 "name": "user",
 "type": "address"
 },
 {
 "components": [
 {
 "internalType": "uint48",
 "name": "timestamp",
 "type": "uint48"
 },
 {
 "internalType": "uint208",
 "name": "amountTW",
 "type": "uint208"
 }
 ],
 "internalType": "struct ITWBalance.TWItem",
 "name": "itemStart",
 "type": "tuple"
 }
 ],
 "name": "balanceOfAvg",
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
 "name": "user",
 "type": "address"
 }
 ],
 "name": "balanceOfTW",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint48",
 "name": "timestamp",
 "type": "uint48"
 },
 {
 "internalType": "uint208",
 "name": "amountTW",
 "type": "uint208"
 }
 ],
 "internalType": "struct ITWBalance.TWItem",
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
 "name": "account",
 "type": "address"
 }
 ],
 "name": "balanceTokenOf",
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
 "name": "calcNewRate",
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
 "name": "claimReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "_value",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "unlock_time",
 "type": "uint256"
 }
 ],
 "name": "create_lock",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "_value",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "unlock_period",
 "type": "uint256"
 }
 ],
 "name": "create_lock_period",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "decimals",
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
 "internalType": "uint256",
 "name": "time",
 "type": "uint256"
 }
 ],
 "name": "getK",
 "outputs": [
 {
 "internalType": "uint128",
 "name": "",
 "type": "uint128"
 }
 ],
 "stateMutability": "pure",
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
 "name": "getReward",
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
 "name": "getRewardCumulative",
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
 "name": "getRewardCumulativeAll",
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
 "name": "getRewardWithdraw",
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
 "name": "getStake",
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
 "name": "_value",
 "type": "uint256"
 }
 ],
 "name": "increase_amount",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "unlock_period",
 "type": "uint256"
 }
 ],
 "name": "increase_unlock_period",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "unlock_time",
 "type": "uint256"
 }
 ],
 "name": "increase_unlock_time",
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
 "name": "lockTime",
 "outputs": [
 {
 "internalType": "uint48",
 "name": "",
 "type": "uint48"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "name",
 "outputs": [
 {
 "internalType": "string",
 "name": "",
 "type": "string"
 }
 ],
 "stateMutability": "pure",
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
 "name": "poolStake",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "stake",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "rateCumulative",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "reward",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "rewardWithdraw",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "rateCumulative",
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
 "name": "rateTime",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "addrVote",
 "type": "address"
 }
 ],
 "name": "setSmartVote",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "smartOwner",
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
 "name": "smartVote",
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
 "name": "symbol",
 "outputs": [
 {
 "internalType": "string",
 "name": "",
 "type": "string"
 }
 ],
 "stateMutability": "pure",
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
 "name": "tokenMap",
 "outputs": [
 {
 "internalType": "uint48",
 "name": "time_lock",
 "type": "uint48"
 },
 {
 "internalType": "uint128",
 "name": "balance",
 "type": "uint128"
 },
 {
 "internalType": "uint128",
 "name": "amount_token",
 "type": "uint128"
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
 "internalType": "uint256",
 "name": "time",
 "type": "uint256"
 }
 ],
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
 "inputs": [],
 "name": "totalSupply0",
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
 "components": [
 {
 "internalType": "uint48",
 "name": "timestamp",
 "type": "uint48"
 },
 {
 "internalType": "uint208",
 "name": "amountTW",
 "type": "uint208"
 }
 ],
 "internalType": "struct ITWBalance.TWItem",
 "name": "itemStart",
 "type": "tuple"
 }
 ],
 "name": "totalSupplyAvg",
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
 "name": "totalSupplyTW",
 "outputs": [
 {
 "components": [
 {
 "internalType": "uint48",
 "name": "timestamp",
 "type": "uint48"
 },
 {
 "internalType": "uint208",
 "name": "amountTW",
 "type": "uint208"
 }
 ],
 "internalType": "struct ITWBalance.TWItem",
 "name": "",
 "type": "tuple"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "withdraw",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 }
]
export = data