import { type ContractRunner } from "ethers-v6";
import type { PriceOracle, PriceOracleInterface } from "../PriceOracle.js";
export declare class PriceOracle__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "publicKey";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_baseAsset";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "assetPrices";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "price";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "timestamp";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "baseAsset";
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
        readonly name: "chainLinkETHAggregator";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "added";
            readonly type: "address[]";
        }, {
            readonly internalType: "address[]";
            readonly name: "removed";
            readonly type: "address[]";
        }];
        readonly name: "changePriceProviderAuthorization";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "assets";
            readonly type: "address[]";
        }];
        readonly name: "getChainLinkPriceData";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "assetAddresses";
            readonly type: "address[]";
        }];
        readonly name: "givePrices";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "timestamp";
                readonly type: "uint64";
            }];
            readonly internalType: "struct PriceOracle.PriceDataOut[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oraclePublicKey";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
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
        readonly name: "priceProviderAuthorization";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address[]";
                readonly name: "assetAddresses";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint64[]";
                readonly name: "prices";
                readonly type: "uint64[]";
            }, {
                readonly internalType: "uint64";
                readonly name: "timestamp";
                readonly type: "uint64";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PriceOracle.Prices";
            readonly name: "priceFeed";
            readonly type: "tuple";
        }];
        readonly name: "provideDataAddressAuthorization";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "assets";
            readonly type: "address[]";
        }, {
            readonly internalType: "address[]";
            readonly name: "aggregatorAddresses";
            readonly type: "address[]";
        }];
        readonly name: "setChainLinkAggregators";
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
    static createInterface(): PriceOracleInterface;
    static connect(address: string, runner?: ContractRunner | null): PriceOracle;
}
