import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace IDOAccruedDistributor {
    type OrderStruct = {
        sender: AddressLike;
        receiver: AddressLike;
        asset: AddressLike;
        amount: BigNumberish;
        startTime: BigNumberish;
        signature: BytesLike;
    };
    type OrderStructOutput = [
        sender: string,
        receiver: string,
        asset: string,
        amount: bigint,
        startTime: bigint,
        signature: string
    ] & {
        sender: string;
        receiver: string;
        asset: string;
        amount: bigint;
        startTime: bigint;
        signature: string;
    };
}
export interface IDODistributorInterface extends Interface {
    getFunction(nameOrSignature: "accrued" | "claimTokens" | "claimedOrders" | "distibuteNewTokens" | "emergencyAssetWithdrawal" | "finishClaimTime" | "idoToken" | "initialize" | "lastTimeRewardApplicable" | "owner" | "payouts" | "renounceOwnership" | "startClaimTime" | "term" | "tokensAllocation" | "transferOwnership" | "updateParams" | "verifier"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "NewTokenDistribution" | "OwnershipTransferred" | "TokensClaimed"): EventFragment;
    encodeFunctionData(functionFragment: "accrued", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "claimTokens", values: [IDOAccruedDistributor.OrderStruct]): string;
    encodeFunctionData(functionFragment: "claimedOrders", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "distibuteNewTokens", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "finishClaimTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "idoToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lastTimeRewardApplicable", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "payouts", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "startClaimTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "term", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokensAllocation", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "updateParams", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "verifier", values?: undefined): string;
    decodeFunctionResult(functionFragment: "accrued", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimedOrders", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "distibuteNewTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "finishClaimTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "idoToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastTimeRewardApplicable", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "payouts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "startClaimTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "term", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokensAllocation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateParams", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;
}
export declare namespace NewTokenDistributionEvent {
    type InputTuple = [amount: BigNumberish];
    type OutputTuple = [amount: bigint];
    interface OutputObject {
        amount: bigint;
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
export declare namespace TokensClaimedEvent {
    type InputTuple = [
        receiver: AddressLike,
        amount: BigNumberish,
        orderHash: BytesLike
    ];
    type OutputTuple = [
        receiver: string,
        amount: bigint,
        orderHash: string
    ];
    interface OutputObject {
        receiver: string;
        amount: bigint;
        orderHash: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IDODistributor extends BaseContract {
    connect(runner?: ContractRunner | null): IDODistributor;
    waitForDeployment(): Promise<this>;
    interface: IDODistributorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    accrued: TypedContractMethod<[amount: BigNumberish], [bigint], "view">;
    claimTokens: TypedContractMethod<[
        order_: IDOAccruedDistributor.OrderStruct
    ], [
        void
    ], "nonpayable">;
    claimedOrders: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    distibuteNewTokens: TypedContractMethod<[
        amount: BigNumberish,
        finishClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    emergencyAssetWithdrawal: TypedContractMethod<[
        asset: AddressLike
    ], [
        void
    ], "nonpayable">;
    finishClaimTime: TypedContractMethod<[], [bigint], "view">;
    idoToken: TypedContractMethod<[], [string], "view">;
    initialize: TypedContractMethod<[
        idoToken_: AddressLike,
        verifier_: AddressLike,
        startClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    lastTimeRewardApplicable: TypedContractMethod<[], [bigint], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    payouts: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    startClaimTime: TypedContractMethod<[], [bigint], "view">;
    term: TypedContractMethod<[], [bigint], "view">;
    tokensAllocation: TypedContractMethod<[], [bigint], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    updateParams: TypedContractMethod<[
        idoToken_: AddressLike,
        verifier_: AddressLike,
        startClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    verifier: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "accrued"): TypedContractMethod<[amount: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "claimTokens"): TypedContractMethod<[
        order_: IDOAccruedDistributor.OrderStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimedOrders"): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "distibuteNewTokens"): TypedContractMethod<[
        amount: BigNumberish,
        finishClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "emergencyAssetWithdrawal"): TypedContractMethod<[asset: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "finishClaimTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "idoToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        idoToken_: AddressLike,
        verifier_: AddressLike,
        startClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lastTimeRewardApplicable"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "payouts"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "startClaimTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "term"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "tokensAllocation"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "updateParams"): TypedContractMethod<[
        idoToken_: AddressLike,
        verifier_: AddressLike,
        startClaimTime_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "verifier"): TypedContractMethod<[], [string], "view">;
    getEvent(key: "NewTokenDistribution"): TypedContractEvent<NewTokenDistributionEvent.InputTuple, NewTokenDistributionEvent.OutputTuple, NewTokenDistributionEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "TokensClaimed"): TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
    filters: {
        "NewTokenDistribution(uint256)": TypedContractEvent<NewTokenDistributionEvent.InputTuple, NewTokenDistributionEvent.OutputTuple, NewTokenDistributionEvent.OutputObject>;
        NewTokenDistribution: TypedContractEvent<NewTokenDistributionEvent.InputTuple, NewTokenDistributionEvent.OutputTuple, NewTokenDistributionEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "TokensClaimed(address,uint192,bytes32)": TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
        TokensClaimed: TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
    };
}
