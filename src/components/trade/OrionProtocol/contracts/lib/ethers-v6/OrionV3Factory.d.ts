import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace IOrionV3Factory {
    type PoolPrarmsStruct = {
        poolToken0: AddressLike;
        poolToken1: AddressLike;
        poolFee: BigNumberish;
        tickMultiplier: BigNumberish;
        listLib: AddressLike;
    };
    type PoolPrarmsStructOutput = [
        poolToken0: string,
        poolToken1: string,
        poolFee: bigint,
        tickMultiplier: bigint,
        listLib: string
    ] & {
        poolToken0: string;
        poolToken1: string;
        poolFee: bigint;
        tickMultiplier: bigint;
        listLib: string;
    };
}
export interface OrionV3FactoryInterface extends Interface {
    getFunction(nameOrSignature: "POOL_INIT_CODE_HASH" | "createPool" | "enableFeeAmount" | "feeAmountTickMultiplier" | "getPool" | "getPoolData" | "listLib" | "listPool" | "owner" | "poolCode" | "setOwner"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "FeeAmountEnabled" | "OwnerChanged" | "PoolCreated"): EventFragment;
    encodeFunctionData(functionFragment: "POOL_INIT_CODE_HASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "createPool", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "enableFeeAmount", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "feeAmountTickMultiplier", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getPool", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getPoolData", values?: undefined): string;
    encodeFunctionData(functionFragment: "listLib", values?: undefined): string;
    encodeFunctionData(functionFragment: "listPool", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "poolCode", values?: undefined): string;
    encodeFunctionData(functionFragment: "setOwner", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "POOL_INIT_CODE_HASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "enableFeeAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeAmountTickMultiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPoolData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listLib", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolCode", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
}
export declare namespace FeeAmountEnabledEvent {
    type InputTuple = [fee: BigNumberish, tickMultiplier: BigNumberish];
    type OutputTuple = [fee: bigint, tickMultiplier: bigint];
    interface OutputObject {
        fee: bigint;
        tickMultiplier: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnerChangedEvent {
    type InputTuple = [oldOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [oldOwner: string, newOwner: string];
    interface OutputObject {
        oldOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace PoolCreatedEvent {
    type InputTuple = [
        token0: AddressLike,
        token1: AddressLike,
        fee: BigNumberish,
        pool: AddressLike
    ];
    type OutputTuple = [
        token0: string,
        token1: string,
        fee: bigint,
        pool: string
    ];
    interface OutputObject {
        token0: string;
        token1: string;
        fee: bigint;
        pool: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionV3Factory extends BaseContract {
    connect(runner?: ContractRunner | null): OrionV3Factory;
    waitForDeployment(): Promise<this>;
    interface: OrionV3FactoryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    POOL_INIT_CODE_HASH: TypedContractMethod<[], [string], "view">;
    createPool: TypedContractMethod<[
        tokenA: AddressLike,
        tokenB: AddressLike,
        fee: BigNumberish
    ], [
        string
    ], "nonpayable">;
    enableFeeAmount: TypedContractMethod<[
        fee: BigNumberish,
        tickMultiplier: BigNumberish
    ], [
        void
    ], "nonpayable">;
    feeAmountTickMultiplier: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        bigint
    ], "view">;
    getPool: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish
    ], [
        string
    ], "view">;
    getPoolData: TypedContractMethod<[
    ], [
        IOrionV3Factory.PoolPrarmsStructOutput
    ], "view">;
    listLib: TypedContractMethod<[], [string], "view">;
    listPool: TypedContractMethod<[
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        string[]
    ], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    poolCode: TypedContractMethod<[], [string], "view">;
    setOwner: TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "POOL_INIT_CODE_HASH"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "createPool"): TypedContractMethod<[
        tokenA: AddressLike,
        tokenB: AddressLike,
        fee: BigNumberish
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "enableFeeAmount"): TypedContractMethod<[
        fee: BigNumberish,
        tickMultiplier: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "feeAmountTickMultiplier"): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getPool"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "getPoolData"): TypedContractMethod<[], [IOrionV3Factory.PoolPrarmsStructOutput], "view">;
    getFunction(nameOrSignature: "listLib"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "listPool"): TypedContractMethod<[
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        string[]
    ], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "poolCode"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setOwner"): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getEvent(key: "FeeAmountEnabled"): TypedContractEvent<FeeAmountEnabledEvent.InputTuple, FeeAmountEnabledEvent.OutputTuple, FeeAmountEnabledEvent.OutputObject>;
    getEvent(key: "OwnerChanged"): TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
    getEvent(key: "PoolCreated"): TypedContractEvent<PoolCreatedEvent.InputTuple, PoolCreatedEvent.OutputTuple, PoolCreatedEvent.OutputObject>;
    filters: {
        "FeeAmountEnabled(uint24,int128)": TypedContractEvent<FeeAmountEnabledEvent.InputTuple, FeeAmountEnabledEvent.OutputTuple, FeeAmountEnabledEvent.OutputObject>;
        FeeAmountEnabled: TypedContractEvent<FeeAmountEnabledEvent.InputTuple, FeeAmountEnabledEvent.OutputTuple, FeeAmountEnabledEvent.OutputObject>;
        "OwnerChanged(address,address)": TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
        OwnerChanged: TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
        "PoolCreated(address,address,uint24,address)": TypedContractEvent<PoolCreatedEvent.InputTuple, PoolCreatedEvent.OutputTuple, PoolCreatedEvent.OutputObject>;
        PoolCreated: TypedContractEvent<PoolCreatedEvent.InputTuple, PoolCreatedEvent.OutputTuple, PoolCreatedEvent.OutputObject>;
    };
}
