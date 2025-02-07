import { type ContractRunner } from "ethers-v6";
import type { PoolFunctionality, PoolFunctionalityInterface } from "../PoolFunctionality.js";
export declare class PoolFunctionality__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "enum IPoolFunctionality.FactoryType";
            readonly name: "_type";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_WETH";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "st";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "rt";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "st_r";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "st_a";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rt_r";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rt_a";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "f";
            readonly type: "address";
        }];
        readonly name: "OrionPoolSwap";
        readonly type: "event";
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
        readonly inputs: readonly [];
        readonly name: "WETH";
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
            readonly name: "tokenA";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "tokenB";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountADesired";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountBDesired";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountAMin";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountBMin";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "addLiquidityFromExchange";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountA";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountB";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "liquidity";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint112";
                readonly name: "amount_spend";
                readonly type: "uint112";
            }, {
                readonly internalType: "uint112";
                readonly name: "amount_receive";
                readonly type: "uint112";
            }, {
                readonly internalType: "address";
                readonly name: "orionpool_router";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "is_exact_spend";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "supportingFee";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "isInContractTrade";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "isSentETHEnough";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "isFromWallet";
                readonly type: "bool";
            }, {
                readonly internalType: "address";
                readonly name: "asset_spend";
                readonly type: "address";
            }, {
                readonly internalType: "address[]";
                readonly name: "path";
                readonly type: "address[]";
            }];
            readonly internalType: "struct IPoolFunctionality.SwapData";
            readonly name: "swapData";
            readonly type: "tuple";
        }];
        readonly name: "doSwapThroughOrionPool";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountOut";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountIn";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "factories";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getFactoriesLength";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getWETH";
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
            readonly name: "tokens";
            readonly type: "address[]";
        }, {
            readonly internalType: "address[]";
            readonly name: "tos";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "amounts";
            readonly type: "uint256[]";
        }];
        readonly name: "increaseAllowances";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "a";
            readonly type: "address";
        }];
        readonly name: "isFactory";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
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
            readonly name: "curFactory";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "tokenA";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "tokenB";
            readonly type: "address";
        }];
        readonly name: "pairFor";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "pair";
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "supportedFactories";
        readonly outputs: readonly [{
            readonly internalType: "enum IPoolFunctionality.FactoryType";
            readonly name: "";
            readonly type: "uint8";
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
            readonly internalType: "address[]";
            readonly name: "_factories";
            readonly type: "address[]";
        }, {
            readonly internalType: "enum IPoolFunctionality.FactoryType[]";
            readonly name: "_types";
            readonly type: "uint8[]";
        }];
        readonly name: "updateFactories";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): PoolFunctionalityInterface;
    static connect(address: string, runner?: ContractRunner | null): PoolFunctionality;
}
