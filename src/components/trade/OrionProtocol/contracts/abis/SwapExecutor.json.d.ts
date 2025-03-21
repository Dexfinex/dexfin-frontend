/** Generated with `./json-d-ts.sh` */
/* eslint-disable */
declare const data: [
 {
 "inputs": [
 {
 "internalType": "address payable",
 "name": "feeReceiver",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "weth",
 "type": "address"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "constructor"
 },
 {
 "inputs": [],
 "name": "ApproveCalledOnETH",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ArraysLengthsDiffer",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "BadPool",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ETHTransferFailed",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EmptyPools",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EmptyPoolsOrionV3",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "EthDepositRejected",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ExcessiveInputAmount",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "Fallback",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ForceApproveFailed",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InsufficientBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InsufficientBalance",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidMsgValue",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidMsgValueOrionV3",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "InvalidSkipMask",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "OffsetIsOutOfRange",
 "type": "error"
 },
 {
 "inputs": [],
 "name": "ReturnAmountIsNotEnough",
 "type": "error"
 },
 {
 "stateMutability": "nonpayable",
 "type": "fallback"
 },
 {
 "inputs": [
 {
 "internalType": "int256",
 "name": "amount0Delta",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1Delta",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "AlgebraSwapCallback",
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
 "internalType": "contract IERC20",
 "name": "assetOut",
 "type": "address"
 },
 {
 "internalType": "int128",
 "name": "i",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "j",
 "type": "int128"
 },
 {
 "internalType": "uint256",
 "name": "amountIn",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountOut",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "curveSwapMetaAmountIn",
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
 "internalType": "contract IERC20",
 "name": "assetOut",
 "type": "address"
 },
 {
 "internalType": "int128",
 "name": "i",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "j",
 "type": "int128"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amountIn",
 "type": "uint256"
 }
 ],
 "name": "curveSwapStableAmountIn",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address",
 "name": "registry",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "pool",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "assetIn",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "assetOut",
 "type": "address"
 },
 {
 "internalType": "int128",
 "name": "i",
 "type": "int128"
 },
 {
 "internalType": "int128",
 "name": "j",
 "type": "int128"
 },
 {
 "internalType": "uint256",
 "name": "fee",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "amountOut",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "maxSpendAmount",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "curveSwapStableAmountOut",
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
 "internalType": "bytes[]",
 "name": "calls",
 "type": "bytes[]"
 }
 ],
 "name": "func_70LYiww",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "pool",
 "type": "uint256"
 },
 {
 "internalType": "address payable",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "orionV3SingleSwapTo",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256[]",
 "name": "pools",
 "type": "uint256[]"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "orionV3Swap",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int256",
 "name": "amount0Delta",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1Delta",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "orionV3SwapCallback",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256[]",
 "name": "pools",
 "type": "uint256[]"
 },
 {
 "internalType": "address payable",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "orionV3SwapTo",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address payable",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "srcToken",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 },
 {
 "internalType": "uint256",
 "name": "minReturn",
 "type": "uint256"
 },
 {
 "internalType": "uint256[]",
 "name": "pools",
 "type": "uint256[]"
 },
 {
 "internalType": "bytes",
 "name": "permit",
 "type": "bytes"
 }
 ],
 "name": "orionV3SwapToWithPermit",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int256",
 "name": "amount0Delta",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1Delta",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "pancakeV3SwapCallback",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes",
 "name": "desc",
 "type": "bytes"
 },
 {
 "internalType": "uint256",
 "name": "skipMaskAndOffset",
 "type": "uint256"
 },
 {
 "internalType": "address",
 "name": "patchTarget",
 "type": "address"
 },
 {
 "internalType": "bytes",
 "name": "patchData",
 "type": "bytes"
 }
 ],
 "name": "patchCallWithArbitraryCall",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes",
 "name": "desc",
 "type": "bytes"
 },
 {
 "internalType": "uint256",
 "name": "skipMaskAndOffset",
 "type": "uint256"
 },
 {
 "internalType": "contract IERC20",
 "name": "token",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "ratio",
 "type": "uint256"
 }
 ],
 "name": "patchCallWithTokenBalance",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes[]",
 "name": "calls",
 "type": "bytes[]"
 },
 {
 "internalType": "uint256[]",
 "name": "skipMasksAndOffsets",
 "type": "uint256[]"
 },
 {
 "internalType": "address",
 "name": "patchTarget",
 "type": "address"
 },
 {
 "internalType": "bytes",
 "name": "patchData",
 "type": "bytes"
 }
 ],
 "name": "patchCallsWithArbitraryCall",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "bytes[]",
 "name": "calls",
 "type": "bytes[]"
 },
 {
 "internalType": "uint256[]",
 "name": "skipMasksAndOffsets",
 "type": "uint256[]"
 },
 {
 "internalType": "contract IERC20",
 "name": "token",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "ratio",
 "type": "uint256"
 }
 ],
 "name": "patchCallsWithTokenBalance",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address payable",
 "name": "to",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "token",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "feeAmount",
 "type": "uint256"
 }
 ],
 "name": "payFeeToMatcher",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IERC20",
 "name": "token",
 "type": "address"
 },
 {
 "internalType": "address",
 "name": "spender",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "safeApprove",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IERC20",
 "name": "token",
 "type": "address"
 },
 {
 "internalType": "address payable",
 "name": "target",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "safeTransfer",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IUniswapV2BrokenPair",
 "name": "pair",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "fromToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "toToken",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "feeDest",
 "type": "uint256"
 }
 ],
 "name": "swapBrokenUniV2",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IUniswapV2BrokenPair",
 "name": "pair",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "fromToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "toToken",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "feeDest",
 "type": "uint256"
 }
 ],
 "name": "swapBrokenUniV2Scaled",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int256",
 "name": "amount0Delta",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1Delta",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "swapCallback",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IUniswapV2Pair",
 "name": "pair",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "fromToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "toToken",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "feeDest",
 "type": "uint256"
 }
 ],
 "name": "swapUniV2",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "contract IUniswapV2Pair",
 "name": "pair",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "fromToken",
 "type": "address"
 },
 {
 "internalType": "contract IERC20",
 "name": "toToken",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "feeDest",
 "type": "uint256"
 }
 ],
 "name": "swapUniV2Scaled",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256",
 "name": "pool",
 "type": "uint256"
 },
 {
 "internalType": "address payable",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "uniswapV3SingleSwapTo",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256[]",
 "name": "pools",
 "type": "uint256[]"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "uniswapV3Swap",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "int256",
 "name": "amount0Delta",
 "type": "int256"
 },
 {
 "internalType": "int256",
 "name": "amount1Delta",
 "type": "int256"
 },
 {
 "internalType": "bytes",
 "name": "data",
 "type": "bytes"
 }
 ],
 "name": "uniswapV3SwapCallback",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "uint256[]",
 "name": "pools",
 "type": "uint256[]"
 },
 {
 "internalType": "address payable",
 "name": "recipient",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "uniswapV3SwapTo",
 "outputs": [
 {
 "internalType": "uint256",
 "name": "returnAmount",
 "type": "uint256"
 }
 ],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address payable",
 "name": "to",
 "type": "address"
 },
 {
 "internalType": "uint256",
 "name": "amount",
 "type": "uint256"
 }
 ],
 "name": "unwrapAndTransfer",
 "outputs": [],
 "stateMutability": "nonpayable",
 "type": "function"
 },
 {
 "inputs": [
 {
 "internalType": "address payable",
 "name": "to",
 "type": "address"
 }
 ],
 "name": "wrapAndTransfer",
 "outputs": [],
 "stateMutability": "payable",
 "type": "function"
 },
 {
 "stateMutability": "payable",
 "type": "receive"
 }
]
export = data