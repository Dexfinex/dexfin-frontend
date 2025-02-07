import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace PriceOracle {
    type PriceDataOutStruct = {
        price: BigNumberish;
        timestamp: BigNumberish;
    };
    type PriceDataOutStructOutput = [price: bigint, timestamp: bigint] & {
        price: bigint;
        timestamp: bigint;
    };
    type PricesStruct = {
        assetAddresses: AddressLike[];
        prices: BigNumberish[];
        timestamp: BigNumberish;
        signature: BytesLike;
    };
    type PricesStructOutput = [
        assetAddresses: string[],
        prices: bigint[],
        timestamp: bigint,
        signature: string
    ] & {
        assetAddresses: string[];
        prices: bigint[];
        timestamp: bigint;
        signature: string;
    };
}
export interface PriceOracleInterface extends Interface {
    getFunction(nameOrSignature: "assetPrices" | "baseAsset" | "chainLinkETHAggregator" | "changePriceProviderAuthorization" | "getChainLinkPriceData" | "givePrices" | "oraclePublicKey" | "owner" | "priceProviderAuthorization" | "provideDataAddressAuthorization" | "renounceOwnership" | "setChainLinkAggregators" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "assetPrices", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "baseAsset", values?: undefined): string;
    encodeFunctionData(functionFragment: "chainLinkETHAggregator", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "changePriceProviderAuthorization", values: [AddressLike[], AddressLike[]]): string;
    encodeFunctionData(functionFragment: "getChainLinkPriceData", values: [AddressLike[]]): string;
    encodeFunctionData(functionFragment: "givePrices", values: [AddressLike[]]): string;
    encodeFunctionData(functionFragment: "oraclePublicKey", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "priceProviderAuthorization", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "provideDataAddressAuthorization", values: [PriceOracle.PricesStruct]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setChainLinkAggregators", values: [AddressLike[], AddressLike[]]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "assetPrices", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "baseAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "chainLinkETHAggregator", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changePriceProviderAuthorization", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainLinkPriceData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "givePrices", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oraclePublicKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "priceProviderAuthorization", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "provideDataAddressAuthorization", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setChainLinkAggregators", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
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
export interface PriceOracle extends BaseContract {
    connect(runner?: ContractRunner | null): PriceOracle;
    waitForDeployment(): Promise<this>;
    interface: PriceOracleInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    assetPrices: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [bigint, bigint] & {
            price: bigint;
            timestamp: bigint;
        }
    ], "view">;
    baseAsset: TypedContractMethod<[], [string], "view">;
    chainLinkETHAggregator: TypedContractMethod<[
        arg0: AddressLike
    ], [
        string
    ], "view">;
    changePriceProviderAuthorization: TypedContractMethod<[
        added: AddressLike[],
        removed: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    getChainLinkPriceData: TypedContractMethod<[
        assets: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    givePrices: TypedContractMethod<[
        assetAddresses: AddressLike[]
    ], [
        PriceOracle.PriceDataOutStructOutput[]
    ], "view">;
    oraclePublicKey: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    priceProviderAuthorization: TypedContractMethod<[
        arg0: AddressLike
    ], [
        boolean
    ], "view">;
    provideDataAddressAuthorization: TypedContractMethod<[
        priceFeed: PriceOracle.PricesStruct
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    setChainLinkAggregators: TypedContractMethod<[
        assets: AddressLike[],
        aggregatorAddresses: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "assetPrices"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [bigint, bigint] & {
            price: bigint;
            timestamp: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "baseAsset"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "chainLinkETHAggregator"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "changePriceProviderAuthorization"): TypedContractMethod<[
        added: AddressLike[],
        removed: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getChainLinkPriceData"): TypedContractMethod<[assets: AddressLike[]], [void], "nonpayable">;
    getFunction(nameOrSignature: "givePrices"): TypedContractMethod<[
        assetAddresses: AddressLike[]
    ], [
        PriceOracle.PriceDataOutStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "oraclePublicKey"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "priceProviderAuthorization"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "provideDataAddressAuthorization"): TypedContractMethod<[
        priceFeed: PriceOracle.PricesStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "setChainLinkAggregators"): TypedContractMethod<[
        assets: AddressLike[],
        aggregatorAddresses: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
