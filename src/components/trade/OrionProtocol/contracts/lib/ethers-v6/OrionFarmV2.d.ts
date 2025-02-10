import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionFarmV2Interface extends Interface {
    getFunction(nameOrSignature: "allStake" | "claimReward" | "createSmartReward" | "create_lock_period" | "getBoost" | "getReward" | "getStake" | "increase_amount" | "increase_lock_period" | "libStakingReward" | "listSmartReward" | "lockTimePeriod" | "lockTimeStart" | "smartVote" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "CreateSmartReward"): EventFragment;
    encodeFunctionData(functionFragment: "allStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "claimReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "createSmartReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "create_lock_period", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getBoost", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "getStake", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "increase_amount", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "increase_lock_period", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "libStakingReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "listSmartReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockTimePeriod", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "lockTimeStart", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "smartVote", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "allStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createSmartReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "create_lock_period", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBoost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increase_amount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increase_lock_period", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "libStakingReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listSmartReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTimePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTimeStart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartVote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}
export declare namespace CreateSmartRewardEvent {
    type InputTuple = [
        pool: AddressLike,
        smart: AddressLike,
        decimals: BigNumberish
    ];
    type OutputTuple = [pool: string, smart: string, decimals: bigint];
    interface OutputObject {
        pool: string;
        smart: string;
        decimals: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionFarmV2 extends BaseContract {
    connect(runner?: ContractRunner | null): OrionFarmV2;
    waitForDeployment(): Promise<this>;
    interface: OrionFarmV2Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    allStake: TypedContractMethod<[pool: AddressLike], [bigint], "view">;
    claimReward: TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    createSmartReward: TypedContractMethod<[
        pool: AddressLike
    ], [
        void
    ], "nonpayable">;
    create_lock_period: TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish,
        lock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getBoost: TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getReward: TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getStake: TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    increase_amount: TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    increase_lock_period: TypedContractMethod<[
        pool: AddressLike,
        new_lock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    libStakingReward: TypedContractMethod<[], [string], "view">;
    listSmartReward: TypedContractMethod<[arg0: AddressLike], [string], "view">;
    lockTimePeriod: TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    lockTimeStart: TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    smartVote: TypedContractMethod<[], [string], "view">;
    withdraw: TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "allStake"): TypedContractMethod<[pool: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "claimReward"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "createSmartReward"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "create_lock_period"): TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish,
        lock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getBoost"): TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getStake"): TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "increase_amount"): TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "increase_lock_period"): TypedContractMethod<[
        pool: AddressLike,
        new_lock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "libStakingReward"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "listSmartReward"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "lockTimePeriod"): TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "lockTimeStart"): TypedContractMethod<[
        pool: AddressLike,
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "smartVote"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getEvent(key: "CreateSmartReward"): TypedContractEvent<CreateSmartRewardEvent.InputTuple, CreateSmartRewardEvent.OutputTuple, CreateSmartRewardEvent.OutputObject>;
    filters: {
        "CreateSmartReward(address,address,uint8)": TypedContractEvent<CreateSmartRewardEvent.InputTuple, CreateSmartRewardEvent.OutputTuple, CreateSmartRewardEvent.OutputObject>;
        CreateSmartReward: TypedContractEvent<CreateSmartRewardEvent.InputTuple, CreateSmartRewardEvent.OutputTuple, CreateSmartRewardEvent.OutputObject>;
    };
}
