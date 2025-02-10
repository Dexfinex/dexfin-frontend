import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace OrionReferral {
    type FeeOrderStruct = {
        referrer: AddressLike;
        amount: BigNumberish;
        signature: BytesLike;
    };
    type FeeOrderStructOutput = [
        referrer: string,
        amount: bigint,
        signature: string
    ] & {
        referrer: string;
        amount: bigint;
        signature: string;
    };
}
export interface OrionReferralInterface extends Interface {
    getFunction(nameOrSignature: "getFee" | "initialize" | "owner" | "renounceOwnership" | "rewardToken" | "setVerifier" | "totalFeeAccrued" | "transferOwnership" | "verifier"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "FeeAccrued" | "Initialized" | "OwnershipTransferred" | "VerifierUpdate"): EventFragment;
    encodeFunctionData(functionFragment: "getFee", values: [OrionReferral.FeeOrderStruct]): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "setVerifier", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "totalFeeAccrued", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setVerifier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalFeeAccrued", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
}
export declare namespace FeeAccruedEvent {
    type InputTuple = [referrer: AddressLike, amountAccrued: BigNumberish];
    type OutputTuple = [referrer: string, amountAccrued: bigint];
    interface OutputObject {
        referrer: string;
        amountAccrued: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace InitializedEvent {
    type InputTuple = [version: BigNumberish];
    type OutputTuple = [version: bigint];
    interface OutputObject {
        version: bigint;
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
export declare namespace VerifierUpdateEvent {
    type InputTuple = [verifier: AddressLike];
    type OutputTuple = [verifier: string];
    interface OutputObject {
        verifier: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionReferral extends BaseContract {
    connect(runner?: ContractRunner | null): OrionReferral;
    waitForDeployment(): Promise<this>;
    interface: OrionReferralInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getFee: TypedContractMethod<[
        order: OrionReferral.FeeOrderStruct
    ], [
        void
    ], "nonpayable">;
    initialize: TypedContractMethod<[
        rewardToken_: AddressLike,
        verifier_: AddressLike
    ], [
        void
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    rewardToken: TypedContractMethod<[], [string], "view">;
    setVerifier: TypedContractMethod<[
        verifier_: AddressLike
    ], [
        void
    ], "nonpayable">;
    totalFeeAccrued: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    verifier: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getFee"): TypedContractMethod<[
        order: OrionReferral.FeeOrderStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        rewardToken_: AddressLike,
        verifier_: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "rewardToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setVerifier"): TypedContractMethod<[verifier_: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "totalFeeAccrued"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "verifier"): TypedContractMethod<[], [string], "view">;
    getEvent(key: "FeeAccrued"): TypedContractEvent<FeeAccruedEvent.InputTuple, FeeAccruedEvent.OutputTuple, FeeAccruedEvent.OutputObject>;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "VerifierUpdate"): TypedContractEvent<VerifierUpdateEvent.InputTuple, VerifierUpdateEvent.OutputTuple, VerifierUpdateEvent.OutputObject>;
    filters: {
        "FeeAccrued(address,uint256)": TypedContractEvent<FeeAccruedEvent.InputTuple, FeeAccruedEvent.OutputTuple, FeeAccruedEvent.OutputObject>;
        FeeAccrued: TypedContractEvent<FeeAccruedEvent.InputTuple, FeeAccruedEvent.OutputTuple, FeeAccruedEvent.OutputObject>;
        "Initialized(uint8)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "VerifierUpdate(address)": TypedContractEvent<VerifierUpdateEvent.InputTuple, VerifierUpdateEvent.OutputTuple, VerifierUpdateEvent.OutputObject>;
        VerifierUpdate: TypedContractEvent<VerifierUpdateEvent.InputTuple, VerifierUpdateEvent.OutputTuple, VerifierUpdateEvent.OutputObject>;
    };
}
