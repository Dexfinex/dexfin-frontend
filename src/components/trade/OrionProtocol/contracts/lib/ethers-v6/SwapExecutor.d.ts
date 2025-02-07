import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common.js";
export interface SwapExecutorInterface extends Interface {
    getFunction(nameOrSignature: "AlgebraSwapCallback" | "curveSwapMetaAmountIn" | "curveSwapStableAmountIn" | "curveSwapStableAmountOut" | "func_70LYiww" | "orionV3SingleSwapTo" | "orionV3Swap" | "orionV3SwapCallback" | "orionV3SwapTo" | "orionV3SwapToWithPermit" | "pancakeV3SwapCallback" | "patchCallWithArbitraryCall" | "patchCallWithTokenBalance" | "patchCallsWithArbitraryCall" | "patchCallsWithTokenBalance" | "payFeeToMatcher" | "safeApprove" | "safeTransfer" | "swapBrokenUniV2" | "swapBrokenUniV2Scaled" | "swapCallback" | "swapUniV2" | "swapUniV2Scaled" | "uniswapV3SingleSwapTo" | "uniswapV3Swap" | "uniswapV3SwapCallback" | "uniswapV3SwapTo" | "unwrapAndTransfer" | "wrapAndTransfer"): FunctionFragment;
    encodeFunctionData(functionFragment: "AlgebraSwapCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "curveSwapMetaAmountIn", values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        AddressLike
    ]): string;
    encodeFunctionData(functionFragment: "curveSwapStableAmountIn", values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        AddressLike,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "curveSwapStableAmountOut", values: [
        AddressLike,
        AddressLike,
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        AddressLike
    ]): string;
    encodeFunctionData(functionFragment: "func_70LYiww", values: [AddressLike, BytesLike[]]): string;
    encodeFunctionData(functionFragment: "orionV3SingleSwapTo", values: [BigNumberish, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "orionV3Swap", values: [BigNumberish[], BigNumberish]): string;
    encodeFunctionData(functionFragment: "orionV3SwapCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "orionV3SwapTo", values: [BigNumberish[], AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "orionV3SwapToWithPermit", values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish[],
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "pancakeV3SwapCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "patchCallWithArbitraryCall", values: [BytesLike, BigNumberish, AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "patchCallWithTokenBalance", values: [BytesLike, BigNumberish, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "patchCallsWithArbitraryCall", values: [BytesLike[], BigNumberish[], AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "patchCallsWithTokenBalance", values: [BytesLike[], BigNumberish[], AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "payFeeToMatcher", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "safeApprove", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "safeTransfer", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "swapBrokenUniV2", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "swapBrokenUniV2Scaled", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "swapCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "swapUniV2", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "swapUniV2Scaled", values: [AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "uniswapV3SingleSwapTo", values: [BigNumberish, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "uniswapV3Swap", values: [BigNumberish[], BigNumberish]): string;
    encodeFunctionData(functionFragment: "uniswapV3SwapCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "uniswapV3SwapTo", values: [BigNumberish[], AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "unwrapAndTransfer", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "wrapAndTransfer", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "AlgebraSwapCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "curveSwapMetaAmountIn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "curveSwapStableAmountIn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "curveSwapStableAmountOut", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "func_70LYiww", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orionV3SingleSwapTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orionV3Swap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orionV3SwapCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orionV3SwapTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orionV3SwapToWithPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pancakeV3SwapCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "patchCallWithArbitraryCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "patchCallWithTokenBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "patchCallsWithArbitraryCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "patchCallsWithTokenBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "payFeeToMatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeApprove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swapBrokenUniV2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swapBrokenUniV2Scaled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swapCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swapUniV2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swapUniV2Scaled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV3SingleSwapTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV3Swap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV3SwapCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV3SwapTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unwrapAndTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "wrapAndTransfer", data: BytesLike): Result;
}
export interface SwapExecutor extends BaseContract {
    connect(runner?: ContractRunner | null): SwapExecutor;
    waitForDeployment(): Promise<this>;
    interface: SwapExecutorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    AlgebraSwapCallback: TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    curveSwapMetaAmountIn: TypedContractMethod<[
        pool: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        amountIn: BigNumberish,
        amountOut: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    curveSwapStableAmountIn: TypedContractMethod<[
        pool: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        to: AddressLike,
        amountIn: BigNumberish
    ], [
        void
    ], "nonpayable">;
    curveSwapStableAmountOut: TypedContractMethod<[
        registry: AddressLike,
        pool: AddressLike,
        assetIn: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        fee: BigNumberish,
        amountOut: BigNumberish,
        maxSpendAmount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    func_70LYiww: TypedContractMethod<[
        arg0: AddressLike,
        calls: BytesLike[]
    ], [
        void
    ], "payable">;
    orionV3SingleSwapTo: TypedContractMethod<[
        pool: BigNumberish,
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    orionV3Swap: TypedContractMethod<[
        pools: BigNumberish[],
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    orionV3SwapCallback: TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    orionV3SwapTo: TypedContractMethod<[
        pools: BigNumberish[],
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    orionV3SwapToWithPermit: TypedContractMethod<[
        recipient: AddressLike,
        srcToken: AddressLike,
        amount: BigNumberish,
        minReturn: BigNumberish,
        pools: BigNumberish[],
        permit: BytesLike
    ], [
        bigint
    ], "nonpayable">;
    pancakeV3SwapCallback: TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    patchCallWithArbitraryCall: TypedContractMethod<[
        desc: BytesLike,
        skipMaskAndOffset: BigNumberish,
        patchTarget: AddressLike,
        patchData: BytesLike
    ], [
        void
    ], "nonpayable">;
    patchCallWithTokenBalance: TypedContractMethod<[
        desc: BytesLike,
        skipMaskAndOffset: BigNumberish,
        token: AddressLike,
        ratio: BigNumberish
    ], [
        void
    ], "nonpayable">;
    patchCallsWithArbitraryCall: TypedContractMethod<[
        calls: BytesLike[],
        skipMasksAndOffsets: BigNumberish[],
        patchTarget: AddressLike,
        patchData: BytesLike
    ], [
        void
    ], "nonpayable">;
    patchCallsWithTokenBalance: TypedContractMethod<[
        calls: BytesLike[],
        skipMasksAndOffsets: BigNumberish[],
        token: AddressLike,
        ratio: BigNumberish
    ], [
        void
    ], "nonpayable">;
    payFeeToMatcher: TypedContractMethod<[
        to: AddressLike,
        token: AddressLike,
        feeAmount: BigNumberish
    ], [
        void
    ], "payable">;
    safeApprove: TypedContractMethod<[
        token: AddressLike,
        spender: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    safeTransfer: TypedContractMethod<[
        token: AddressLike,
        target: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swapBrokenUniV2: TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swapBrokenUniV2Scaled: TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swapCallback: TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    swapUniV2: TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swapUniV2Scaled: TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    uniswapV3SingleSwapTo: TypedContractMethod<[
        pool: BigNumberish,
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    uniswapV3Swap: TypedContractMethod<[
        pools: BigNumberish[],
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    uniswapV3SwapCallback: TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    uniswapV3SwapTo: TypedContractMethod<[
        pools: BigNumberish[],
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    unwrapAndTransfer: TypedContractMethod<[
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    wrapAndTransfer: TypedContractMethod<[to: AddressLike], [void], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "AlgebraSwapCallback"): TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "curveSwapMetaAmountIn"): TypedContractMethod<[
        pool: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        amountIn: BigNumberish,
        amountOut: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "curveSwapStableAmountIn"): TypedContractMethod<[
        pool: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        to: AddressLike,
        amountIn: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "curveSwapStableAmountOut"): TypedContractMethod<[
        registry: AddressLike,
        pool: AddressLike,
        assetIn: AddressLike,
        assetOut: AddressLike,
        i: BigNumberish,
        j: BigNumberish,
        fee: BigNumberish,
        amountOut: BigNumberish,
        maxSpendAmount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "func_70LYiww"): TypedContractMethod<[
        arg0: AddressLike,
        calls: BytesLike[]
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "orionV3SingleSwapTo"): TypedContractMethod<[
        pool: BigNumberish,
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "orionV3Swap"): TypedContractMethod<[
        pools: BigNumberish[],
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "orionV3SwapCallback"): TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "orionV3SwapTo"): TypedContractMethod<[
        pools: BigNumberish[],
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "orionV3SwapToWithPermit"): TypedContractMethod<[
        recipient: AddressLike,
        srcToken: AddressLike,
        amount: BigNumberish,
        minReturn: BigNumberish,
        pools: BigNumberish[],
        permit: BytesLike
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "pancakeV3SwapCallback"): TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "patchCallWithArbitraryCall"): TypedContractMethod<[
        desc: BytesLike,
        skipMaskAndOffset: BigNumberish,
        patchTarget: AddressLike,
        patchData: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "patchCallWithTokenBalance"): TypedContractMethod<[
        desc: BytesLike,
        skipMaskAndOffset: BigNumberish,
        token: AddressLike,
        ratio: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "patchCallsWithArbitraryCall"): TypedContractMethod<[
        calls: BytesLike[],
        skipMasksAndOffsets: BigNumberish[],
        patchTarget: AddressLike,
        patchData: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "patchCallsWithTokenBalance"): TypedContractMethod<[
        calls: BytesLike[],
        skipMasksAndOffsets: BigNumberish[],
        token: AddressLike,
        ratio: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "payFeeToMatcher"): TypedContractMethod<[
        to: AddressLike,
        token: AddressLike,
        feeAmount: BigNumberish
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "safeApprove"): TypedContractMethod<[
        token: AddressLike,
        spender: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "safeTransfer"): TypedContractMethod<[
        token: AddressLike,
        target: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swapBrokenUniV2"): TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swapBrokenUniV2Scaled"): TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swapCallback"): TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swapUniV2"): TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swapUniV2Scaled"): TypedContractMethod<[
        pair: AddressLike,
        fromToken: AddressLike,
        toToken: AddressLike,
        feeDest: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "uniswapV3SingleSwapTo"): TypedContractMethod<[
        pool: BigNumberish,
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "uniswapV3Swap"): TypedContractMethod<[
        pools: BigNumberish[],
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "uniswapV3SwapCallback"): TypedContractMethod<[
        amount0Delta: BigNumberish,
        amount1Delta: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "uniswapV3SwapTo"): TypedContractMethod<[
        pools: BigNumberish[],
        recipient: AddressLike,
        amount: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "unwrapAndTransfer"): TypedContractMethod<[
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "wrapAndTransfer"): TypedContractMethod<[to: AddressLike], [void], "payable">;
    filters: {};
}
