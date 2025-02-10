import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace OrionGovernance {
    type UserVaultStruct = {
        amount: BigNumberish;
        created_time: BigNumberish;
    };
    type UserVaultStructOutput = [amount: bigint, created_time: bigint] & {
        amount: bigint;
        created_time: bigint;
    };
}
export interface OrionGovernanceInterface extends Interface {
    getFunction(nameOrSignature: "acceptLock" | "acceptNewLockAmount" | "acceptUnlock" | "balances_" | "basic_fee_percent" | "burn" | "burn_vote_end_" | "earned" | "emergencyAssetWithdrawal" | "exit" | "extra_fee_percent" | "extra_fee_seconds" | "fee_total" | "getAvailableWithdrawBalance" | "getBalance" | "getLockedBalance" | "getReward" | "getRewardForDuration" | "getTotalBalance" | "getTotalLockedBalance" | "getVaults" | "initialize" | "lastTimeRewardApplicable" | "lastUpdateTime" | "notifyRewardAmount" | "owner" | "periodFinish" | "renounceOwnership" | "rewardPerToken" | "rewardPerTokenStored" | "rewardRate" | "rewards" | "rewardsDuration" | "setBurnVoteEnd" | "setVaultParameters" | "setVotingContractAddress" | "stake" | "staking_token_" | "total_balance_" | "total_votes_burn_" | "total_votes_dont_burn_" | "transferOwnership" | "userRewardPerTokenPaid" | "user_burn_votes_" | "vaultWithdraw" | "vaults_" | "voteBurn" | "voteBurnAvailable" | "voting_contract_address_" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred" | "RewardAdded" | "RewardPaid" | "Staked" | "Withdrawn"): EventFragment;
    encodeFunctionData(functionFragment: "acceptLock", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "acceptNewLockAmount", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "acceptUnlock", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balances_", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "basic_fee_percent", values?: undefined): string;
    encodeFunctionData(functionFragment: "burn", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "burn_vote_end_", values?: undefined): string;
    encodeFunctionData(functionFragment: "earned", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "exit", values?: undefined): string;
    encodeFunctionData(functionFragment: "extra_fee_percent", values?: undefined): string;
    encodeFunctionData(functionFragment: "extra_fee_seconds", values?: undefined): string;
    encodeFunctionData(functionFragment: "fee_total", values?: undefined): string;
    encodeFunctionData(functionFragment: "getAvailableWithdrawBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getLockedBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRewardForDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "getTotalBalance", values?: undefined): string;
    encodeFunctionData(functionFragment: "getTotalLockedBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getVaults", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike]): string;
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
    encodeFunctionData(functionFragment: "setBurnVoteEnd", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setVaultParameters", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setVotingContractAddress", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "staking_token_", values?: undefined): string;
    encodeFunctionData(functionFragment: "total_balance_", values?: undefined): string;
    encodeFunctionData(functionFragment: "total_votes_burn_", values?: undefined): string;
    encodeFunctionData(functionFragment: "total_votes_dont_burn_", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "userRewardPerTokenPaid", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "user_burn_votes_", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "vaultWithdraw", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "vaults_", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "voteBurn", values: [BigNumberish, boolean]): string;
    encodeFunctionData(functionFragment: "voteBurnAvailable", values?: undefined): string;
    encodeFunctionData(functionFragment: "voting_contract_address_", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "acceptLock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptNewLockAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptUnlock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balances_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "basic_fee_percent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn_vote_end_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "extra_fee_percent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "extra_fee_seconds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fee_total", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAvailableWithdrawBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLockedBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardForDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTotalBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTotalLockedBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVaults", data: BytesLike): Result;
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
    decodeFunctionResult(functionFragment: "setBurnVoteEnd", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setVaultParameters", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setVotingContractAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "staking_token_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "total_balance_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "total_votes_burn_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "total_votes_dont_burn_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userRewardPerTokenPaid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "user_burn_votes_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vaultWithdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vaults_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voteBurn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voteBurnAvailable", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voting_contract_address_", data: BytesLike): Result;
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
export interface OrionGovernance extends BaseContract {
    connect(runner?: ContractRunner | null): OrionGovernance;
    waitForDeployment(): Promise<this>;
    interface: OrionGovernanceInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    acceptLock: TypedContractMethod<[
        user: AddressLike,
        lock_increase_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    acceptNewLockAmount: TypedContractMethod<[
        user: AddressLike,
        new_lock_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    acceptUnlock: TypedContractMethod<[
        user: AddressLike,
        lock_decrease_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    balances_: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [bigint, bigint] & {
            balance: bigint;
            locked_balance: bigint;
        }
    ], "view">;
    basic_fee_percent: TypedContractMethod<[], [bigint], "view">;
    burn: TypedContractMethod<[burn_size: BigNumberish], [void], "nonpayable">;
    burn_vote_end_: TypedContractMethod<[], [bigint], "view">;
    earned: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    emergencyAssetWithdrawal: TypedContractMethod<[
        asset: AddressLike
    ], [
        void
    ], "nonpayable">;
    exit: TypedContractMethod<[], [void], "nonpayable">;
    extra_fee_percent: TypedContractMethod<[], [bigint], "view">;
    extra_fee_seconds: TypedContractMethod<[], [bigint], "view">;
    fee_total: TypedContractMethod<[], [bigint], "view">;
    getAvailableWithdrawBalance: TypedContractMethod<[
        user: AddressLike
    ], [
        bigint
    ], "view">;
    getBalance: TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getLockedBalance: TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getReward: TypedContractMethod<[], [void], "nonpayable">;
    getRewardForDuration: TypedContractMethod<[], [bigint], "view">;
    getTotalBalance: TypedContractMethod<[], [bigint], "view">;
    getTotalLockedBalance: TypedContractMethod<[
        user: AddressLike
    ], [
        bigint
    ], "view">;
    getVaults: TypedContractMethod<[
        wallet: AddressLike
    ], [
        OrionGovernance.UserVaultStructOutput[]
    ], "view">;
    initialize: TypedContractMethod<[
        staking_token: AddressLike
    ], [
        void
    ], "nonpayable">;
    lastTimeRewardApplicable: TypedContractMethod<[], [bigint], "view">;
    lastUpdateTime: TypedContractMethod<[], [bigint], "view">;
    notifyRewardAmount: TypedContractMethod<[
        reward: BigNumberish,
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
    setBurnVoteEnd: TypedContractMethod<[
        burn_vote_end: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setVaultParameters: TypedContractMethod<[
        extra_fee_percent_: BigNumberish,
        extra_fee_seconds_: BigNumberish,
        basic_fee_percent_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setVotingContractAddress: TypedContractMethod<[
        voting_contract_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    stake: TypedContractMethod<[
        adding_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    staking_token_: TypedContractMethod<[], [string], "view">;
    total_balance_: TypedContractMethod<[], [bigint], "view">;
    total_votes_burn_: TypedContractMethod<[], [bigint], "view">;
    total_votes_dont_burn_: TypedContractMethod<[], [bigint], "view">;
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
    user_burn_votes_: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    vaultWithdraw: TypedContractMethod<[
        index: BigNumberish
    ], [
        void
    ], "nonpayable">;
    vaults_: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            amount: bigint;
            created_time: bigint;
        }
    ], "view">;
    voteBurn: TypedContractMethod<[
        voting_amount: BigNumberish,
        vote_for_burn: boolean
    ], [
        void
    ], "nonpayable">;
    voteBurnAvailable: TypedContractMethod<[], [boolean], "view">;
    voting_contract_address_: TypedContractMethod<[], [string], "view">;
    withdraw: TypedContractMethod<[
        removing_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "acceptLock"): TypedContractMethod<[
        user: AddressLike,
        lock_increase_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "acceptNewLockAmount"): TypedContractMethod<[
        user: AddressLike,
        new_lock_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "acceptUnlock"): TypedContractMethod<[
        user: AddressLike,
        lock_decrease_amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "balances_"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [bigint, bigint] & {
            balance: bigint;
            locked_balance: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "basic_fee_percent"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "burn"): TypedContractMethod<[burn_size: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "burn_vote_end_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "earned"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "emergencyAssetWithdrawal"): TypedContractMethod<[asset: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "exit"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "extra_fee_percent"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "extra_fee_seconds"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "fee_total"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getAvailableWithdrawBalance"): TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getBalance"): TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getLockedBalance"): TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "getRewardForDuration"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getTotalBalance"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getTotalLockedBalance"): TypedContractMethod<[user: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getVaults"): TypedContractMethod<[
        wallet: AddressLike
    ], [
        OrionGovernance.UserVaultStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[staking_token: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "lastTimeRewardApplicable"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lastUpdateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "notifyRewardAmount"): TypedContractMethod<[
        reward: BigNumberish,
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
    getFunction(nameOrSignature: "setBurnVoteEnd"): TypedContractMethod<[burn_vote_end: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setVaultParameters"): TypedContractMethod<[
        extra_fee_percent_: BigNumberish,
        extra_fee_seconds_: BigNumberish,
        basic_fee_percent_: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setVotingContractAddress"): TypedContractMethod<[
        voting_contract_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stake"): TypedContractMethod<[adding_amount: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "staking_token_"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "total_balance_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "total_votes_burn_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "total_votes_dont_burn_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "userRewardPerTokenPaid"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "user_burn_votes_"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "vaultWithdraw"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "vaults_"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            amount: bigint;
            created_time: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "voteBurn"): TypedContractMethod<[
        voting_amount: BigNumberish,
        vote_for_burn: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "voteBurnAvailable"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "voting_contract_address_"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[removing_amount: BigNumberish], [void], "nonpayable">;
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
