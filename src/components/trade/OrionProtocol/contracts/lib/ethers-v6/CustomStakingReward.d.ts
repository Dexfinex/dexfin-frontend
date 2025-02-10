import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface CustomStakingRewardInterface extends Interface {
    getFunction(nameOrSignature: "_balances" | "balanceOf" | "earned" | "emergencyAssetWithdrawal" | "exit" | "getReward" | "initialize" | "lastTimeRewardApplicable" | "lastUpdateTime" | "notifyRewardAmount" | "owner" | "periodFinish" | "renounceOwnership" | "rewardPerToken" | "rewardPerTokenStored" | "rewardRate" | "rewards" | "rewardsDuration" | "rewardsToken" | "stake" | "stakeTo" | "stakeWithPermit" | "stakingToken" | "totalSupply" | "transferOwnership" | "userRewardPerTokenPaid" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred" | "RewardAdded" | "RewardPaid" | "Staked" | "Withdrawn"): EventFragment;
    encodeFunctionData(functionFragment: "_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "earned", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "exit", values?: undefined): string;
    encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "lastTimeRewardApplicable", values?: undefined): string;
    encodeFunctionData(functionFragment: "lastUpdateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "notifyRewardAmount", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "periodFinish", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerTokenStored", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewards", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rewardsDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardsToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "stakeTo", values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "stakeWithPermit", values: [BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "stakingToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "userRewardPerTokenPaid", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastTimeRewardApplicable", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastUpdateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "notifyRewardAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "periodFinish", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerTokenStored", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeWithPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakingToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userRewardPerTokenPaid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
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
export declare namespace RewardAddedEvent {
    type InputTuple = [reward: BigNumberish];
    type OutputTuple = [reward: bigint];
    interface OutputObject {
        reward: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RewardPaidEvent {
    type InputTuple = [user: AddressLike, reward: BigNumberish];
    type OutputTuple = [user: string, reward: bigint];
    interface OutputObject {
        user: string;
        reward: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace StakedEvent {
    type InputTuple = [user: AddressLike, amount: BigNumberish];
    type OutputTuple = [user: string, amount: bigint];
    interface OutputObject {
        user: string;
        amount: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace WithdrawnEvent {
    type InputTuple = [user: AddressLike, amount: BigNumberish];
    type OutputTuple = [user: string, amount: bigint];
    interface OutputObject {
        user: string;
        amount: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface CustomStakingReward extends BaseContract {
    connect(runner?: ContractRunner | null): CustomStakingReward;
    waitForDeployment(): Promise<this>;
    interface: CustomStakingRewardInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    _balances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    earned: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    emergencyAssetWithdrawal: TypedContractMethod<[
        asset: AddressLike
    ], [
        void
    ], "nonpayable">;
    exit: TypedContractMethod<[], [void], "nonpayable">;
    getReward: TypedContractMethod<[], [void], "nonpayable">;
    initialize: TypedContractMethod<[
        _stakingToken: AddressLike,
        _rewardsToken: AddressLike,
        _owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    lastTimeRewardApplicable: TypedContractMethod<[], [bigint], "view">;
    lastUpdateTime: TypedContractMethod<[], [bigint], "view">;
    notifyRewardAmount: TypedContractMethod<[
        _reward: BigNumberish,
        _rewardsDuration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    periodFinish: TypedContractMethod<[], [bigint], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    rewardPerToken: TypedContractMethod<[], [bigint], "view">;
    rewardPerTokenStored: TypedContractMethod<[], [bigint], "view">;
    rewardRate: TypedContractMethod<[], [bigint], "view">;
    rewards: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    rewardsDuration: TypedContractMethod<[], [bigint], "view">;
    rewardsToken: TypedContractMethod<[], [string], "view">;
    stake: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    stakeTo: TypedContractMethod<[
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    stakeWithPermit: TypedContractMethod<[
        amount: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "nonpayable">;
    stakingToken: TypedContractMethod<[], [string], "view">;
    totalSupply: TypedContractMethod<[], [bigint], "view">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    userRewardPerTokenPaid: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    withdraw: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "_balances"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "earned"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "emergencyAssetWithdrawal"): TypedContractMethod<[asset: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "exit"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        _stakingToken: AddressLike,
        _rewardsToken: AddressLike,
        _owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lastTimeRewardApplicable"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lastUpdateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "notifyRewardAmount"): TypedContractMethod<[
        _reward: BigNumberish,
        _rewardsDuration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "periodFinish"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "rewardPerToken"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardPerTokenStored"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewards"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsDuration"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "stake"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "stakeTo"): TypedContractMethod<[
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stakeWithPermit"): TypedContractMethod<[
        amount: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stakingToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "totalSupply"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "userRewardPerTokenPaid"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "RewardAdded"): TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
    getEvent(key: "RewardPaid"): TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
    getEvent(key: "Staked"): TypedContractEvent<StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
    getEvent(key: "Withdrawn"): TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
    filters: {
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "RewardAdded(uint256)": TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
        RewardAdded: TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
        "RewardPaid(address,uint256)": TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
        RewardPaid: TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
        "Staked(address,uint256)": TypedContractEvent<StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
        Staked: TypedContractEvent<StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
        "Withdrawn(address,uint256)": TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
        Withdrawn: TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
    };
}
