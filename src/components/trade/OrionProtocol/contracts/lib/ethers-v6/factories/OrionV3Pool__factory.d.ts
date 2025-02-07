import { type ContractRunner } from "ethers-v6";
import type { OrionV3Pool, OrionV3PoolInterface } from "../OrionV3Pool.js";
export declare class OrionV3Pool__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_token0";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_token1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "_fee";
            readonly type: "uint24";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "BitmapIndex";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ErrorTransfer";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidAmount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "InvalidBalance";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidFee";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidOrder";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "LiquidityEmpty";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "MaxAmount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "MinAmount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OrderDisable";
        readonly type: "error";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "TickIndex";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "WasInit";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "WasLock";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint32";
            readonly name: "orderId";
            readonly type: "uint32";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }];
        readonly name: "Burn";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint32";
            readonly name: "orderId";
            readonly type: "uint32";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }];
        readonly name: "Collect";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }];
        readonly name: "CollectProtocol";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "Initialize";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint32";
            readonly name: "orderId";
            readonly type: "uint32";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly indexed: true;
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint48";
            readonly name: "time";
            readonly type: "uint48";
        }];
        readonly name: "Mint";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "int128";
            readonly name: "liquidity";
            readonly type: "int128";
        }, {
            readonly indexed: false;
            readonly internalType: "int128";
            readonly name: "index";
            readonly type: "int128";
        }];
        readonly name: "Swap";
        readonly type: "event";
    }, {
        readonly stateMutability: "payable";
        readonly type: "fallback";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "from";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "to";
            readonly type: "int128";
        }];
        readonly name: "GetAvgRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "MAX_AMOUNT";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "MAX_TICK";
        readonly outputs: readonly [{
            readonly internalType: "int24";
            readonly name: "";
            readonly type: "int24";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "addCounter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "amount0";
            readonly type: "int128";
        }, {
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }];
        readonly name: "addLiqByIndex";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int128";
            readonly name: "addAmount";
            readonly type: "int128";
        }];
        readonly name: "addLiqToTick";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int128";
            readonly name: "addAmount";
            readonly type: "int128";
        }];
        readonly name: "addTickAmount";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "orderIndex";
            readonly type: "uint32";
        }];
        readonly name: "burn";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "liquidity";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "index";
            readonly type: "int128";
        }];
        readonly name: "calcAmount0";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "index";
            readonly type: "int128";
        }];
        readonly name: "calcAmount1";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "amount";
            readonly type: "int128";
        }, {
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }];
        readonly name: "calcAmounts";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "amount0";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "amount1";
            readonly type: "int128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "orderIndex";
            readonly type: "uint32";
        }];
        readonly name: "collect";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }];
        readonly name: "collectProtocol";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "amount0";
            readonly type: "uint128";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "orderIndex";
            readonly type: "uint32";
        }, {
            readonly internalType: "int128";
            readonly name: "amount";
            readonly type: "int128";
        }];
        readonly name: "decreaseLiquidity";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "liquidity";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "doTestLog2";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "doTestLog3";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "index";
            readonly type: "int128";
        }];
        readonly name: "do_calcAmount0";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "index";
            readonly type: "int128";
        }];
        readonly name: "do_calcAmount1";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly name: "getCurrent";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint128";
                readonly name: "totalAmount";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "amount";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "pool";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "swap";
                readonly type: "uint128";
            }, {
                readonly internalType: "int24";
                readonly name: "indexFrom";
                readonly type: "int24";
            }, {
                readonly internalType: "int24";
                readonly name: "indexTo";
                readonly type: "int24";
            }, {
                readonly internalType: "int128";
                readonly name: "index";
                readonly type: "int128";
            }, {
                readonly internalType: "uint32";
                readonly name: "totalOrders";
                readonly type: "uint32";
            }];
            readonly internalType: "struct CurrentInfo";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getExp2";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getExp3";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getExp3_2";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "getIndex";
        readonly outputs: readonly [{
            readonly internalType: "int24";
            readonly name: "";
            readonly type: "int24";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "getIndexByRate";
        readonly outputs: readonly [{
            readonly internalType: "int24";
            readonly name: "";
            readonly type: "int24";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "from";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "to";
            readonly type: "int24";
        }];
        readonly name: "getIntegralRate128";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getLog2";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getLog3";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "x";
            readonly type: "int128";
        }];
        readonly name: "getLog4";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getMagic_a1";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getMagic_math";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "index";
            readonly type: "uint8";
        }];
        readonly name: "getMapBits";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "direct";
            readonly type: "int24";
        }];
        readonly name: "getNextTick";
        readonly outputs: readonly [{
            readonly internalType: "int24";
            readonly name: "";
            readonly type: "int24";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "secondsAgo";
            readonly type: "uint32";
        }];
        readonly name: "getOracle";
        readonly outputs: readonly [{
            readonly internalType: "int128";
            readonly name: "";
            readonly type: "int128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "index";
            readonly type: "uint32";
        }];
        readonly name: "getOrder";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint96";
                readonly name: "amountLow";
                readonly type: "uint96";
            }, {
                readonly internalType: "uint96";
                readonly name: "feeLow";
                readonly type: "uint96";
            }, {
                readonly internalType: "int16";
                readonly name: "indexFrom";
                readonly type: "int16";
            }, {
                readonly internalType: "int16";
                readonly name: "indexTo";
                readonly type: "int16";
            }, {
                readonly internalType: "uint32";
                readonly name: "OrdersCounter";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "amountHigh";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "feeHigh";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint8";
                readonly name: "disable";
                readonly type: "uint8";
            }, {
                readonly internalType: "int128";
                readonly name: "collectFee";
                readonly type: "int128";
            }];
            readonly internalType: "struct OrderData";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getPoolInfo";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "token0";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "token1";
                readonly type: "address";
            }, {
                readonly internalType: "uint24";
                readonly name: "fee";
                readonly type: "uint24";
            }, {
                readonly internalType: "int128";
                readonly name: "tickMultiplier";
                readonly type: "int128";
            }, {
                readonly internalType: "int128";
                readonly name: "denominator0";
                readonly type: "int128";
            }, {
                readonly internalType: "int128";
                readonly name: "denominator1";
                readonly type: "int128";
            }];
            readonly internalType: "struct PoolInfo";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getPriceTick";
        readonly outputs: readonly [{
            readonly internalType: "int16";
            readonly name: "";
            readonly type: "int16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "getRateByIndex";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "getRateByIndex128";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "result";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getRootBits";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getTWAP";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "priceTime";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint48";
                readonly name: "priceTW";
                readonly type: "uint48";
            }];
            readonly internalType: "struct TWItem";
            readonly name: "Item";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getTWAPPos";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "orderIndex";
            readonly type: "uint32";
        }, {
            readonly internalType: "int128";
            readonly name: "amount";
            readonly type: "int128";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "increaseLiquidity";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isInit";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isLock";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "from";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "to";
            readonly type: "int24";
        }];
        readonly name: "listAmount";
        readonly outputs: readonly [{
            readonly internalType: "int128[]";
            readonly name: "";
            readonly type: "int128[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "from";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "to";
            readonly type: "int24";
        }];
        readonly name: "listBitmap";
        readonly outputs: readonly [{
            readonly internalType: "int128[]";
            readonly name: "";
            readonly type: "int128[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "from";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "to";
            readonly type: "int24";
        }];
        readonly name: "listCumulFee";
        readonly outputs: readonly [{
            readonly internalType: "int128[]";
            readonly name: "";
            readonly type: "int128[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "from";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "to";
            readonly type: "int24";
        }];
        readonly name: "listFee";
        readonly outputs: readonly [{
            readonly internalType: "int128[]";
            readonly name: "";
            readonly type: "int128[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "uint32";
            readonly name: "indexFrom";
            readonly type: "uint32";
        }, {
            readonly internalType: "uint32";
            readonly name: "count";
            readonly type: "uint32";
        }];
        readonly name: "listOrder";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "int128";
                readonly name: "amount";
                readonly type: "int128";
            }, {
                readonly internalType: "int128";
                readonly name: "fee";
                readonly type: "int128";
            }, {
                readonly internalType: "int128";
                readonly name: "collectFee";
                readonly type: "int128";
            }, {
                readonly internalType: "int24";
                readonly name: "indexFrom";
                readonly type: "int24";
            }, {
                readonly internalType: "int24";
                readonly name: "indexTo";
                readonly type: "int24";
            }, {
                readonly internalType: "uint8";
                readonly name: "disable";
                readonly type: "uint8";
            }];
            readonly internalType: "struct OrderView[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "indexFrom";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "count";
            readonly type: "uint256";
        }];
        readonly name: "listTWAP";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint32";
                readonly name: "priceTime";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint48";
                readonly name: "priceTW";
                readonly type: "uint48";
            }];
            readonly internalType: "struct TWItem[]";
            readonly name: "";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "int24";
            readonly name: "indexFrom";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "indexTo";
            readonly type: "int24";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "mint";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint32";
            readonly name: "id";
            readonly type: "uint32";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "removeCounter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint32";
            readonly name: "orderIndex";
            readonly type: "uint32";
        }];
        readonly name: "removeLiq";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int128";
            readonly name: "removeAmount";
            readonly type: "int128";
        }];
        readonly name: "removeLiqFromTick";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }];
        readonly name: "setFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int128";
            readonly name: "addAmount";
            readonly type: "int128";
        }];
        readonly name: "setTickAmount";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "speed_Integral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "rate0";
            readonly type: "uint256";
        }];
        readonly name: "speed_getIndex";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "direct";
            readonly type: "int24";
        }];
        readonly name: "speed_getNextTick";
        readonly outputs: readonly [{
            readonly internalType: "int24";
            readonly name: "";
            readonly type: "int24";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int24";
            readonly name: "index";
            readonly type: "int24";
        }];
        readonly name: "speed_getRate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "int256";
            readonly name: "amountSpecified";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "swap";
        readonly outputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1";
            readonly type: "int256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "amount0";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "direct";
            readonly type: "int128";
        }];
        readonly name: "swap1";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int128";
            readonly name: "amount0";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "amount1";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "direct";
            readonly type: "int128";
        }];
        readonly name: "swap2";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalFee";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): OrionV3PoolInterface;
    static connect(address: string, runner?: ContractRunner | null): OrionV3Pool;
}
