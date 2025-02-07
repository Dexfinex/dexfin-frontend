import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace IPoolFunctionality {
    type SwapDataStruct = {
        amount_spend: BigNumberish;
        amount_receive: BigNumberish;
        orionpool_router: AddressLike;
        is_exact_spend: boolean;
        supportingFee: boolean;
        isInContractTrade: boolean;
        isSentETHEnough: boolean;
        isFromWallet: boolean;
        asset_spend: AddressLike;
        path: AddressLike[];
    };
    type SwapDataStructOutput = [
        amount_spend: bigint,
        amount_receive: bigint,
        orionpool_router: string,
        is_exact_spend: boolean,
        supportingFee: boolean,
        isInContractTrade: boolean,
        isSentETHEnough: boolean,
        isFromWallet: boolean,
        asset_spend: string,
        path: string[]
    ] & {
        amount_spend: bigint;
        amount_receive: bigint;
        orionpool_router: string;
        is_exact_spend: boolean;
        supportingFee: boolean;
        isInContractTrade: boolean;
        isSentETHEnough: boolean;
        isFromWallet: boolean;
        asset_spend: string;
        path: string[];
    };
}
export interface PoolFunctionalityInterface extends Interface {
    getFunction(nameOrSignature: "WETH" | "addLiquidityFromExchange" | "doSwapThroughOrionPool" | "factories" | "factory" | "getFactoriesLength" | "getWETH" | "increaseAllowances" | "isFactory" | "owner" | "pairFor" | "renounceOwnership" | "supportedFactories" | "transferOwnership" | "updateFactories"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OrionPoolSwap" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
    encodeFunctionData(functionFragment: "addLiquidityFromExchange", values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        AddressLike
    ]): string;
    encodeFunctionData(functionFragment: "doSwapThroughOrionPool", values: [AddressLike, AddressLike, IPoolFunctionality.SwapDataStruct]): string;
    encodeFunctionData(functionFragment: "factories", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "factory", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFactoriesLength", values?: undefined): string;
    encodeFunctionData(functionFragment: "getWETH", values?: undefined): string;
    encodeFunctionData(functionFragment: "increaseAllowances", values: [AddressLike[], AddressLike[], BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "isFactory", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pairFor", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportedFactories", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "updateFactories", values: [AddressLike[], BigNumberish[]]): string;
    decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addLiquidityFromExchange", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "doSwapThroughOrionPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "factories", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactoriesLength", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWETH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increaseAllowances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isFactory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pairFor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportedFactories", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateFactories", data: BytesLike): Result;
}
export declare namespace OrionPoolSwapEvent {
    type InputTuple = [
        sender: AddressLike,
        st: AddressLike,
        rt: AddressLike,
        st_r: BigNumberish,
        st_a: BigNumberish,
        rt_r: BigNumberish,
        rt_a: BigNumberish,
        f: AddressLike
    ];
    type OutputTuple = [
        sender: string,
        st: string,
        rt: string,
        st_r: bigint,
        st_a: bigint,
        rt_r: bigint,
        rt_a: bigint,
        f: string
    ];
    interface OutputObject {
        sender: string;
        st: string;
        rt: string;
        st_r: bigint;
        st_a: bigint;
        rt_r: bigint;
        rt_a: bigint;
        f: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface PoolFunctionality extends BaseContract {
    connect(runner?: ContractRunner | null): PoolFunctionality;
    waitForDeployment(): Promise<this>;
    interface: PoolFunctionalityInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    WETH: TypedContractMethod<[], [string], "view">;
    addLiquidityFromExchange: TypedContractMethod<[
        tokenA: AddressLike,
        tokenB: AddressLike,
        amountADesired: BigNumberish,
        amountBDesired: BigNumberish,
        amountAMin: BigNumberish,
        amountBMin: BigNumberish,
        to: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            amountA: bigint;
            amountB: bigint;
            liquidity: bigint;
        }
    ], "nonpayable">;
    doSwapThroughOrionPool: TypedContractMethod<[
        user: AddressLike,
        to: AddressLike,
        swapData: IPoolFunctionality.SwapDataStruct
    ], [
        [bigint, bigint] & {
            amountOut: bigint;
            amountIn: bigint;
        }
    ], "nonpayable">;
    factories: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    factory: TypedContractMethod<[], [string], "view">;
    getFactoriesLength: TypedContractMethod<[], [bigint], "view">;
    getWETH: TypedContractMethod<[], [string], "view">;
    increaseAllowances: TypedContractMethod<[
        tokens: AddressLike[],
        tos: AddressLike[],
        amounts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    isFactory: TypedContractMethod<[a: AddressLike], [boolean], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    pairFor: TypedContractMethod<[
        curFactory: AddressLike,
        tokenA: AddressLike,
        tokenB: AddressLike
    ], [
        string
    ], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    supportedFactories: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    updateFactories: TypedContractMethod<[
        _factories: AddressLike[],
        _types: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "WETH"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "addLiquidityFromExchange"): TypedContractMethod<[
        tokenA: AddressLike,
        tokenB: AddressLike,
        amountADesired: BigNumberish,
        amountBDesired: BigNumberish,
        amountAMin: BigNumberish,
        amountBMin: BigNumberish,
        to: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            amountA: bigint;
            amountB: bigint;
            liquidity: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "doSwapThroughOrionPool"): TypedContractMethod<[
        user: AddressLike,
        to: AddressLike,
        swapData: IPoolFunctionality.SwapDataStruct
    ], [
        [bigint, bigint] & {
            amountOut: bigint;
            amountIn: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "factories"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "factory"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getFactoriesLength"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getWETH"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "increaseAllowances"): TypedContractMethod<[
        tokens: AddressLike[],
        tos: AddressLike[],
        amounts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "isFactory"): TypedContractMethod<[a: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pairFor"): TypedContractMethod<[
        curFactory: AddressLike,
        tokenA: AddressLike,
        tokenB: AddressLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "supportedFactories"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "updateFactories"): TypedContractMethod<[
        _factories: AddressLike[],
        _types: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "OrionPoolSwap"): TypedContractEvent<OrionPoolSwapEvent.InputTuple, OrionPoolSwapEvent.OutputTuple, OrionPoolSwapEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OrionPoolSwap(address,address,address,uint256,uint256,uint256,uint256,address)": TypedContractEvent<OrionPoolSwapEvent.InputTuple, OrionPoolSwapEvent.OutputTuple, OrionPoolSwapEvent.OutputObject>;
        OrionPoolSwap: TypedContractEvent<OrionPoolSwapEvent.InputTuple, OrionPoolSwapEvent.OutputTuple, OrionPoolSwapEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
