import { type ContractRunner } from "ethers-v6";
import type { OrionVoting, OrionVotingInterface } from "../OrionVoting.js";
export declare class OrionVoting__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "poolAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint56";
            readonly name: "amount";
            readonly type: "uint56";
        }];
        readonly name: "cease";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint56";
            readonly name: "amount";
            readonly type: "uint56";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "claimRewards";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pool_address";
            readonly type: "address";
        }];
        readonly name: "getPoolRewards";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getRewardPerVotingToken";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "rewards_token";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "governance_contract_address";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "pool_states_";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "state";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint56";
            readonly name: "votes";
            readonly type: "uint56";
        }, {
            readonly internalType: "uint256";
            readonly name: "last_acc_reward_per_voting_token";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "acc_reward";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "reward_rate_";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "rewards_token_";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pool_address";
            readonly type: "address";
        }, {
            readonly internalType: "uint8";
            readonly name: "new_state";
            readonly type: "uint8";
        }];
        readonly name: "setPoolState";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "rewards";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "duration";
            readonly type: "uint64";
        }];
        readonly name: "setRewards";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint56";
            readonly name: "";
            readonly type: "uint56";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "total_supply_";
        readonly outputs: readonly [{
            readonly internalType: "uint56";
            readonly name: "";
            readonly type: "uint56";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "user_votes_";
        readonly outputs: readonly [{
            readonly internalType: "uint56";
            readonly name: "voted_amount";
            readonly type: "uint56";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "poolAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint56";
            readonly name: "amount";
            readonly type: "uint56";
        }];
        readonly name: "vote";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pool_address";
            readonly type: "address";
        }];
        readonly name: "votes";
        readonly outputs: readonly [{
            readonly internalType: "uint56";
            readonly name: "";
            readonly type: "uint56";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): OrionVotingInterface;
    static connect(address: string, runner?: ContractRunner | null): OrionVoting;
}
