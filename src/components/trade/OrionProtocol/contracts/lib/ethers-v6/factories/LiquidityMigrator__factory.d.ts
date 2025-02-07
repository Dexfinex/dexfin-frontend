import { type ContractRunner } from "ethers-v6";
import type { LiquidityMigrator, LiquidityMigratorInterface } from "../LiquidityMigrator.js";
export declare class LiquidityMigrator__factory {
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
        readonly inputs: readonly [];
        readonly name: "WETH9";
        readonly outputs: readonly [{
            readonly internalType: "contract IWETH9";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchange";
        readonly outputs: readonly [{
            readonly internalType: "contract IExchangeWithAtomic";
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
        readonly name: "exchangeAllowances";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_exchange";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_WETH9";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pairAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokensToMigrate";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "secretHash0";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "secretHash1";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint64";
            readonly name: "expiration";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint24";
            readonly name: "targetChainId";
            readonly type: "uint24";
        }];
        readonly name: "migrate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
    }];
    static createInterface(): LiquidityMigratorInterface;
    static connect(address: string, runner?: ContractRunner | null): LiquidityMigrator;
}
