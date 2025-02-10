import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionVotingInterface extends Interface {
    getFunction(nameOrSignature: "cease" | "claimRewards" | "getPoolRewards" | "getRewardPerVotingToken" | "initialize" | "owner" | "pool_states_" | "renounceOwnership" | "reward_rate_" | "rewards_token_" | "setPoolState" | "setRewards" | "totalSupply" | "total_supply_" | "transferOwnership" | "user_votes_" | "vote" | "votes"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "cease", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "claimRewards", values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "getPoolRewards", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardPerVotingToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pool_states_", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "reward_rate_", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewards_token_", values?: undefined): string;
    encodeFunctionData(functionFragment: "setPoolState", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setRewards", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "total_supply_", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "user_votes_", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "vote", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "votes", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "cease", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPoolRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardPerVotingToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pool_states_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "reward_rate_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewards_token_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPoolState", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "total_supply_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "user_votes_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "votes", data: BytesLike): Result;
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
export interface OrionVoting extends BaseContract {
    connect(runner?: ContractRunner | null): OrionVoting;
    waitForDeployment(): Promise<this>;
    interface: OrionVotingInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    cease: TypedContractMethod<[
        poolAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    claimRewards: TypedContractMethod<[
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getPoolRewards: TypedContractMethod<[
        pool_address: AddressLike
    ], [
        bigint
    ], "view">;
    getRewardPerVotingToken: TypedContractMethod<[], [bigint], "view">;
    initialize: TypedContractMethod<[
        rewards_token: AddressLike,
        governance_contract_address: AddressLike
    ], [
        void
    ], "payable">;
    owner: TypedContractMethod<[], [string], "view">;
    pool_states_: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            state: bigint;
            votes: bigint;
            last_acc_reward_per_voting_token: bigint;
            acc_reward: bigint;
        }
    ], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    reward_rate_: TypedContractMethod<[], [bigint], "view">;
    rewards_token_: TypedContractMethod<[], [string], "view">;
    setPoolState: TypedContractMethod<[
        pool_address: AddressLike,
        new_state: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setRewards: TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    totalSupply: TypedContractMethod<[], [bigint], "view">;
    total_supply_: TypedContractMethod<[], [bigint], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    user_votes_: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    vote: TypedContractMethod<[
        poolAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    votes: TypedContractMethod<[pool_address: AddressLike], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "cease"): TypedContractMethod<[
        poolAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimRewards"): TypedContractMethod<[
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getPoolRewards"): TypedContractMethod<[pool_address: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardPerVotingToken"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        rewards_token: AddressLike,
        governance_contract_address: AddressLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pool_states_"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            state: bigint;
            votes: bigint;
            last_acc_reward_per_voting_token: bigint;
            acc_reward: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "reward_rate_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewards_token_"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setPoolState"): TypedContractMethod<[
        pool_address: AddressLike,
        new_state: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setRewards"): TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "total_supply_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "user_votes_"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "vote"): TypedContractMethod<[
        poolAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "votes"): TypedContractMethod<[pool_address: AddressLike], [bigint], "view">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
