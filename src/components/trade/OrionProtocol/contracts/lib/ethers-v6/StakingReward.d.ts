import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace ITWBalance {
    type TWItemStruct = {
        timestamp: BigNumberish;
        amountTW: BigNumberish;
    };
    type TWItemStructOutput = [timestamp: bigint, amountTW: bigint] & {
        timestamp: bigint;
        amountTW: bigint;
    };
}
export interface StakingRewardInterface extends Interface {
    getFunction(nameOrSignature: "MAX_BOOSTED_REWARD" | "MAX_LOCK_MULTIPLIER" | "MAX_VEORN_MULTIPLIER" | "allStake" | "calcNewRate" | "claimReward" | "getBoost" | "getReward" | "getRewardCumulative" | "getRewardCumulativeAll" | "getRewardWithdraw" | "getStake" | "init" | "lockTimePeriod" | "lockTimeStart" | "parentSmart" | "poolStake" | "poolTimeStake" | "rateCumulative" | "rateTime" | "rewardRate" | "smartVote" | "stake" | "tokenStake" | "usedRewardForRate" | "veORN" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ClaimReward" | "ClaimReward2" | "Deposit" | "SetRewards" | "Stake" | "Unstake" | "Withdraw"): EventFragment;
    encodeFunctionData(functionFragment: "MAX_BOOSTED_REWARD", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_LOCK_MULTIPLIER", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_VEORN_MULTIPLIER", values?: undefined): string;
    encodeFunctionData(functionFragment: "allStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "calcNewRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "claimReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getBoost", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulative", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulativeAll", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRewardWithdraw", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "init", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockTimePeriod", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockTimeStart", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "parentSmart", values?: undefined): string;
    encodeFunctionData(functionFragment: "poolStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "poolTimeStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rateCumulative", values?: undefined): string;
    encodeFunctionData(functionFragment: "rateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "smartVote", values?: undefined): string;
    encodeFunctionData(functionFragment: "stake", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "tokenStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "usedRewardForRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "veORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "MAX_BOOSTED_REWARD", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_LOCK_MULTIPLIER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_VEORN_MULTIPLIER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcNewRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBoost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulativeAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardWithdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTimePeriod", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTimeStart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "parentSmart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolTimeStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartVote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usedRewardForRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}
export declare namespace ClaimRewardEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ClaimReward2Event {
    type InputTuple = [
        provider: AddressLike,
        value: BigNumberish,
        originValue: BigNumberish,
        ts: BigNumberish
    ];
    type OutputTuple = [
        provider: string,
        value: bigint,
        originValue: bigint,
        ts: bigint
    ];
    interface OutputObject {
        provider: string;
        value: bigint;
        originValue: bigint;
        ts: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace DepositEvent {
    type InputTuple = [
        provider: AddressLike,
        value: BigNumberish,
        lock_period: BigNumberish,
        ts: BigNumberish
    ];
    type OutputTuple = [
        provider: string,
        value: bigint,
        lock_period: bigint,
        ts: bigint
    ];
    interface OutputObject {
        provider: string;
        value: bigint;
        lock_period: bigint;
        ts: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace SetRewardsEvent {
    type InputTuple = [
        rewards: BigNumberish,
        duration: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        rewards: bigint,
        duration: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        rewards: bigint;
        duration: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace StakeEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UnstakeEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace WithdrawEvent {
    type InputTuple = [
        provider: AddressLike,
        value: BigNumberish,
        ts: BigNumberish
    ];
    type OutputTuple = [provider: string, value: bigint, ts: bigint];
    interface OutputObject {
        provider: string;
        value: bigint;
        ts: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface StakingReward extends BaseContract {
    connect(runner?: ContractRunner | null): StakingReward;
    waitForDeployment(): Promise<this>;
    interface: StakingRewardInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    MAX_BOOSTED_REWARD: TypedContractMethod<[], [bigint], "view">;
    MAX_LOCK_MULTIPLIER: TypedContractMethod<[], [bigint], "view">;
    MAX_VEORN_MULTIPLIER: TypedContractMethod<[], [bigint], "view">;
    allStake: TypedContractMethod<[], [bigint], "view">;
    calcNewRate: TypedContractMethod<[], [bigint], "view">;
    claimReward: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "nonpayable">;
    getBoost: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getReward: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getRewardCumulative: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getRewardCumulativeAll: TypedContractMethod<[], [bigint], "view">;
    getRewardWithdraw: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getStake: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    init: TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;
    lockTimePeriod: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    lockTimeStart: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    parentSmart: TypedContractMethod<[], [string], "view">;
    poolStake: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            stake: bigint;
            rateCumulative: bigint;
            reward: bigint;
            rewardWithdraw: bigint;
        }
    ], "view">;
    poolTimeStake: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            boolean,
            ITWBalance.TWItemStructOutput,
            ITWBalance.TWItemStructOutput
        ] & {
            lock_start: bigint;
            lock_period: bigint;
            staking: boolean;
            balanceTW: ITWBalance.TWItemStructOutput;
            totalTW: ITWBalance.TWItemStructOutput;
        }
    ], "view">;
    rateCumulative: TypedContractMethod<[], [bigint], "view">;
    rateTime: TypedContractMethod<[], [bigint], "view">;
    rewardRate: TypedContractMethod<[], [bigint], "view">;
    smartVote: TypedContractMethod<[], [string], "view">;
    stake: TypedContractMethod<[
        account: AddressLike,
        amount: BigNumberish,
        lock_period: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    tokenStake: TypedContractMethod<[], [string], "view">;
    usedRewardForRate: TypedContractMethod<[], [bigint], "view">;
    veORN: TypedContractMethod<[], [string], "view">;
    withdraw: TypedContractMethod<[
        account: AddressLike
    ], [
        [bigint, bigint] & {
            reward: bigint;
            amount: bigint;
        }
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "MAX_BOOSTED_REWARD"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_LOCK_MULTIPLIER"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_VEORN_MULTIPLIER"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "allStake"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "calcNewRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "claimReward"): TypedContractMethod<[account: AddressLike], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "getBoost"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulative"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulativeAll"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardWithdraw"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getStake"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "init"): TypedContractMethod<[_token: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "lockTimePeriod"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "lockTimeStart"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "parentSmart"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "poolStake"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            stake: bigint;
            rateCumulative: bigint;
            reward: bigint;
            rewardWithdraw: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "poolTimeStake"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            boolean,
            ITWBalance.TWItemStructOutput,
            ITWBalance.TWItemStructOutput
        ] & {
            lock_start: bigint;
            lock_period: bigint;
            staking: boolean;
            balanceTW: ITWBalance.TWItemStructOutput;
            totalTW: ITWBalance.TWItemStructOutput;
        }
    ], "view">;
    getFunction(nameOrSignature: "rateCumulative"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "smartVote"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "stake"): TypedContractMethod<[
        account: AddressLike,
        amount: BigNumberish,
        lock_period: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "tokenStake"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "usedRewardForRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "veORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[
        account: AddressLike
    ], [
        [bigint, bigint] & {
            reward: bigint;
            amount: bigint;
        }
    ], "nonpayable">;
    getEvent(key: "ClaimReward"): TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
    getEvent(key: "ClaimReward2"): TypedContractEvent<ClaimReward2Event.InputTuple, ClaimReward2Event.OutputTuple, ClaimReward2Event.OutputObject>;
    getEvent(key: "Deposit"): TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
    getEvent(key: "SetRewards"): TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
    getEvent(key: "Stake"): TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
    getEvent(key: "Unstake"): TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
    getEvent(key: "Withdraw"): TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
    filters: {
        "ClaimReward(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        ClaimReward: TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        "ClaimReward2(address,uint256,uint256,uint256)": TypedContractEvent<ClaimReward2Event.InputTuple, ClaimReward2Event.OutputTuple, ClaimReward2Event.OutputObject>;
        ClaimReward2: TypedContractEvent<ClaimReward2Event.InputTuple, ClaimReward2Event.OutputTuple, ClaimReward2Event.OutputObject>;
        "Deposit(address,uint256,uint256,uint256)": TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
        Deposit: TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
        "SetRewards(uint64,uint64,uint256,uint256,uint256)": TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        SetRewards: TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        "Stake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        Stake: TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        "Unstake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        Unstake: TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        "Withdraw(address,uint256,uint256)": TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
        Withdraw: TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
    };
}
