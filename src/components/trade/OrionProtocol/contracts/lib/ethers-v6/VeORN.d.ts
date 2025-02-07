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
export interface VeORNInterface extends Interface {
    getFunction(nameOrSignature: "ALPHA7" | "ORN" | "START_TIME" | "allStake" | "amountAt" | "amountByTokenAt" | "balanceOf(address,uint256)" | "balanceOf(address)" | "balanceOf0" | "balanceOfAvg" | "balanceOfTW" | "balanceTokenOf" | "calcNewRate" | "claimReward" | "create_lock" | "create_lock_period" | "decimals" | "getK" | "getReward" | "getRewardCumulative" | "getRewardCumulativeAll" | "getRewardWithdraw" | "getStake" | "increase_amount" | "increase_unlock_period" | "increase_unlock_time" | "lockTime" | "name" | "poolStake" | "rateCumulative" | "rateTime" | "rewardRate" | "setRewards" | "setSmartVote" | "smartOwner" | "smartVote" | "symbol" | "tokenMap" | "totalSupply()" | "totalSupply(uint256)" | "totalSupply0" | "totalSupplyAvg" | "totalSupplyTW" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ClaimReward" | "Deposit" | "SetRewards" | "Stake" | "Unstake" | "UpdateDeposit" | "Withdraw"): EventFragment;
    encodeFunctionData(functionFragment: "ALPHA7", values?: undefined): string;
    encodeFunctionData(functionFragment: "ORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "START_TIME", values?: undefined): string;
    encodeFunctionData(functionFragment: "allStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "amountAt", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "amountByTokenAt", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf(address,uint256)", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf(address)", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "balanceOf0", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "balanceOfAvg", values: [AddressLike, ITWBalance.TWItemStruct]): string;
    encodeFunctionData(functionFragment: "balanceOfTW", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "balanceTokenOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "calcNewRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "claimReward", values?: undefined): string;
    encodeFunctionData(functionFragment: "create_lock", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "create_lock_period", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
    encodeFunctionData(functionFragment: "getK", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulative", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulativeAll", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRewardWithdraw", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "increase_amount", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "increase_unlock_period", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "increase_unlock_time", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "lockTime", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "poolStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rateCumulative", values?: undefined): string;
    encodeFunctionData(functionFragment: "rateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "setRewards", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setSmartVote", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "smartOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "smartVote", values?: undefined): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenMap", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "totalSupply()", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupply(uint256)", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "totalSupply0", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalSupplyAvg", values: [ITWBalance.TWItemStruct]): string;
    encodeFunctionData(functionFragment: "totalSupplyTW", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
    decodeFunctionResult(functionFragment: "ALPHA7", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "START_TIME", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "amountAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "amountByTokenAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf(address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf(address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf0", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOfAvg", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOfTW", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceTokenOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcNewRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "create_lock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "create_lock_period", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getK", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulativeAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardWithdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increase_amount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increase_unlock_period", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increase_unlock_time", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSmartVote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartVote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenMap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply()", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply(uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupply0", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupplyAvg", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupplyTW", data: BytesLike): Result;
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
export declare namespace DepositEvent {
    type InputTuple = [
        provider: AddressLike,
        value: BigNumberish,
        locktime: BigNumberish,
        mode: BigNumberish,
        ts: BigNumberish
    ];
    type OutputTuple = [
        provider: string,
        value: bigint,
        locktime: bigint,
        mode: bigint,
        ts: bigint
    ];
    interface OutputObject {
        provider: string;
        value: bigint;
        locktime: bigint;
        mode: bigint;
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
export declare namespace UpdateDepositEvent {
    type InputTuple = [
        provider: AddressLike,
        time_lock: BigNumberish,
        balance: BigNumberish,
        amount_token: BigNumberish,
        value: BigNumberish,
        totalSupplyT0: BigNumberish,
        ts: BigNumberish
    ];
    type OutputTuple = [
        provider: string,
        time_lock: bigint,
        balance: bigint,
        amount_token: bigint,
        value: bigint,
        totalSupplyT0: bigint,
        ts: bigint
    ];
    interface OutputObject {
        provider: string;
        time_lock: bigint;
        balance: bigint;
        amount_token: bigint;
        value: bigint;
        totalSupplyT0: bigint;
        ts: bigint;
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
export interface VeORN extends BaseContract {
    connect(runner?: ContractRunner | null): VeORN;
    waitForDeployment(): Promise<this>;
    interface: VeORNInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    ALPHA7: TypedContractMethod<[], [bigint], "view">;
    ORN: TypedContractMethod<[], [string], "view">;
    START_TIME: TypedContractMethod<[], [bigint], "view">;
    allStake: TypedContractMethod<[], [bigint], "view">;
    amountAt: TypedContractMethod<[
        amount: BigNumberish,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    amountByTokenAt: TypedContractMethod<[
        amount_token: BigNumberish,
        time_lock: BigNumberish
    ], [
        bigint
    ], "view">;
    "balanceOf(address,uint256)": TypedContractMethod<[
        account: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    "balanceOf(address)": TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    balanceOf0: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    balanceOfAvg: TypedContractMethod<[
        user: AddressLike,
        itemStart: ITWBalance.TWItemStruct
    ], [
        bigint
    ], "view">;
    balanceOfTW: TypedContractMethod<[
        user: AddressLike
    ], [
        ITWBalance.TWItemStructOutput
    ], "view">;
    balanceTokenOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    calcNewRate: TypedContractMethod<[], [bigint], "view">;
    claimReward: TypedContractMethod<[], [void], "nonpayable">;
    create_lock: TypedContractMethod<[
        _value: BigNumberish,
        unlock_time: BigNumberish
    ], [
        void
    ], "nonpayable">;
    create_lock_period: TypedContractMethod<[
        _value: BigNumberish,
        unlock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    decimals: TypedContractMethod<[], [bigint], "view">;
    getK: TypedContractMethod<[time: BigNumberish], [bigint], "view">;
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
    increase_amount: TypedContractMethod<[
        _value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    increase_unlock_period: TypedContractMethod<[
        unlock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    increase_unlock_time: TypedContractMethod<[
        unlock_time: BigNumberish
    ], [
        void
    ], "nonpayable">;
    lockTime: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    name: TypedContractMethod<[], [string], "view">;
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
    rateCumulative: TypedContractMethod<[], [bigint], "view">;
    rateTime: TypedContractMethod<[], [bigint], "view">;
    rewardRate: TypedContractMethod<[], [bigint], "view">;
    setRewards: TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setSmartVote: TypedContractMethod<[
        addrVote: AddressLike
    ], [
        void
    ], "nonpayable">;
    smartOwner: TypedContractMethod<[], [string], "view">;
    smartVote: TypedContractMethod<[], [string], "view">;
    symbol: TypedContractMethod<[], [string], "view">;
    tokenMap: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            time_lock: bigint;
            balance: bigint;
            amount_token: bigint;
        }
    ], "view">;
    "totalSupply()": TypedContractMethod<[], [bigint], "view">;
    "totalSupply(uint256)": TypedContractMethod<[
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    totalSupply0: TypedContractMethod<[], [bigint], "view">;
    totalSupplyAvg: TypedContractMethod<[
        itemStart: ITWBalance.TWItemStruct
    ], [
        bigint
    ], "view">;
    totalSupplyTW: TypedContractMethod<[
    ], [
        ITWBalance.TWItemStructOutput
    ], "view">;
    withdraw: TypedContractMethod<[], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "ALPHA7"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "ORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "START_TIME"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "allStake"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "amountAt"): TypedContractMethod<[
        amount: BigNumberish,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "amountByTokenAt"): TypedContractMethod<[
        amount_token: BigNumberish,
        time_lock: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "balanceOf(address,uint256)"): TypedContractMethod<[
        account: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "balanceOf(address)"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "balanceOf0"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "balanceOfAvg"): TypedContractMethod<[
        user: AddressLike,
        itemStart: ITWBalance.TWItemStruct
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "balanceOfTW"): TypedContractMethod<[
        user: AddressLike
    ], [
        ITWBalance.TWItemStructOutput
    ], "view">;
    getFunction(nameOrSignature: "balanceTokenOf"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "calcNewRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "claimReward"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "create_lock"): TypedContractMethod<[
        _value: BigNumberish,
        unlock_time: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "create_lock_period"): TypedContractMethod<[
        _value: BigNumberish,
        unlock_period: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "decimals"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getK"): TypedContractMethod<[time: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulative"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulativeAll"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardWithdraw"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getStake"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "increase_amount"): TypedContractMethod<[_value: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "increase_unlock_period"): TypedContractMethod<[unlock_period: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "increase_unlock_time"): TypedContractMethod<[unlock_time: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "lockTime"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "name"): TypedContractMethod<[], [string], "view">;
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
    getFunction(nameOrSignature: "rateCumulative"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "setRewards"): TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setSmartVote"): TypedContractMethod<[addrVote: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "smartOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "smartVote"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "symbol"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "tokenMap"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            time_lock: bigint;
            balance: bigint;
            amount_token: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "totalSupply()"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "totalSupply(uint256)"): TypedContractMethod<[time: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "totalSupply0"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "totalSupplyAvg"): TypedContractMethod<[
        itemStart: ITWBalance.TWItemStruct
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "totalSupplyTW"): TypedContractMethod<[], [ITWBalance.TWItemStructOutput], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[], [void], "nonpayable">;
    getEvent(key: "ClaimReward"): TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
    getEvent(key: "Deposit"): TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
    getEvent(key: "SetRewards"): TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
    getEvent(key: "Stake"): TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
    getEvent(key: "Unstake"): TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
    getEvent(key: "UpdateDeposit"): TypedContractEvent<UpdateDepositEvent.InputTuple, UpdateDepositEvent.OutputTuple, UpdateDepositEvent.OutputObject>;
    getEvent(key: "Withdraw"): TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
    filters: {
        "ClaimReward(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        ClaimReward: TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        "Deposit(address,uint256,uint256,int128,uint256)": TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
        Deposit: TypedContractEvent<DepositEvent.InputTuple, DepositEvent.OutputTuple, DepositEvent.OutputObject>;
        "SetRewards(uint64,uint64,uint256,uint256,uint256)": TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        SetRewards: TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        "Stake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        Stake: TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        "Unstake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        Unstake: TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        "UpdateDeposit(address,uint48,uint128,uint128,uint256,uint256,uint256)": TypedContractEvent<UpdateDepositEvent.InputTuple, UpdateDepositEvent.OutputTuple, UpdateDepositEvent.OutputObject>;
        UpdateDeposit: TypedContractEvent<UpdateDepositEvent.InputTuple, UpdateDepositEvent.OutputTuple, UpdateDepositEvent.OutputObject>;
        "Withdraw(address,uint256,uint256)": TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
        Withdraw: TypedContractEvent<WithdrawEvent.InputTuple, WithdrawEvent.OutputTuple, WithdrawEvent.OutputObject>;
    };
}
