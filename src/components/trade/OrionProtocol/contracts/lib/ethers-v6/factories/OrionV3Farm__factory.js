/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Contract, Interface } from "ethers-v6";
const _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_ORN",
                type: "address",
            },
            {
                internalType: "address",
                name: "_veORN",
                type: "address",
            },
            {
                internalType: "address",
                name: "_nftManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_rewardDistributor",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "rewardAll",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "rewardAdd",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "timeAdd",
                type: "uint48",
            },
        ],
        name: "PoolReward",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "liquidityAll",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "liquidityUser",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "liquidityAdd",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "time",
                type: "uint48",
            },
        ],
        name: "Stake",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "gauge",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "bUse",
                type: "bool",
            },
        ],
        name: "UsePool",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "amount",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "userFee",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "rewardAll",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeWithdraw",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "rateFee",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "time",
                type: "uint48",
            },
        ],
        name: "WithdrawReward",
        type: "event",
    },
    {
        inputs: [],
        name: "BOOST_SCALE_FACTOR",
        outputs: [
            {
                internalType: "uint128",
                name: "",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DURATION",
        outputs: [
            {
                internalType: "uint48",
                name: "",
                type: "uint48",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_BOOSTED_REWARD",
        outputs: [
            {
                internalType: "uint128",
                name: "",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_MULTIPLIER",
        outputs: [
            {
                internalType: "uint128",
                name: "",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "ORN",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOfVeORN",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "claimReward",
        outputs: [
            {
                internalType: "uint128",
                name: "userFee",
                type: "uint128",
            },
            {
                internalType: "uint128",
                name: "amount",
                type: "uint128",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getBoost",
        outputs: [
            {
                internalType: "uint128",
                name: "",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getRateFee",
        outputs: [
            {
                internalType: "uint128",
                name: "rateFee",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getReward",
        outputs: [
            {
                internalType: "uint128",
                name: "amount",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getUserFee",
        outputs: [
            {
                internalType: "uint128",
                name: "userFee",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "liquidityStorage",
        outputs: [
            {
                internalType: "uint128",
                name: "",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nftManager",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC721Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "orderStorage",
        outputs: [
            {
                internalType: "uint48",
                name: "startBlock",
                type: "uint48",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "uint128",
                name: "withdraw",
                type: "uint128",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "poolStorage",
        outputs: [
            {
                internalType: "uint128",
                name: "rewardAll",
                type: "uint128",
            },
            {
                internalType: "uint128",
                name: "feeWithdraw",
                type: "uint128",
            },
            {
                internalType: "uint128",
                name: "rewardAdd",
                type: "uint128",
            },
            {
                internalType: "uint128",
                name: "liquidityAll",
                type: "uint128",
            },
            {
                internalType: "address",
                name: "gaugeAddr",
                type: "address",
            },
            {
                internalType: "uint48",
                name: "timeAdd",
                type: "uint48",
            },
            {
                internalType: "bool",
                name: "bUse",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "rewardDistributor",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "smartOwner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupplyVeORN",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "unstake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "pool",
                type: "address",
            },
        ],
        name: "updateReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                internalType: "bool",
                name: "bUse",
                type: "bool",
            },
        ],
        name: "usePool",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "veORN",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
class OrionV3Farm__factory {
    static createInterface() {
        return new Interface(_abi);
    }
    static connect(address, runner) {
        return new Contract(address, _abi, runner);
    }
}
OrionV3Farm__factory.abi = _abi;
export { OrionV3Farm__factory };
