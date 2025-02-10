import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionStakingRewardInterface extends Interface {
    getFunction(nameOrSignature: "_balances" | "balanceOf" | "earned" | "emergencyAssetWithdrawal" | "exit" | "getReward" | "initialize" | "owner" | "renounceOwnership" | "rewardPerToken" | "rewardPerTokenStored" | "rewards" | "stake" | "stakeTo" | "stakeWithPermit" | "stakingToken" | "totalSupply" | "transferOwnership" | "userRewardPerTokenPaid" | "voting_contract_" | "voting_pool_accumulator_stored_" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred" | "RewardAdded" | "RewardPaid" | "Staked" | "TestEarnedCalc" | "TestRewardPerToken" | "TestUpdateReward" | "TestUpdateRewardUser" | "Withdrawn"): EventFragment;
    encodeFunctionData(functionFragment: "_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "earned", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "exit", values?: undefined): string;
    encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardPerTokenStored", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewards", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "stakeTo", values: [BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "stakeWithPermit", values: [BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "stakingToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "userRewardPerTokenPaid", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "voting_contract_", values?: undefined): string;
    encodeFunctionData(functionFragment: "voting_pool_accumulator_stored_", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "exit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardPerTokenStored", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeWithPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakingToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userRewardPerTokenPaid", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voting_contract_", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voting_pool_accumulator_stored_", data: BytesLike): Result;
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
export declare namespace TestEarnedCalcEvent {
    type InputTuple = [
        balances_account: BigNumberish,
        rewardPerToken: BigNumberish,
        userRewardPerTokenPaid_account: BigNumberish,
        rewards_account: BigNumberish,
        voting_contract_getPoolRewards: BigNumberish
    ];
    type OutputTuple = [
        balances_account: bigint,
        rewardPerToken: bigint,
        userRewardPerTokenPaid_account: bigint,
        rewards_account: bigint,
        voting_contract_getPoolRewards: bigint
    ];
    interface OutputObject {
        balances_account: bigint;
        rewardPerToken: bigint;
        userRewardPerTokenPaid_account: bigint;
        rewards_account: bigint;
        voting_contract_getPoolRewards: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TestRewardPerTokenEvent {
    type InputTuple = [_rewardPerToken: BigNumberish];
    type OutputTuple = [_rewardPerToken: bigint];
    interface OutputObject {
        _rewardPerToken: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TestUpdateRewardEvent {
    type InputTuple = [
        _rewardPerTokenStored: BigNumberish,
        _voting_pool_accumulator_stored: BigNumberish
    ];
    type OutputTuple = [
        _rewardPerTokenStored: bigint,
        _voting_pool_accumulator_stored: bigint
    ];
    interface OutputObject {
        _rewardPerTokenStored: bigint;
        _voting_pool_accumulator_stored: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TestUpdateRewardUserEvent {
    type InputTuple = [
        rewards: BigNumberish,
        userRewardPerTokenPaid: BigNumberish
    ];
    type OutputTuple = [rewards: bigint, userRewardPerTokenPaid: bigint];
    interface OutputObject {
        rewards: bigint;
        userRewardPerTokenPaid: bigint;
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
export interface OrionStakingReward extends BaseContract {
    connect(runner?: ContractRunner | null): OrionStakingReward;
    waitForDeployment(): Promise<this>;
    interface: OrionStakingRewardInterface;
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
        voting_contract_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    rewardPerToken: TypedContractMethod<[], [bigint], "view">;
    rewardPerTokenStored: TypedContractMethod<[], [bigint], "view">;
    rewards: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
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
    voting_contract_: TypedContractMethod<[], [string], "view">;
    voting_pool_accumulator_stored_: TypedContractMethod<[], [bigint], "view">;
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
        voting_contract_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "rewardPerToken"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardPerTokenStored"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewards"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
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
    getFunction(nameOrSignature: "voting_contract_"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "voting_pool_accumulator_stored_"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "RewardAdded"): TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
    getEvent(key: "RewardPaid"): TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
    getEvent(key: "Staked"): TypedContractEvent<StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
    getEvent(key: "TestEarnedCalc"): TypedContractEvent<TestEarnedCalcEvent.InputTuple, TestEarnedCalcEvent.OutputTuple, TestEarnedCalcEvent.OutputObject>;
    getEvent(key: "TestRewardPerToken"): TypedContractEvent<TestRewardPerTokenEvent.InputTuple, TestRewardPerTokenEvent.OutputTuple, TestRewardPerTokenEvent.OutputObject>;
    getEvent(key: "TestUpdateReward"): TypedContractEvent<TestUpdateRewardEvent.InputTuple, TestUpdateRewardEvent.OutputTuple, TestUpdateRewardEvent.OutputObject>;
    getEvent(key: "TestUpdateRewardUser"): TypedContractEvent<TestUpdateRewardUserEvent.InputTuple, TestUpdateRewardUserEvent.OutputTuple, TestUpdateRewardUserEvent.OutputObject>;
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
        "TestEarnedCalc(uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<TestEarnedCalcEvent.InputTuple, TestEarnedCalcEvent.OutputTuple, TestEarnedCalcEvent.OutputObject>;
        TestEarnedCalc: TypedContractEvent<TestEarnedCalcEvent.InputTuple, TestEarnedCalcEvent.OutputTuple, TestEarnedCalcEvent.OutputObject>;
        "TestRewardPerToken(uint256)": TypedContractEvent<TestRewardPerTokenEvent.InputTuple, TestRewardPerTokenEvent.OutputTuple, TestRewardPerTokenEvent.OutputObject>;
        TestRewardPerToken: TypedContractEvent<TestRewardPerTokenEvent.InputTuple, TestRewardPerTokenEvent.OutputTuple, TestRewardPerTokenEvent.OutputObject>;
        "TestUpdateReward(uint256,uint256)": TypedContractEvent<TestUpdateRewardEvent.InputTuple, TestUpdateRewardEvent.OutputTuple, TestUpdateRewardEvent.OutputObject>;
        TestUpdateReward: TypedContractEvent<TestUpdateRewardEvent.InputTuple, TestUpdateRewardEvent.OutputTuple, TestUpdateRewardEvent.OutputObject>;
        "TestUpdateRewardUser(uint256,uint256)": TypedContractEvent<TestUpdateRewardUserEvent.InputTuple, TestUpdateRewardUserEvent.OutputTuple, TestUpdateRewardUserEvent.OutputObject>;
        TestUpdateRewardUser: TypedContractEvent<TestUpdateRewardUserEvent.InputTuple, TestUpdateRewardUserEvent.OutputTuple, TestUpdateRewardUserEvent.OutputObject>;
        "Withdrawn(address,uint256)": TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
        Withdrawn: TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;
    };
}
