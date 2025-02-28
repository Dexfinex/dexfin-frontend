import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionToLumiaConverterInterface extends Interface {
    getFunction(nameOrSignature: "burn" | "conversionScaleFactor" | "convert" | "isConversionEnabled" | "lumia" | "orion" | "owner" | "renounceOwnership" | "toggleIsConversionEnabled" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Convert" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "burn", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "conversionScaleFactor", values?: undefined): string;
    encodeFunctionData(functionFragment: "convert", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "isConversionEnabled", values?: undefined): string;
    encodeFunctionData(functionFragment: "lumia", values?: undefined): string;
    encodeFunctionData(functionFragment: "orion", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "toggleIsConversionEnabled", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "conversionScaleFactor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "convert", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isConversionEnabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lumia", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "toggleIsConversionEnabled", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
export declare namespace ConvertEvent {
    type InputTuple = [
        account: AddressLike,
        ornAmount: BigNumberish,
        lumiaAmount: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        ornAmount: bigint,
        lumiaAmount: bigint
    ];
    interface OutputObject {
        account: string;
        ornAmount: bigint;
        lumiaAmount: bigint;
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
export interface OrionToLumiaConverter extends BaseContract {
    connect(runner?: ContractRunner | null): OrionToLumiaConverter;
    waitForDeployment(): Promise<this>;
    interface: OrionToLumiaConverterInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    burn: TypedContractMethod<[
        burnAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    conversionScaleFactor: TypedContractMethod<[], [bigint], "view">;
    convert: TypedContractMethod<[ornAmount: BigNumberish], [void], "nonpayable">;
    isConversionEnabled: TypedContractMethod<[], [boolean], "view">;
    lumia: TypedContractMethod<[], [string], "view">;
    orion: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    toggleIsConversionEnabled: TypedContractMethod<[], [void], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "burn"): TypedContractMethod<[
        burnAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "conversionScaleFactor"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "convert"): TypedContractMethod<[ornAmount: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "isConversionEnabled"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "lumia"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "orion"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "toggleIsConversionEnabled"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "Convert"): TypedContractEvent<ConvertEvent.InputTuple, ConvertEvent.OutputTuple, ConvertEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "Convert(address,uint256,uint256)": TypedContractEvent<ConvertEvent.InputTuple, ConvertEvent.OutputTuple, ConvertEvent.OutputObject>;
        Convert: TypedContractEvent<ConvertEvent.InputTuple, ConvertEvent.OutputTuple, ConvertEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
