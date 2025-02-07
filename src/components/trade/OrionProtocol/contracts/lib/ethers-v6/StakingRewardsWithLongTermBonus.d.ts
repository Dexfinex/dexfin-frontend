import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface StakingRewardsWithLongTermBonusInterface extends Interface {
    getFunction(nameOrSignature: "balanceOf" | "earned" | "emergencyAssetWithdrawal" | "exit" | "findLastBalanceInPeriod" | "getReward" | "getRewardForDuration" | "initialize" | "lastTimeRewardApplicable" | "lastUpdateTime" | "notifyRewardAmount" | "periodFinish" | "rewardPerToken" | "rewardPerTokenStored" | "rewardRate" | "rewards" | "rewardsDistribution" | "rewardsDuration" | "rewardsToken" | "stake" | "stakeWithPermit" | "stakingToken" | "totalSupply" | "userRewardPerTokenPaid" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "RewardAdded" | "RewardPaid" | "Staked" | "Withdrawn"): EventFragment;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "earned", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "exit", values?: undefined): string;
    encodeFunctionData(functionFragment: "findLastBalanceInPeriod", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRewardForDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "lastTimeRewardApplicable", values?: undefined): string;
    encodeFunctionData(functionFragment: "lastUpdateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "notifyRewardAmount", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "periodFinish", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerTokenStored", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewards", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rewardsDistribution", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardsDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardsToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "stakeWithPermit", values: [BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "stakingToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "userRewardPerTokenPaid", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "findLastBalanceInPeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardForDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastTimeRewardApplicable", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastUpdateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "notifyRewardAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "periodFinish", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerTokenStored", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsDistribution", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeWithPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakingToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userRewardPerTokenPaid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
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
export interface StakingRewardsWithLongTermBonus extends BaseContract {
    connect(runner?: ContractRunner | null): StakingRewardsWithLongTermBonus;
    waitForDeployment(): Promise<this>;
    interface: StakingRewardsWithLongTermBonusInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    earned: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    emergencyAssetWithdrawal: TypedContractMethod<[
        asset: AddressLike
    ], [
        void
    ], "nonpayable">;
    exit: TypedContractMethod<[], [void], "nonpayable">;
    findLastBalanceInPeriod: TypedContractMethod<[
        account: AddressLike,
        period: BigNumberish
    ], [
        bigint
    ], "view">;
    getReward: TypedContractMethod<[], [void], "nonpayable">;
    getRewardForDuration: TypedContractMethod<[], [bigint], "view">;
    initialize: TypedContractMethod<[
        _rewardsDistribution: AddressLike,
        _rewardsToken: AddressLike,
        _stakingToken: AddressLike
    ], [
        void
    ], "payable">;
    lastTimeRewardApplicable: TypedContractMethod<[], [bigint], "view">;
    lastUpdateTime: TypedContractMethod<[], [bigint], "view">;
    notifyRewardAmount: TypedContractMethod<[
        reward: BigNumberish,
        _rewardsDuration: BigNumberish,
        longTermBonus: BigNumberish
    ], [
        void
    ], "nonpayable">;
    periodFinish: TypedContractMethod<[], [bigint], "view">;
    rewardPerToken: TypedContractMethod<[], [bigint], "view">;
    rewardPerTokenStored: TypedContractMethod<[], [bigint], "view">;
    rewardRate: TypedContractMethod<[], [bigint], "view">;
    rewards: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    rewardsDistribution: TypedContractMethod<[], [string], "view">;
    rewardsDuration: TypedContractMethod<[], [bigint], "view">;
    rewardsToken: TypedContractMethod<[], [string], "view">;
    stake: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
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
    userRewardPerTokenPaid: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    withdraw: TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "earned"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "emergencyAssetWithdrawal"): TypedContractMethod<[asset: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "exit"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "findLastBalanceInPeriod"): TypedContractMethod<[
        account: AddressLike,
        period: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "getRewardForDuration"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[
        _rewardsDistribution: AddressLike,
        _rewardsToken: AddressLike,
        _stakingToken: AddressLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "lastTimeRewardApplicable"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lastUpdateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "notifyRewardAmount"): TypedContractMethod<[
        reward: BigNumberish,
        _rewardsDuration: BigNumberish,
        longTermBonus: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "periodFinish"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardPerToken"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardPerTokenStored"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewards"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsDistribution"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "rewardsDuration"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "stake"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
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
    getFunction(nameOrSignature: "userRewardPerTokenPaid"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getEvent(key: "RewardAdded"): TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
    getEvent(key: "RewardPaid"): TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
    getEvent(key: "Staked"): TypedContractEvent<StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
    getEvent(key: "Withdrawn"): TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
    filters: {
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
