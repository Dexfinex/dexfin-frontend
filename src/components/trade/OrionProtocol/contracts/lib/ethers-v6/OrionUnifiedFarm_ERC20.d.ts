import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace OrionUnifiedFarm_ERC20 {
    type LockedStakeStruct = {
        kek_id: BytesLike;
        start_timestamp: BigNumberish;
        liquidity: BigNumberish;
        ending_timestamp: BigNumberish;
        lock_multiplier: BigNumberish;
    };
    type LockedStakeStructOutput = [
        kek_id: string,
        start_timestamp: bigint,
        liquidity: bigint,
        ending_timestamp: bigint,
        lock_multiplier: bigint
    ] & {
        kek_id: string;
        start_timestamp: bigint;
        liquidity: bigint;
        ending_timestamp: bigint;
        lock_multiplier: bigint;
    };
}
export interface OrionUnifiedFarm_ERC20Interface extends Interface {
    getFunction(nameOrSignature: "acceptOwnership" | "calcCurCombinedWeight" | "calcCurrLockMultiplier" | "changeTokenManager" | "combinedWeightOf" | "earned" | "fraxPerLPStored" | "getAllRewardTokens" | "getProxyFor" | "getReward" | "getReward2" | "getRewardExtraLogic" | "getRewardForDuration" | "isTokenManagerFor" | "lastRewardClaimTime" | "lastUpdateTime" | "lockAdditional" | "lockLonger" | "lockMultiplier" | "lock_max_multiplier" | "lock_time_for_max_multiplier" | "lock_time_min" | "lockedLiquidityOf" | "lockedStakes" | "lockedStakesOf" | "lockedStakesOfLength" | "minVeORNForMaxBoost" | "nominateNewOwner" | "nominatedOwner" | "owner" | "periodFinish" | "proxyToggleStaker" | "proxy_lp_balances" | "recoverERC20" | "rewardManagers" | "rewardRates" | "rewardTokenAddrToIdx" | "rewardsDuration" | "rewardsPerToken" | "setMiscVariables" | "setPauses" | "setRewardVars" | "stakeLocked" | "stakerSetVeORNProxy" | "staker_designated_proxies" | "stakesUnlocked" | "stakingToken" | "sync" | "sync_gauge_weights" | "toggleValidVeORNProxy" | "totalCombinedWeight" | "totalLiquidityLocked" | "unlockStakes" | "updateRewardAndBalance" | "veORN" | "veORNMultiplier" | "veorn_boost_scale_factor" | "veorn_max_multiplier" | "withdrawLocked"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "LockedAdditional" | "LockedLonger" | "OwnerChanged" | "OwnerNominated" | "RewardPaid" | "StakeLocked" | "WithdrawLocked"): EventFragment;
    encodeFunctionData(functionFragment: "acceptOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "calcCurCombinedWeight", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "calcCurrLockMultiplier", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeTokenManager", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "combinedWeightOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "earned", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "fraxPerLPStored", values?: undefined): string;
    encodeFunctionData(functionFragment: "getAllRewardTokens", values?: undefined): string;
    encodeFunctionData(functionFragment: "getProxyFor", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward2", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "getRewardExtraLogic", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardForDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "isTokenManagerFor", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "lastRewardClaimTime", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lastUpdateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockAdditional", values: [BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lockLonger", values: [BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lockMultiplier", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "lock_max_multiplier", values?: undefined): string;
    encodeFunctionData(functionFragment: "lock_time_for_max_multiplier", values?: undefined): string;
    encodeFunctionData(functionFragment: "lock_time_min", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockedLiquidityOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockedStakes", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "lockedStakesOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "lockedStakesOfLength", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "minVeORNForMaxBoost", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "nominateNewOwner", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "nominatedOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "periodFinish", values?: undefined): string;
    encodeFunctionData(functionFragment: "proxyToggleStaker", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "proxy_lp_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "recoverERC20", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "rewardManagers", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rewardRates", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "rewardTokenAddrToIdx", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rewardsDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardsPerToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMiscVariables", values: [
        [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ]): string;
    encodeFunctionData(functionFragment: "setPauses", values: [boolean, boolean, boolean]): string;
    encodeFunctionData(functionFragment: "setRewardVars", values: [AddressLike, BigNumberish, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "stakeLocked", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "stakerSetVeORNProxy", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "staker_designated_proxies", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "stakesUnlocked", values?: undefined): string;
    encodeFunctionData(functionFragment: "stakingToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "sync", values?: undefined): string;
    encodeFunctionData(functionFragment: "sync_gauge_weights", values: [boolean]): string;
    encodeFunctionData(functionFragment: "toggleValidVeORNProxy", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "totalCombinedWeight", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalLiquidityLocked", values?: undefined): string;
    encodeFunctionData(functionFragment: "unlockStakes", values?: undefined): string;
    encodeFunctionData(functionFragment: "updateRewardAndBalance", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "veORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "veORNMultiplier", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "veorn_boost_scale_factor", values?: undefined): string;
    encodeFunctionData(functionFragment: "veorn_max_multiplier", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawLocked", values: [BytesLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "acceptOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcCurCombinedWeight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcCurrLockMultiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeTokenManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "combinedWeightOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "earned", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fraxPerLPStored", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getAllRewardTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProxyFor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardExtraLogic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardForDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isTokenManagerFor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastRewardClaimTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastUpdateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockAdditional", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockLonger", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockMultiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock_max_multiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock_time_for_max_multiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock_time_min", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedLiquidityOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedStakes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedStakesOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockedStakesOfLength", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minVeORNForMaxBoost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nominateNewOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nominatedOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "periodFinish", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxyToggleStaker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxy_lp_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "recoverERC20", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardManagers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardTokenAddrToIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardsPerToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMiscVariables", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPauses", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRewardVars", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeLocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakerSetVeORNProxy", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "staker_designated_proxies", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakesUnlocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakingToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sync", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sync_gauge_weights", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "toggleValidVeORNProxy", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalCombinedWeight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalLiquidityLocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlockStakes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateRewardAndBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veORNMultiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veorn_boost_scale_factor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veorn_max_multiplier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawLocked", data: BytesLike): Result;
}
export declare namespace LockedAdditionalEvent {
    type InputTuple = [
        user: AddressLike,
        kek_id: BytesLike,
        amount: BigNumberish
    ];
    type OutputTuple = [user: string, kek_id: string, amount: bigint];
    interface OutputObject {
        user: string;
        kek_id: string;
        amount: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace LockedLongerEvent {
    type InputTuple = [
        user: AddressLike,
        kek_id: BytesLike,
        new_secs: BigNumberish,
        new_start_ts: BigNumberish,
        new_end_ts: BigNumberish
    ];
    type OutputTuple = [
        user: string,
        kek_id: string,
        new_secs: bigint,
        new_start_ts: bigint,
        new_end_ts: bigint
    ];
    interface OutputObject {
        user: string;
        kek_id: string;
        new_secs: bigint;
        new_start_ts: bigint;
        new_end_ts: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnerChangedEvent {
    type InputTuple = [oldOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [oldOwner: string, newOwner: string];
    interface OutputObject {
        oldOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnerNominatedEvent {
    type InputTuple = [newOwner: AddressLike];
    type OutputTuple = [newOwner: string];
    interface OutputObject {
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RewardPaidEvent {
    type InputTuple = [
        user: AddressLike,
        amount: BigNumberish,
        token_address: AddressLike,
        destination_address: AddressLike
    ];
    type OutputTuple = [
        user: string,
        amount: bigint,
        token_address: string,
        destination_address: string
    ];
    interface OutputObject {
        user: string;
        amount: bigint;
        token_address: string;
        destination_address: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace StakeLockedEvent {
    type InputTuple = [
        user: AddressLike,
        amount: BigNumberish,
        secs: BigNumberish,
        kek_id: BytesLike,
        source_address: AddressLike
    ];
    type OutputTuple = [
        user: string,
        amount: bigint,
        secs: bigint,
        kek_id: string,
        source_address: string
    ];
    interface OutputObject {
        user: string;
        amount: bigint;
        secs: bigint;
        kek_id: string;
        source_address: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace WithdrawLockedEvent {
    type InputTuple = [
        user: AddressLike,
        liquidity: BigNumberish,
        kek_id: BytesLike,
        destination_address: AddressLike
    ];
    type OutputTuple = [
        user: string,
        liquidity: bigint,
        kek_id: string,
        destination_address: string
    ];
    interface OutputObject {
        user: string;
        liquidity: bigint;
        kek_id: string;
        destination_address: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionUnifiedFarm_ERC20 extends BaseContract {
    connect(runner?: ContractRunner | null): OrionUnifiedFarm_ERC20;
    waitForDeployment(): Promise<this>;
    interface: OrionUnifiedFarm_ERC20Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;
    calcCurCombinedWeight: TypedContractMethod<[
        account: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            old_combined_weight: bigint;
            new_veorn_multiplier: bigint;
            new_combined_weight: bigint;
        }
    ], "view">;
    calcCurrLockMultiplier: TypedContractMethod<[
        account: AddressLike,
        stake_idx: BigNumberish
    ], [
        bigint
    ], "view">;
    changeTokenManager: TypedContractMethod<[
        reward_token_address: AddressLike,
        new_manager_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    combinedWeightOf: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    earned: TypedContractMethod<[account: AddressLike], [bigint[]], "view">;
    fraxPerLPStored: TypedContractMethod<[], [bigint], "view">;
    getAllRewardTokens: TypedContractMethod<[], [string[]], "view">;
    getProxyFor: TypedContractMethod<[addr: AddressLike], [string], "view">;
    getReward: TypedContractMethod<[
        destination_address: AddressLike
    ], [
        bigint[]
    ], "nonpayable">;
    getReward2: TypedContractMethod<[
        destination_address: AddressLike,
        claim_extra_too: boolean
    ], [
        bigint[]
    ], "nonpayable">;
    getRewardExtraLogic: TypedContractMethod<[
        destination_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getRewardForDuration: TypedContractMethod<[], [bigint[]], "view">;
    isTokenManagerFor: TypedContractMethod<[
        caller_addr: AddressLike,
        reward_token_addr: AddressLike
    ], [
        boolean
    ], "view">;
    lastRewardClaimTime: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    lastUpdateTime: TypedContractMethod<[], [bigint], "view">;
    lockAdditional: TypedContractMethod<[
        kek_id: BytesLike,
        addl_liq: BigNumberish
    ], [
        void
    ], "nonpayable">;
    lockLonger: TypedContractMethod<[
        kek_id: BytesLike,
        new_ending_ts: BigNumberish
    ], [
        void
    ], "nonpayable">;
    lockMultiplier: TypedContractMethod<[secs: BigNumberish], [bigint], "view">;
    lock_max_multiplier: TypedContractMethod<[], [bigint], "view">;
    lock_time_for_max_multiplier: TypedContractMethod<[], [bigint], "view">;
    lock_time_min: TypedContractMethod<[], [bigint], "view">;
    lockedLiquidityOf: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    lockedStakes: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            kek_id: string;
            start_timestamp: bigint;
            liquidity: bigint;
            ending_timestamp: bigint;
            lock_multiplier: bigint;
        }
    ], "view">;
    lockedStakesOf: TypedContractMethod<[
        account: AddressLike
    ], [
        OrionUnifiedFarm_ERC20.LockedStakeStructOutput[]
    ], "view">;
    lockedStakesOfLength: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    minVeORNForMaxBoost: TypedContractMethod<[
        stakeAmount: BigNumberish
    ], [
        bigint
    ], "view">;
    nominateNewOwner: TypedContractMethod<[
        _owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    nominatedOwner: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    periodFinish: TypedContractMethod<[], [bigint], "view">;
    proxyToggleStaker: TypedContractMethod<[
        staker_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    proxy_lp_balances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    recoverERC20: TypedContractMethod<[
        tokenAddress: AddressLike,
        tokenAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    rewardManagers: TypedContractMethod<[arg0: AddressLike], [string], "view">;
    rewardRates: TypedContractMethod<[token_idx: BigNumberish], [bigint], "view">;
    rewardTokenAddrToIdx: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    rewardsDuration: TypedContractMethod<[], [bigint], "view">;
    rewardsPerToken: TypedContractMethod<[], [bigint[]], "view">;
    setMiscVariables: TypedContractMethod<[
        _misc_vars: [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ], [
        void
    ], "nonpayable">;
    setPauses: TypedContractMethod<[
        _stakingPaused: boolean,
        _withdrawalsPaused: boolean,
        _rewardsCollectionPaused: boolean
    ], [
        void
    ], "nonpayable">;
    setRewardVars: TypedContractMethod<[
        reward_token_address: AddressLike,
        _new_rate: BigNumberish,
        _gauge_controller_address: AddressLike,
        _rewards_distributor_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    stakeLocked: TypedContractMethod<[
        liquidity: BigNumberish,
        secs: BigNumberish
    ], [
        string
    ], "nonpayable">;
    stakerSetVeORNProxy: TypedContractMethod<[
        proxy_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    staker_designated_proxies: TypedContractMethod<[
        arg0: AddressLike
    ], [
        string
    ], "view">;
    stakesUnlocked: TypedContractMethod<[], [boolean], "view">;
    stakingToken: TypedContractMethod<[], [string], "view">;
    sync: TypedContractMethod<[], [void], "nonpayable">;
    sync_gauge_weights: TypedContractMethod<[
        force_update: boolean
    ], [
        void
    ], "nonpayable">;
    toggleValidVeORNProxy: TypedContractMethod<[
        _proxy_addr: AddressLike
    ], [
        void
    ], "nonpayable">;
    totalCombinedWeight: TypedContractMethod<[], [bigint], "view">;
    totalLiquidityLocked: TypedContractMethod<[], [bigint], "view">;
    unlockStakes: TypedContractMethod<[], [void], "nonpayable">;
    updateRewardAndBalance: TypedContractMethod<[
        account: AddressLike,
        sync_too: boolean
    ], [
        void
    ], "nonpayable">;
    veORN: TypedContractMethod<[], [string], "view">;
    veORNMultiplier: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    veorn_boost_scale_factor: TypedContractMethod<[], [bigint], "view">;
    veorn_max_multiplier: TypedContractMethod<[], [bigint], "view">;
    withdrawLocked: TypedContractMethod<[
        kek_id: BytesLike,
        destination_address: AddressLike
    ], [
        bigint
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "acceptOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "calcCurCombinedWeight"): TypedContractMethod<[
        account: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            old_combined_weight: bigint;
            new_veorn_multiplier: bigint;
            new_combined_weight: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "calcCurrLockMultiplier"): TypedContractMethod<[
        account: AddressLike,
        stake_idx: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "changeTokenManager"): TypedContractMethod<[
        reward_token_address: AddressLike,
        new_manager_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "combinedWeightOf"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "earned"): TypedContractMethod<[account: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "fraxPerLPStored"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getAllRewardTokens"): TypedContractMethod<[], [string[]], "view">;
    getFunction(nameOrSignature: "getProxyFor"): TypedContractMethod<[addr: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[
        destination_address: AddressLike
    ], [
        bigint[]
    ], "nonpayable">;
    getFunction(nameOrSignature: "getReward2"): TypedContractMethod<[
        destination_address: AddressLike,
        claim_extra_too: boolean
    ], [
        bigint[]
    ], "nonpayable">;
    getFunction(nameOrSignature: "getRewardExtraLogic"): TypedContractMethod<[
        destination_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "getRewardForDuration"): TypedContractMethod<[], [bigint[]], "view">;
    getFunction(nameOrSignature: "isTokenManagerFor"): TypedContractMethod<[
        caller_addr: AddressLike,
        reward_token_addr: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "lastRewardClaimTime"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "lastUpdateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lockAdditional"): TypedContractMethod<[
        kek_id: BytesLike,
        addl_liq: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lockLonger"): TypedContractMethod<[
        kek_id: BytesLike,
        new_ending_ts: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "lockMultiplier"): TypedContractMethod<[secs: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "lock_max_multiplier"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lock_time_for_max_multiplier"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lock_time_min"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lockedLiquidityOf"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "lockedStakes"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            kek_id: string;
            start_timestamp: bigint;
            liquidity: bigint;
            ending_timestamp: bigint;
            lock_multiplier: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "lockedStakesOf"): TypedContractMethod<[
        account: AddressLike
    ], [
        OrionUnifiedFarm_ERC20.LockedStakeStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "lockedStakesOfLength"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "minVeORNForMaxBoost"): TypedContractMethod<[stakeAmount: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "nominateNewOwner"): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "nominatedOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "periodFinish"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "proxyToggleStaker"): TypedContractMethod<[staker_address: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "proxy_lp_balances"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "recoverERC20"): TypedContractMethod<[
        tokenAddress: AddressLike,
        tokenAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "rewardManagers"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "rewardRates"): TypedContractMethod<[token_idx: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "rewardTokenAddrToIdx"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsDuration"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardsPerToken"): TypedContractMethod<[], [bigint[]], "view">;
    getFunction(nameOrSignature: "setMiscVariables"): TypedContractMethod<[
        _misc_vars: [
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish,
            BigNumberish
        ]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setPauses"): TypedContractMethod<[
        _stakingPaused: boolean,
        _withdrawalsPaused: boolean,
        _rewardsCollectionPaused: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setRewardVars"): TypedContractMethod<[
        reward_token_address: AddressLike,
        _new_rate: BigNumberish,
        _gauge_controller_address: AddressLike,
        _rewards_distributor_address: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stakeLocked"): TypedContractMethod<[
        liquidity: BigNumberish,
        secs: BigNumberish
    ], [
        string
    ], "nonpayable">;
    getFunction(nameOrSignature: "stakerSetVeORNProxy"): TypedContractMethod<[proxy_address: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "staker_designated_proxies"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "stakesUnlocked"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "stakingToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "sync"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "sync_gauge_weights"): TypedContractMethod<[force_update: boolean], [void], "nonpayable">;
    getFunction(nameOrSignature: "toggleValidVeORNProxy"): TypedContractMethod<[_proxy_addr: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "totalCombinedWeight"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "totalLiquidityLocked"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "unlockStakes"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "updateRewardAndBalance"): TypedContractMethod<[
        account: AddressLike,
        sync_too: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "veORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "veORNMultiplier"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "veorn_boost_scale_factor"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "veorn_max_multiplier"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "withdrawLocked"): TypedContractMethod<[
        kek_id: BytesLike,
        destination_address: AddressLike
    ], [
        bigint
    ], "nonpayable">;
    getEvent(key: "LockedAdditional"): TypedContractEvent<LockedAdditionalEvent.InputTuple, LockedAdditionalEvent.OutputTuple, LockedAdditionalEvent.OutputObject>;
    getEvent(key: "LockedLonger"): TypedContractEvent<LockedLongerEvent.InputTuple, LockedLongerEvent.OutputTuple, LockedLongerEvent.OutputObject>;
    getEvent(key: "OwnerChanged"): TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
    getEvent(key: "OwnerNominated"): TypedContractEvent<OwnerNominatedEvent.InputTuple, OwnerNominatedEvent.OutputTuple, OwnerNominatedEvent.OutputObject>;
    getEvent(key: "RewardPaid"): TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
    getEvent(key: "StakeLocked"): TypedContractEvent<StakeLockedEvent.InputTuple, StakeLockedEvent.OutputTuple, StakeLockedEvent.OutputObject>;
    getEvent(key: "WithdrawLocked"): TypedContractEvent<WithdrawLockedEvent.InputTuple, WithdrawLockedEvent.OutputTuple, WithdrawLockedEvent.OutputObject>;
    filters: {
        "LockedAdditional(address,bytes32,uint256)": TypedContractEvent<LockedAdditionalEvent.InputTuple, LockedAdditionalEvent.OutputTuple, LockedAdditionalEvent.OutputObject>;
        LockedAdditional: TypedContractEvent<LockedAdditionalEvent.InputTuple, LockedAdditionalEvent.OutputTuple, LockedAdditionalEvent.OutputObject>;
        "LockedLonger(address,bytes32,uint256,uint256,uint256)": TypedContractEvent<LockedLongerEvent.InputTuple, LockedLongerEvent.OutputTuple, LockedLongerEvent.OutputObject>;
        LockedLonger: TypedContractEvent<LockedLongerEvent.InputTuple, LockedLongerEvent.OutputTuple, LockedLongerEvent.OutputObject>;
        "OwnerChanged(address,address)": TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
        OwnerChanged: TypedContractEvent<OwnerChangedEvent.InputTuple, OwnerChangedEvent.OutputTuple, OwnerChangedEvent.OutputObject>;
        "OwnerNominated(address)": TypedContractEvent<OwnerNominatedEvent.InputTuple, OwnerNominatedEvent.OutputTuple, OwnerNominatedEvent.OutputObject>;
        OwnerNominated: TypedContractEvent<OwnerNominatedEvent.InputTuple, OwnerNominatedEvent.OutputTuple, OwnerNominatedEvent.OutputObject>;
        "RewardPaid(address,uint256,address,address)": TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
        RewardPaid: TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
        "StakeLocked(address,uint256,uint256,bytes32,address)": TypedContractEvent<StakeLockedEvent.InputTuple, StakeLockedEvent.OutputTuple, StakeLockedEvent.OutputObject>;
        StakeLocked: TypedContractEvent<StakeLockedEvent.InputTuple, StakeLockedEvent.OutputTuple, StakeLockedEvent.OutputObject>;
        "WithdrawLocked(address,uint256,bytes32,address)": TypedContractEvent<WithdrawLockedEvent.InputTuple, WithdrawLockedEvent.OutputTuple, WithdrawLockedEvent.OutputObject>;
        WithdrawLocked: TypedContractEvent<WithdrawLockedEvent.InputTuple, WithdrawLockedEvent.OutputTuple, WithdrawLockedEvent.OutputObject>;
    };
}
