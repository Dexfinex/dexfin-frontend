import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionV3FarmInterface extends Interface {
    getFunction(nameOrSignature: "BOOST_SCALE_FACTOR" | "DURATION" | "MAX_BOOSTED_REWARD" | "MAX_MULTIPLIER" | "ORN" | "balanceOfVeORN" | "claimReward" | "getBoost" | "getRateFee" | "getReward" | "getUserFee" | "liquidityStorage" | "nftManager" | "onERC721Received" | "orderStorage" | "poolStorage" | "rewardDistributor" | "smartOwner" | "stake" | "totalSupplyVeORN" | "unstake" | "updateReward" | "usePool" | "veORN"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "PoolReward" | "Stake" | "UsePool" | "WithdrawReward"): EventFragment;
    encodeFunctionData(functionFragment: "BOOST_SCALE_FACTOR", values?: undefined): string;
    encodeFunctionData(functionFragment: "DURATION", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_BOOSTED_REWARD", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_MULTIPLIER", values?: undefined): string;
    encodeFunctionData(functionFragment: "ORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "balanceOfVeORN", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "claimReward", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getBoost", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRateFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getReward", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getUserFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "liquidityStorage", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "nftManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "onERC721Received", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "orderStorage", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "poolStorage", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "rewardDistributor", values?: undefined): string;
    encodeFunctionData(functionFragment: "smartOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "totalSupplyVeORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "unstake", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "updateReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "usePool", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "veORN", values?: undefined): string;
    decodeFunctionResult(functionFragment: "BOOST_SCALE_FACTOR", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DURATION", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_BOOSTED_REWARD", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_MULTIPLIER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOfVeORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBoost", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUserFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "liquidityStorage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nftManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onERC721Received", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "orderStorage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolStorage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardDistributor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalSupplyVeORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unstake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usePool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veORN", data: BytesLike): Result;
}
export declare namespace PoolRewardEvent {
    type InputTuple = [
        pool: AddressLike,
        rewardAll: BigNumberish,
        rewardAdd: BigNumberish,
        timeAdd: BigNumberish
    ];
    type OutputTuple = [
        pool: string,
        rewardAll: bigint,
        rewardAdd: bigint,
        timeAdd: bigint
    ];
    interface OutputObject {
        pool: string;
        rewardAll: bigint;
        rewardAdd: bigint;
        timeAdd: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace StakeEvent {
    type InputTuple = [
        pool: AddressLike,
        user: AddressLike,
        tokenId: BigNumberish,
        liquidityAll: BigNumberish,
        liquidityUser: BigNumberish,
        liquidityAdd: BigNumberish,
        time: BigNumberish
    ];
    type OutputTuple = [
        pool: string,
        user: string,
        tokenId: bigint,
        liquidityAll: bigint,
        liquidityUser: bigint,
        liquidityAdd: bigint,
        time: bigint
    ];
    interface OutputObject {
        pool: string;
        user: string;
        tokenId: bigint;
        liquidityAll: bigint;
        liquidityUser: bigint;
        liquidityAdd: bigint;
        time: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UsePoolEvent {
    type InputTuple = [
        pool: AddressLike,
        gauge: AddressLike,
        bUse: boolean
    ];
    type OutputTuple = [pool: string, gauge: string, bUse: boolean];
    interface OutputObject {
        pool: string;
        gauge: string;
        bUse: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace WithdrawRewardEvent {
    type InputTuple = [
        pool: AddressLike,
        recipient: AddressLike,
        tokenId: BigNumberish,
        amount: BigNumberish,
        userFee: BigNumberish,
        rewardAll: BigNumberish,
        feeWithdraw: BigNumberish,
        rateFee: BigNumberish,
        time: BigNumberish
    ];
    type OutputTuple = [
        pool: string,
        recipient: string,
        tokenId: bigint,
        amount: bigint,
        userFee: bigint,
        rewardAll: bigint,
        feeWithdraw: bigint,
        rateFee: bigint,
        time: bigint
    ];
    interface OutputObject {
        pool: string;
        recipient: string;
        tokenId: bigint;
        amount: bigint;
        userFee: bigint;
        rewardAll: bigint;
        feeWithdraw: bigint;
        rateFee: bigint;
        time: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionV3Farm extends BaseContract {
    connect(runner?: ContractRunner | null): OrionV3Farm;
    waitForDeployment(): Promise<this>;
    interface: OrionV3FarmInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    BOOST_SCALE_FACTOR: TypedContractMethod<[], [bigint], "view">;
    DURATION: TypedContractMethod<[], [bigint], "view">;
    MAX_BOOSTED_REWARD: TypedContractMethod<[], [bigint], "view">;
    MAX_MULTIPLIER: TypedContractMethod<[], [bigint], "view">;
    ORN: TypedContractMethod<[], [string], "view">;
    balanceOfVeORN: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    claimReward: TypedContractMethod<[
        tokenId: BigNumberish
    ], [
        [bigint, bigint] & {
            userFee: bigint;
            amount: bigint;
        }
    ], "nonpayable">;
    getBoost: TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getRateFee: TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getReward: TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getUserFee: TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    liquidityStorage: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    nftManager: TypedContractMethod<[], [string], "view">;
    onERC721Received: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "view">;
    orderStorage: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [
            bigint,
            string,
            bigint
        ] & {
            startBlock: bigint;
            owner: string;
            withdraw: bigint;
        }
    ], "view">;
    poolStorage: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint,
            string,
            bigint,
            boolean
        ] & {
            rewardAll: bigint;
            feeWithdraw: bigint;
            rewardAdd: bigint;
            liquidityAll: bigint;
            gaugeAddr: string;
            timeAdd: bigint;
            bUse: boolean;
        }
    ], "view">;
    rewardDistributor: TypedContractMethod<[], [string], "view">;
    smartOwner: TypedContractMethod<[], [string], "view">;
    stake: TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    totalSupplyVeORN: TypedContractMethod<[], [bigint], "view">;
    unstake: TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    updateReward: TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    usePool: TypedContractMethod<[
        pool: AddressLike,
        bUse: boolean
    ], [
        void
    ], "nonpayable">;
    veORN: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "BOOST_SCALE_FACTOR"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "DURATION"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_BOOSTED_REWARD"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_MULTIPLIER"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "ORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "balanceOfVeORN"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "claimReward"): TypedContractMethod<[
        tokenId: BigNumberish
    ], [
        [bigint, bigint] & {
            userFee: bigint;
            amount: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "getBoost"): TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getRateFee"): TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getUserFee"): TypedContractMethod<[tokenId: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "liquidityStorage"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "nftManager"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "onERC721Received"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike,
        arg2: BigNumberish,
        arg3: BytesLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "orderStorage"): TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [
            bigint,
            string,
            bigint
        ] & {
            startBlock: bigint;
            owner: string;
            withdraw: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "poolStorage"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint,
            string,
            bigint,
            boolean
        ] & {
            rewardAll: bigint;
            feeWithdraw: bigint;
            rewardAdd: bigint;
            liquidityAll: bigint;
            gaugeAddr: string;
            timeAdd: bigint;
            bUse: boolean;
        }
    ], "view">;
    getFunction(nameOrSignature: "rewardDistributor"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "smartOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "stake"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "totalSupplyVeORN"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "unstake"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "updateReward"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "usePool"): TypedContractMethod<[
        pool: AddressLike,
        bUse: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "veORN"): TypedContractMethod<[], [string], "view">;
    getEvent(key: "PoolReward"): TypedContractEvent<PoolRewardEvent.InputTuple, PoolRewardEvent.OutputTuple, PoolRewardEvent.OutputObject>;
    getEvent(key: "Stake"): TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
    getEvent(key: "UsePool"): TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
    getEvent(key: "WithdrawReward"): TypedContractEvent<WithdrawRewardEvent.InputTuple, WithdrawRewardEvent.OutputTuple, WithdrawRewardEvent.OutputObject>;
    filters: {
        "PoolReward(address,uint128,uint128,uint48)": TypedContractEvent<PoolRewardEvent.InputTuple, PoolRewardEvent.OutputTuple, PoolRewardEvent.OutputObject>;
        PoolReward: TypedContractEvent<PoolRewardEvent.InputTuple, PoolRewardEvent.OutputTuple, PoolRewardEvent.OutputObject>;
        "Stake(address,address,uint256,uint128,uint128,int128,uint48)": TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        Stake: TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        "UsePool(address,address,bool)": TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
        UsePool: TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
        "WithdrawReward(address,address,uint256,uint128,uint128,uint128,uint128,uint128,uint48)": TypedContractEvent<WithdrawRewardEvent.InputTuple, WithdrawRewardEvent.OutputTuple, WithdrawRewardEvent.OutputObject>;
        WithdrawReward: TypedContractEvent<WithdrawRewardEvent.InputTuple, WithdrawRewardEvent.OutputTuple, WithdrawRewardEvent.OutputObject>;
    };
}
