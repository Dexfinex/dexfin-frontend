/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "veORN_",
 "type": "address"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "constructor"
 },
 {
 "inputs": [],
 "name": "ALREADY_VOTED",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "CHOICE_NOT_EXIST",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "DUPLICATED_CHOICES",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EMPTY_CHOICES",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EMPTY_NAME",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "LOCK_WILL_EXPIRE",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "MAX_PROPOSALS_EXCEED",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "PROPOSAL_ALREADY_EXIST",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "PROPOSAL_FINISHED",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "PROPOSAL_NOT_EXIST",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ZERO_PREVIOUS_VOTE",
 "type": "error"
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
 "indexed": false,
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "timestampFinish",
 "type": "uint256"
 },
 {
 "indexed": false,
 "internalType": "bytes32[]",
 "name": "choices",
 "type": "bytes32[]"
 }
 ],
 "name": "ProposalCreated",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "choice",
 "type": "bytes32"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "votePower",
 "type": "uint256"
 }
 ],
 "name": "ProposalUnvoted",
 "type": "event"
 },
 {
 "anonymous": false,
 "inputs": [
 {
 "indexed": false,
 "internalType": "address",
 "name": "user",
 "type": "address"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "indexed": false,
 "internalType": "bytes32",
 "name": "choice",
 "type": "bytes32"
 },
 {
 "indexed": false,
 "internalType": "uint256",
 "name": "votePower",
 "type": "uint256"
 }
 ],
 "name": "ProposalVoted",
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
 "name": "pool",
 "type": "address"
 },
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
 }
 ],
 "name": "Unvote",
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
 }
 ],
 "name": "UnvoteAll",
 "type": "event"
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
 "internalType": "bool",
 "name": "bUse",
 "type": "bool"
 }
 ],
 "name": "UsePool",
 "type": "event"
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
 }
 ],
 "name": "Vote",
 "type": "event"
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
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 }
 ],
 "name": "addPool",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "farmv2",
 "type": "address"
 }
 ],
 "name": "addPool2",
 "outputs": [],
 "stateMutability": "nonpayable",
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
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32",
 "name": "previousChoice",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32",
 "name": "newChoice",
 "type": "bytes32"
 }
 ],
 "name": "changeVoteProposal",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "claimReward",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [],
 "name": "countPool",
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
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32[]",
 "name": "choices",
 "type": "bytes32[]"
 },
 {
 "internalType": "uint256",
 "name": "timestampFinish",
 "type": "uint256"
 }
 ],
 "name": "createProposal",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 }
 ],
 "name": "deletePool",
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
 "internalType": "address",
 "name": "account",
 "type": "address"
 }
 ],
 "name": "havePool",
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
 "name": "",
 "type": "address"
 }
 ],
 "name": "poolIndex",
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
 "name": "",
 "type": "uint256"
 }
 ],
 "name": "poolList",
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
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 }
 ],
 "name": "proposalInfo",
 "outputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 },
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 },
 {
 "internalType": "bytes32[]",
 "name": "",
 "type": "bytes32[]"
 },
 {
 "internalType": "uint256[]",
 "name": "",
 "type": "uint256[]"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 }
 ],
 "name": "proposalVotes",
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
 "name": "addr",
 "type": "address"
 },
 {
 "internalType": "bool",
 "name": "bUse",
 "type": "bool"
 }
 ],
 "name": "setSmart",
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
 "inputs": [
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "smarts",
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
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "unvote",
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
 "name": "unvoteAll",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "percent",
 "type": "uint256"
 }
 ],
 "name": "unvotePercent",
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
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 }
 ],
 "name": "userVotedChoice",
 "outputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
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
 "name": "users",
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
 },
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "usersPool",
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
 "name": "veORN",
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
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
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
 "internalType": "address[]",
 "name": "pools",
 "type": "address[]"
 },
 {
 "internalType": "uint256[]",
 "name": "amounts",
 "type": "uint256[]"
 }
 ],
 "name": "voteArr",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "percent",
 "type": "uint256"
 }
 ],
 "name": "votePercent",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "name",
 "type": "bytes32"
 },
 {
 "internalType": "bytes32",
 "name": "choice",
 "type": "bytes32"
 }
 ],
 "name": "voteProposal",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes32",
 "name": "",
 "type": "bytes32"
 },
 {
 "internalType": "address",
 "name": "",
 "type": "address"
 }
 ],
 "name": "voted",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "",
 "type": "uint256"
 }
 ],
 "stateMutability": "view",
 "type": "function"
 }
]
export = data