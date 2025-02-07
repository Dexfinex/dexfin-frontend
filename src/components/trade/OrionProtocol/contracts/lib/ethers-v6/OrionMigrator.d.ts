import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionMigratorInterface extends Interface {
    getFunction(nameOrSignature: "migrate"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "TestCalc"): EventFragment;
    encodeFunctionData(functionFragment: "migrate", values: [
        BigNumberish,
        BigNumberish,
        BigNumberish,
        AddressLike,
        BigNumberish
    ]): string;
    decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
}
export declare namespace TestCalcEvent {
    type InputTuple = [
        amount0V1: BigNumberish,
        amount1V1: BigNumberish,
        amount0V2: BigNumberish,
        amount1V2: BigNumberish
    ];
    type OutputTuple = [
        amount0V1: bigint,
        amount1V1: bigint,
        amount0V2: bigint,
        amount1V2: bigint
    ];
    interface OutputObject {
        amount0V1: bigint;
        amount1V1: bigint;
        amount0V2: bigint;
        amount1V2: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionMigrator extends BaseContract {
    connect(runner?: ContractRunner | null): OrionMigrator;
    waitForDeployment(): Promise<this>;
    interface: OrionMigratorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    migrate: TypedContractMethod<[
        tokensToMigrate: BigNumberish,
        amount0Min: BigNumberish,
        amount1Min: BigNumberish,
        to: AddressLike,
        deadline: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "migrate"): TypedContractMethod<[
        tokensToMigrate: BigNumberish,
        amount0Min: BigNumberish,
        amount1Min: BigNumberish,
        to: AddressLike,
        deadline: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "TestCalc"): TypedContractEvent<TestCalcEvent.InputTuple, TestCalcEvent.OutputTuple, TestCalcEvent.OutputObject>;
    filters: {
        "TestCalc(uint256,uint256,uint256,uint256)": TypedContractEvent<TestCalcEvent.InputTuple, TestCalcEvent.OutputTuple, TestCalcEvent.OutputObject>;
        TestCalc: TypedContractEvent<TestCalcEvent.InputTuple, TestCalcEvent.OutputTuple, TestCalcEvent.OutputObject>;
    };
}
