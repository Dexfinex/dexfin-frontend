import { type ContractRunner } from "ethers-v6";
import type { Exchange, ExchangeInterface } from "../Exchange.js";
export declare class Exchange__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "AlreadyFilled";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ETHTransferFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "EthDepositRejected";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "Fallback";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "IncorrectPosition";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InsufficientBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InsufficientBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotCollateralAsset";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotEnoughBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OnlyMatcher";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "Overflow";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ZeroReturnAmount";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "secret";
            readonly type: "bytes";
        }];
        readonly name: "AtomicClaimed";
        readonly type: "event";
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
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes32";
            readonly name: "secretHash";
            readonly type: "bytes32";
        }];
        readonly name: "AtomicLocked";
        readonly type: "event";
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
            readonly name: "receiver";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "secret";
            readonly type: "bytes";
        }];
        readonly name: "AtomicRedeemed";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "receiver";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes32";
            readonly name: "secretHash";
            readonly type: "bytes32";
        }];
        readonly name: "AtomicRefunded";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "beneficiary";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "isDeposit";
            readonly type: "bool";
        }, {
            readonly indexed: false;
            readonly internalType: "uint112";
            readonly name: "amount";
            readonly type: "uint112";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "timestamp";
            readonly type: "uint64";
        }];
        readonly name: "NewAssetTransaction";
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
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "buyer";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "seller";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "baseAsset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "quoteAsset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "filledPrice";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint192";
            readonly name: "filledAmount";
            readonly type: "uint192";
        }, {
            readonly indexed: false;
            readonly internalType: "uint192";
            readonly name: "amountQuote";
            readonly type: "uint192";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes32";
            readonly name: "tradeId";
            readonly type: "bytes32";
        }];
        readonly name: "Trade";
        readonly type: "event";
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "fallback";
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "assetRisks";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly name: "atomicSwaps";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "expiration";
            readonly type: "uint64";
        }, {
            readonly internalType: "bool";
            readonly name: "used";
            readonly type: "bool";
        }, {
            readonly internalType: "address";
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "amount";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint24";
            readonly name: "targetChainId";
            readonly type: "uint24";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "calcPosition";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "enum MarginalFunctionality.PositionState";
                readonly name: "state";
                readonly type: "uint8";
            }, {
                readonly internalType: "int256";
                readonly name: "weightedPosition";
                readonly type: "int256";
            }, {
                readonly internalType: "int256";
                readonly name: "totalPosition";
                readonly type: "int256";
            }, {
                readonly internalType: "int256";
                readonly name: "totalLiabilities";
                readonly type: "int256";
            }];
            readonly internalType: "struct MarginalFunctionality.Position";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "checkPosition";
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
            readonly name: "receiver";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "secret";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "matcherSignature";
            readonly type: "bytes";
        }];
        readonly name: "claimAtomic";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "deposit";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint112";
            readonly name: "amount";
            readonly type: "uint112";
        }];
        readonly name: "depositAsset";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint112";
            readonly name: "amount";
            readonly type: "uint112";
        }, {
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "depositAssetTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "depositTo";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "senderAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "matcherAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "baseAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "quoteAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "matcherFeeAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "amount";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "price";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "matcherFee";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "nonce";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "expiration";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "buySide";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "signature";
                    readonly type: "bytes";
                }];
                readonly internalType: "struct LibValidator.Order";
                readonly name: "limitOrder";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint24";
                readonly name: "chainId";
                readonly type: "uint24";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint64";
                readonly name: "lockOrderExpiration";
                readonly type: "uint64";
            }];
            readonly internalType: "struct LibValidator.CrossChainOrder";
            readonly name: "userOrder";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "brokerOrder";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint64";
            readonly name: "filledPrice";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "filledAmount";
            readonly type: "uint64";
        }];
        readonly name: "fillAndLockAtomic";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "buyOrder";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "sellOrder";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint64";
            readonly name: "filledPrice";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint112";
            readonly name: "filledAmount";
            readonly type: "uint112";
        }];
        readonly name: "fillOrders";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint112";
            readonly name: "filledAmount";
            readonly type: "uint112";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "order";
            readonly type: "tuple";
        }, {
            readonly internalType: "contract IAggregationExecutor";
            readonly name: "executor";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "srcToken";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "dstToken";
                readonly type: "address";
            }, {
                readonly internalType: "address payable";
                readonly name: "srcReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "address payable";
                readonly name: "dstReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "minReturnAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "flags";
                readonly type: "uint256";
            }];
            readonly internalType: "struct LibValidator.SwapDescription";
            readonly name: "desc";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "permit";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "fillThroughPools";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly name: "filledAmounts";
        readonly outputs: readonly [{
            readonly internalType: "uint192";
            readonly name: "";
            readonly type: "uint192";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "getBalance";
        readonly outputs: readonly [{
            readonly internalType: "int192";
            readonly name: "";
            readonly type: "int192";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "assetsAddresses";
            readonly type: "address[]";
        }, {
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "getBalances";
        readonly outputs: readonly [{
            readonly internalType: "int192[]";
            readonly name: "balances";
            readonly type: "int192[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getCollateralAssets";
        readonly outputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "";
            readonly type: "address[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "orderHash";
            readonly type: "bytes32";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "order";
            readonly type: "tuple";
        }];
        readonly name: "getFilledAmounts";
        readonly outputs: readonly [{
            readonly internalType: "int192";
            readonly name: "totalFilled";
            readonly type: "int192";
        }, {
            readonly internalType: "int192";
            readonly name: "totalFeesPaid";
            readonly type: "int192";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "user";
            readonly type: "address";
        }];
        readonly name: "getLiabilities";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "timestamp";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint192";
                readonly name: "outstandingAmount";
                readonly type: "uint192";
            }];
            readonly internalType: "struct MarginalFunctionality.Liability[]";
            readonly name: "liabilitiesArray";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "liabilities";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "asset";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "timestamp";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint192";
            readonly name: "outstandingAmount";
            readonly type: "uint192";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "liquidationPremium";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint24";
                readonly name: "targetChainId";
                readonly type: "uint24";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct LibAtomic.LockOrder";
            readonly name: "swap";
            readonly type: "tuple";
        }];
        readonly name: "lockAtomic";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint24";
                readonly name: "targetChainId";
                readonly type: "uint24";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }];
            readonly internalType: "struct LibAtomic.LockOrder";
            readonly name: "lockOrder";
            readonly type: "tuple";
        }];
        readonly name: "lockAtomicByMatcher";
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
        readonly name: "positionOverdue";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "priceOverdue";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "receiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "claimReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibAtomic.RedeemOrder";
            readonly name: "order1";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "secret1";
            readonly type: "bytes";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "receiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "claimReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibAtomic.RedeemOrder";
            readonly name: "order2";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "secret2";
            readonly type: "bytes";
        }];
        readonly name: "redeem2Atomics";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "sender";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "receiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "claimReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "asset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibAtomic.RedeemOrder";
            readonly name: "order";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "secret";
            readonly type: "bytes";
        }];
        readonly name: "redeemAtomic";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "secretHash";
            readonly type: "bytes32";
        }];
        readonly name: "refundAtomic";
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
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly name: "secrets";
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
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }, {
            readonly internalType: "int192";
            readonly name: "amount";
            readonly type: "int192";
        }];
        readonly name: "setAssetBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "orionToken";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "priceOracleAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "allowedMatcher";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "WETH_";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "claimAtomicFee";
            readonly type: "uint64";
        }];
        readonly name: "setBasicParams";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stakeRisk";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IAggregationExecutor";
            readonly name: "executor";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "srcToken";
                readonly type: "address";
            }, {
                readonly internalType: "contract IERC20";
                readonly name: "dstToken";
                readonly type: "address";
            }, {
                readonly internalType: "address payable";
                readonly name: "srcReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "address payable";
                readonly name: "dstReceiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "minReturnAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "flags";
                readonly type: "uint256";
            }];
            readonly internalType: "struct LibValidator.SwapDescription";
            readonly name: "desc";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes";
            readonly name: "permit";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "swap";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "spentAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "gasLeft";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
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
            readonly name: "assets";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint8[]";
            readonly name: "risks";
            readonly type: "uint8[]";
        }];
        readonly name: "updateAssetRisks";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "_collateralAssets";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint8";
            readonly name: "_stakeRisk";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint8";
            readonly name: "_liquidationPremium";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint64";
            readonly name: "_priceOverdue";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "_positionOverdue";
            readonly type: "uint64";
        }];
        readonly name: "updateMarginalSettings";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly components: readonly [{
                    readonly internalType: "address";
                    readonly name: "senderAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "matcherAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "baseAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "quoteAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "matcherFeeAsset";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "amount";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "price";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "matcherFee";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "nonce";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "expiration";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "buySide";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "signature";
                    readonly type: "bytes";
                }];
                readonly internalType: "struct LibValidator.Order";
                readonly name: "limitOrder";
                readonly type: "tuple";
            }, {
                readonly internalType: "uint24";
                readonly name: "chainId";
                readonly type: "uint24";
            }, {
                readonly internalType: "bytes32";
                readonly name: "secretHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint64";
                readonly name: "lockOrderExpiration";
                readonly type: "uint64";
            }];
            readonly internalType: "struct LibValidator.CrossChainOrder";
            readonly name: "userOrder";
            readonly type: "tuple";
        }];
        readonly name: "validateCrossChainOrder";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "isValid";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "senderAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherAddress";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "baseAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "quoteAsset";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "matcherFeeAsset";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "amount";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "price";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "matcherFee";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "nonce";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "expiration";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint8";
                readonly name: "buySide";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "signature";
                readonly type: "bytes";
            }];
            readonly internalType: "struct LibValidator.Order";
            readonly name: "order";
            readonly type: "tuple";
        }];
        readonly name: "validateOrder";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "isValid";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint112";
            readonly name: "amount";
            readonly type: "uint112";
        }];
        readonly name: "withdraw";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "assetAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint112";
            readonly name: "amount";
            readonly type: "uint112";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "withdrawTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): ExchangeInterface;
    static connect(address: string, runner?: ContractRunner | null): Exchange;
}
