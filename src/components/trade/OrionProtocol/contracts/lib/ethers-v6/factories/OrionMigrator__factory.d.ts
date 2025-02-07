import { type ContractRunner } from "ethers-v6";
import type { OrionMigrator, OrionMigratorInterface } from "../OrionMigrator.js";
export declare class OrionMigrator__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_pair";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_router";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_WETH9";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_stakingRewards";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0V1";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount1V1";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0V2";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount1V2";
            readonly type: "uint256";
        }];
        readonly name: "TestCalc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "tokensToMigrate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount0Min";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1Min";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }];
        readonly name: "migrate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): OrionMigratorInterface;
    static connect(address: string, runner?: ContractRunner | null): OrionMigrator;
}
