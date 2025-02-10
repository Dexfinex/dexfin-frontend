import { type ContractRunner } from "ethers-v6";
import type { SwapExecutor, SwapExecutorInterface } from "../SwapExecutor.js";
export declare class SwapExecutor__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "feeReceiver";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "weth";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "ApproveCalledOnETH";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ArraysLengthsDiffer";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "BadPool";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ETHTransferFailed";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "EmptyPools";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "EmptyPoolsOrionV3";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "EthDepositRejected";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ExcessiveInputAmount";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "Fallback";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ForceApproveFailed";
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
        readonly name: "InvalidMsgValue";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidMsgValueOrionV3";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "InvalidSkipMask";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "OffsetIsOutOfRange";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "ReturnAmountIsNotEnough";
        readonly type: "error";
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "fallback";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "AlgebraSwapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pool";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "assetOut";
            readonly type: "address";
        }, {
            readonly internalType: "int128";
            readonly name: "i";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "j";
            readonly type: "int128";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountIn";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountOut";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "curveSwapMetaAmountIn";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "pool";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "assetOut";
            readonly type: "address";
        }, {
            readonly internalType: "int128";
            readonly name: "i";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "j";
            readonly type: "int128";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountIn";
            readonly type: "uint256";
        }];
        readonly name: "curveSwapStableAmountIn";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "registry";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "pool";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "assetIn";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "assetOut";
            readonly type: "address";
        }, {
            readonly internalType: "int128";
            readonly name: "i";
            readonly type: "int128";
        }, {
            readonly internalType: "int128";
            readonly name: "j";
            readonly type: "int128";
        }, {
            readonly internalType: "uint256";
            readonly name: "fee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountOut";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxSpendAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "curveSwapStableAmountOut";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "calls";
            readonly type: "bytes[]";
        }];
        readonly name: "func_70LYiww";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "pool";
            readonly type: "uint256";
        }, {
            readonly internalType: "address payable";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "orionV3SingleSwapTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "pools";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "orionV3Swap";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "orionV3SwapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "pools";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address payable";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "orionV3SwapTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "srcToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "minReturn";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "pools";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes";
            readonly name: "permit";
            readonly type: "bytes";
        }];
        readonly name: "orionV3SwapToWithPermit";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "pancakeV3SwapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "desc";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "skipMaskAndOffset";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "patchTarget";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "patchData";
            readonly type: "bytes";
        }];
        readonly name: "patchCallWithArbitraryCall";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "desc";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "skipMaskAndOffset";
            readonly type: "uint256";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "ratio";
            readonly type: "uint256";
        }];
        readonly name: "patchCallWithTokenBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "calls";
            readonly type: "bytes[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "skipMasksAndOffsets";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "patchTarget";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "patchData";
            readonly type: "bytes";
        }];
        readonly name: "patchCallsWithArbitraryCall";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "calls";
            readonly type: "bytes[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "skipMasksAndOffsets";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "ratio";
            readonly type: "uint256";
        }];
        readonly name: "patchCallsWithTokenBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }];
        readonly name: "payFeeToMatcher";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "safeApprove";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "address payable";
            readonly name: "target";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "safeTransfer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IUniswapV2BrokenPair";
            readonly name: "pair";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "fromToken";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "toToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeDest";
            readonly type: "uint256";
        }];
        readonly name: "swapBrokenUniV2";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IUniswapV2BrokenPair";
            readonly name: "pair";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "fromToken";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "toToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeDest";
            readonly type: "uint256";
        }];
        readonly name: "swapBrokenUniV2Scaled";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "swapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IUniswapV2Pair";
            readonly name: "pair";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "fromToken";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "toToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeDest";
            readonly type: "uint256";
        }];
        readonly name: "swapUniV2";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IUniswapV2Pair";
            readonly name: "pair";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "fromToken";
            readonly type: "address";
        }, {
            readonly internalType: "contract IERC20";
            readonly name: "toToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeDest";
            readonly type: "uint256";
        }];
        readonly name: "swapUniV2Scaled";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "pool";
            readonly type: "uint256";
        }, {
            readonly internalType: "address payable";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "uniswapV3SingleSwapTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "pools";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "uniswapV3Swap";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "uniswapV3SwapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "pools";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address payable";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "uniswapV3SwapTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "returnAmount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "unwrapAndTransfer";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "to";
            readonly type: "address";
        }];
        readonly name: "wrapAndTransfer";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): SwapExecutorInterface;
    static connect(address: string, runner?: ContractRunner | null): SwapExecutor;
}
