import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace MarginalFunctionality {
    type PositionStruct = {
        state: BigNumberish;
        weightedPosition: BigNumberish;
        totalPosition: BigNumberish;
        totalLiabilities: BigNumberish;
    };
    type PositionStructOutput = [
        state: bigint,
        weightedPosition: bigint,
        totalPosition: bigint,
        totalLiabilities: bigint
    ] & {
        state: bigint;
        weightedPosition: bigint;
        totalPosition: bigint;
        totalLiabilities: bigint;
    };
    type LiabilityStruct = {
        asset: AddressLike;
        timestamp: BigNumberish;
        outstandingAmount: BigNumberish;
    };
    type LiabilityStructOutput = [
        asset: string,
        timestamp: bigint,
        outstandingAmount: bigint
    ] & {
        asset: string;
        timestamp: bigint;
        outstandingAmount: bigint;
    };
}
export declare namespace LibValidator {
    type OrderStruct = {
        senderAddress: AddressLike;
        matcherAddress: AddressLike;
        baseAsset: AddressLike;
        quoteAsset: AddressLike;
        matcherFeeAsset: AddressLike;
        amount: BigNumberish;
        price: BigNumberish;
        matcherFee: BigNumberish;
        nonce: BigNumberish;
        expiration: BigNumberish;
        buySide: BigNumberish;
        signature: BytesLike;
    };
    type OrderStructOutput = [
        senderAddress: string,
        matcherAddress: string,
        baseAsset: string,
        quoteAsset: string,
        matcherFeeAsset: string,
        amount: bigint,
        price: bigint,
        matcherFee: bigint,
        nonce: bigint,
        expiration: bigint,
        buySide: bigint,
        signature: string
    ] & {
        senderAddress: string;
        matcherAddress: string;
        baseAsset: string;
        quoteAsset: string;
        matcherFeeAsset: string;
        amount: bigint;
        price: bigint;
        matcherFee: bigint;
        nonce: bigint;
        expiration: bigint;
        buySide: bigint;
        signature: string;
    };
    type CrossChainOrderStruct = {
        limitOrder: LibValidator.OrderStruct;
        chainId: BigNumberish;
        secretHash: BytesLike;
        lockOrderExpiration: BigNumberish;
    };
    type CrossChainOrderStructOutput = [
        limitOrder: LibValidator.OrderStructOutput,
        chainId: bigint,
        secretHash: string,
        lockOrderExpiration: bigint
    ] & {
        limitOrder: LibValidator.OrderStructOutput;
        chainId: bigint;
        secretHash: string;
        lockOrderExpiration: bigint;
    };
    type SwapDescriptionStruct = {
        srcToken: AddressLike;
        dstToken: AddressLike;
        srcReceiver: AddressLike;
        dstReceiver: AddressLike;
        amount: BigNumberish;
        minReturnAmount: BigNumberish;
        flags: BigNumberish;
    };
    type SwapDescriptionStructOutput = [
        srcToken: string,
        dstToken: string,
        srcReceiver: string,
        dstReceiver: string,
        amount: bigint,
        minReturnAmount: bigint,
        flags: bigint
    ] & {
        srcToken: string;
        dstToken: string;
        srcReceiver: string;
        dstReceiver: string;
        amount: bigint;
        minReturnAmount: bigint;
        flags: bigint;
    };
}
export declare namespace LibAtomic {
    type LockOrderStruct = {
        sender: AddressLike;
        expiration: BigNumberish;
        asset: AddressLike;
        amount: BigNumberish;
        targetChainId: BigNumberish;
        secretHash: BytesLike;
    };
    type LockOrderStructOutput = [
        sender: string,
        expiration: bigint,
        asset: string,
        amount: bigint,
        targetChainId: bigint,
        secretHash: string
    ] & {
        sender: string;
        expiration: bigint;
        asset: string;
        amount: bigint;
        targetChainId: bigint;
        secretHash: string;
    };
    type RedeemOrderStruct = {
        sender: AddressLike;
        receiver: AddressLike;
        claimReceiver: AddressLike;
        asset: AddressLike;
        amount: BigNumberish;
        expiration: BigNumberish;
        secretHash: BytesLike;
        signature: BytesLike;
    };
    type RedeemOrderStructOutput = [
        sender: string,
        receiver: string,
        claimReceiver: string,
        asset: string,
        amount: bigint,
        expiration: bigint,
        secretHash: string,
        signature: string
    ] & {
        sender: string;
        receiver: string;
        claimReceiver: string;
        asset: string;
        amount: bigint;
        expiration: bigint;
        secretHash: string;
        signature: string;
    };
}
export interface ExchangeInterface extends Interface {
    getFunction(nameOrSignature: "WETH" | "assetRisks" | "atomicSwaps" | "calcPosition" | "checkPosition" | "claimAtomic" | "deposit" | "depositAsset" | "depositAssetTo" | "depositTo" | "fillAndLockAtomic" | "fillOrders" | "fillThroughPools" | "filledAmounts" | "getBalance" | "getBalances" | "getCollateralAssets" | "getFilledAmounts" | "getLiabilities" | "initialize" | "liabilities" | "liquidationPremium" | "lockAtomic" | "lockAtomicByMatcher" | "owner" | "positionOverdue" | "priceOverdue" | "redeem2Atomics" | "redeemAtomic" | "refundAtomic" | "renounceOwnership" | "secrets" | "setAssetBalance" | "setBasicParams" | "stakeRisk" | "swap" | "transferOwnership" | "updateAssetRisks" | "updateMarginalSettings" | "validateCrossChainOrder" | "validateOrder" | "withdraw" | "withdrawTo"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "AtomicClaimed" | "AtomicLocked" | "AtomicRedeemed" | "AtomicRefunded" | "Initialized" | "NewAssetTransaction" | "OwnershipTransferred" | "Trade"): EventFragment;
    encodeFunctionData(functionFragment: "WETH", values?: undefined): string;
    encodeFunctionData(functionFragment: "assetRisks", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "atomicSwaps", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "calcPosition", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "checkPosition", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "claimAtomic", values: [AddressLike, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
    encodeFunctionData(functionFragment: "depositAsset", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "depositAssetTo", values: [AddressLike, BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "depositTo", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "fillAndLockAtomic", values: [
        LibValidator.CrossChainOrderStruct,
        LibValidator.OrderStruct,
        BigNumberish,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "fillOrders", values: [
        LibValidator.OrderStruct,
        LibValidator.OrderStruct,
        BigNumberish,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "fillThroughPools", values: [
        BigNumberish,
        LibValidator.OrderStruct,
        AddressLike,
        LibValidator.SwapDescriptionStruct,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "filledAmounts", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getBalance", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "getBalances", values: [AddressLike[], AddressLike]): string;
    encodeFunctionData(functionFragment: "getCollateralAssets", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFilledAmounts", values: [BytesLike, LibValidator.OrderStruct]): string;
    encodeFunctionData(functionFragment: "getLiabilities", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "initialize", values?: undefined): string;
    encodeFunctionData(functionFragment: "liabilities", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "liquidationPremium", values?: undefined): string;
    encodeFunctionData(functionFragment: "lockAtomic", values: [LibAtomic.LockOrderStruct]): string;
    encodeFunctionData(functionFragment: "lockAtomicByMatcher", values: [AddressLike, LibAtomic.LockOrderStruct]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "positionOverdue", values?: undefined): string;
    encodeFunctionData(functionFragment: "priceOverdue", values?: undefined): string;
    encodeFunctionData(functionFragment: "redeem2Atomics", values: [
        LibAtomic.RedeemOrderStruct,
        BytesLike,
        LibAtomic.RedeemOrderStruct,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "redeemAtomic", values: [LibAtomic.RedeemOrderStruct, BytesLike]): string;
    encodeFunctionData(functionFragment: "refundAtomic", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "secrets", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "setAssetBalance", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setBasicParams", values: [AddressLike, AddressLike, AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "stakeRisk", values?: undefined): string;
    encodeFunctionData(functionFragment: "swap", values: [
        AddressLike,
        LibValidator.SwapDescriptionStruct,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "updateAssetRisks", values: [AddressLike[], BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "updateMarginalSettings", values: [
        AddressLike[],
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "validateCrossChainOrder", values: [LibValidator.CrossChainOrderStruct]): string;
    encodeFunctionData(functionFragment: "validateOrder", values: [LibValidator.OrderStruct]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "withdrawTo", values: [AddressLike, BigNumberish, AddressLike]): string;
    decodeFunctionResult(functionFragment: "WETH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assetRisks", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "atomicSwaps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcPosition", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkPosition", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimAtomic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositAsset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositAssetTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fillAndLockAtomic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fillOrders", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fillThroughPools", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "filledAmounts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCollateralAssets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFilledAmounts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLiabilities", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "liabilities", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "liquidationPremium", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockAtomic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lockAtomicByMatcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "positionOverdue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "priceOverdue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeem2Atomics", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemAtomic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "refundAtomic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "secrets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAssetBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBasicParams", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "stakeRisk", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateAssetRisks", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "updateMarginalSettings", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateCrossChainOrder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "validateOrder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
}
export declare namespace AtomicClaimedEvent {
    type InputTuple = [
        receiver: AddressLike,
        asset: AddressLike,
        secret: BytesLike
    ];
    type OutputTuple = [receiver: string, asset: string, secret: string];
    interface OutputObject {
        receiver: string;
        asset: string;
        secret: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace AtomicLockedEvent {
    type InputTuple = [
        sender: AddressLike,
        asset: AddressLike,
        secretHash: BytesLike
    ];
    type OutputTuple = [sender: string, asset: string, secretHash: string];
    interface OutputObject {
        sender: string;
        asset: string;
        secretHash: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace AtomicRedeemedEvent {
    type InputTuple = [
        sender: AddressLike,
        receiver: AddressLike,
        asset: AddressLike,
        secret: BytesLike
    ];
    type OutputTuple = [
        sender: string,
        receiver: string,
        asset: string,
        secret: string
    ];
    interface OutputObject {
        sender: string;
        receiver: string;
        asset: string;
        secret: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace AtomicRefundedEvent {
    type InputTuple = [
        receiver: AddressLike,
        asset: AddressLike,
        secretHash: BytesLike
    ];
    type OutputTuple = [
        receiver: string,
        asset: string,
        secretHash: string
    ];
    interface OutputObject {
        receiver: string;
        asset: string;
        secretHash: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace InitializedEvent {
    type InputTuple = [version: BigNumberish];
    type OutputTuple = [version: bigint];
    interface OutputObject {
        version: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NewAssetTransactionEvent {
    type InputTuple = [
        beneficiary: AddressLike,
        recipient: AddressLike,
        assetAddress: AddressLike,
        isDeposit: boolean,
        amount: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        beneficiary: string,
        recipient: string,
        assetAddress: string,
        isDeposit: boolean,
        amount: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        beneficiary: string;
        recipient: string;
        assetAddress: string;
        isDeposit: boolean;
        amount: bigint;
        timestamp: bigint;
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
export declare namespace TradeEvent {
    type InputTuple = [
        buyer: AddressLike,
        seller: AddressLike,
        baseAsset: AddressLike,
        quoteAsset: AddressLike,
        filledPrice: BigNumberish,
        filledAmount: BigNumberish,
        amountQuote: BigNumberish,
        tradeId: BytesLike
    ];
    type OutputTuple = [
        buyer: string,
        seller: string,
        baseAsset: string,
        quoteAsset: string,
        filledPrice: bigint,
        filledAmount: bigint,
        amountQuote: bigint,
        tradeId: string
    ];
    interface OutputObject {
        buyer: string;
        seller: string;
        baseAsset: string;
        quoteAsset: string;
        filledPrice: bigint;
        filledAmount: bigint;
        amountQuote: bigint;
        tradeId: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface Exchange extends BaseContract {
    connect(runner?: ContractRunner | null): Exchange;
    waitForDeployment(): Promise<this>;
    interface: ExchangeInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    WETH: TypedContractMethod<[], [string], "view">;
    assetRisks: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    atomicSwaps: TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            bigint,
            boolean,
            string,
            bigint,
            bigint
        ] & {
            sender: string;
            expiration: bigint;
            used: boolean;
            asset: string;
            amount: bigint;
            targetChainId: bigint;
        }
    ], "view">;
    calcPosition: TypedContractMethod<[
        user: AddressLike
    ], [
        MarginalFunctionality.PositionStructOutput
    ], "view">;
    checkPosition: TypedContractMethod<[user: AddressLike], [boolean], "view">;
    claimAtomic: TypedContractMethod<[
        receiver: AddressLike,
        secret: BytesLike,
        matcherSignature: BytesLike
    ], [
        void
    ], "nonpayable">;
    deposit: TypedContractMethod<[], [void], "payable">;
    depositAsset: TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    depositAssetTo: TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    depositTo: TypedContractMethod<[account: AddressLike], [void], "payable">;
    fillAndLockAtomic: TypedContractMethod<[
        userOrder: LibValidator.CrossChainOrderStruct,
        brokerOrder: LibValidator.OrderStruct,
        filledPrice: BigNumberish,
        filledAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    fillOrders: TypedContractMethod<[
        buyOrder: LibValidator.OrderStruct,
        sellOrder: LibValidator.OrderStruct,
        filledPrice: BigNumberish,
        filledAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    fillThroughPools: TypedContractMethod<[
        filledAmount: BigNumberish,
        order: LibValidator.OrderStruct,
        executor: AddressLike,
        desc: LibValidator.SwapDescriptionStruct,
        permit: BytesLike,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    filledAmounts: TypedContractMethod<[arg0: BytesLike], [bigint], "view">;
    getBalance: TypedContractMethod<[
        assetAddress: AddressLike,
        user: AddressLike
    ], [
        bigint
    ], "view">;
    getBalances: TypedContractMethod<[
        assetsAddresses: AddressLike[],
        user: AddressLike
    ], [
        bigint[]
    ], "view">;
    getCollateralAssets: TypedContractMethod<[], [string[]], "view">;
    getFilledAmounts: TypedContractMethod<[
        orderHash: BytesLike,
        order: LibValidator.OrderStruct
    ], [
        [bigint, bigint] & {
            totalFilled: bigint;
            totalFeesPaid: bigint;
        }
    ], "view">;
    getLiabilities: TypedContractMethod<[
        user: AddressLike
    ], [
        MarginalFunctionality.LiabilityStructOutput[]
    ], "view">;
    initialize: TypedContractMethod<[], [void], "payable">;
    liabilities: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint
        ] & {
            asset: string;
            timestamp: bigint;
            outstandingAmount: bigint;
        }
    ], "view">;
    liquidationPremium: TypedContractMethod<[], [bigint], "view">;
    lockAtomic: TypedContractMethod<[
        swap: LibAtomic.LockOrderStruct
    ], [
        void
    ], "payable">;
    lockAtomicByMatcher: TypedContractMethod<[
        account: AddressLike,
        lockOrder: LibAtomic.LockOrderStruct
    ], [
        void
    ], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    positionOverdue: TypedContractMethod<[], [bigint], "view">;
    priceOverdue: TypedContractMethod<[], [bigint], "view">;
    redeem2Atomics: TypedContractMethod<[
        order1: LibAtomic.RedeemOrderStruct,
        secret1: BytesLike,
        order2: LibAtomic.RedeemOrderStruct,
        secret2: BytesLike
    ], [
        void
    ], "nonpayable">;
    redeemAtomic: TypedContractMethod<[
        order: LibAtomic.RedeemOrderStruct,
        secret: BytesLike
    ], [
        void
    ], "nonpayable">;
    refundAtomic: TypedContractMethod<[
        secretHash: BytesLike
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    secrets: TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    setAssetBalance: TypedContractMethod<[
        assetAddress: AddressLike,
        account: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setBasicParams: TypedContractMethod<[
        orionToken: AddressLike,
        priceOracleAddress: AddressLike,
        allowedMatcher: AddressLike,
        WETH_: AddressLike,
        claimAtomicFee: BigNumberish
    ], [
        void
    ], "nonpayable">;
    stakeRisk: TypedContractMethod<[], [bigint], "view">;
    swap: TypedContractMethod<[
        executor: AddressLike,
        desc: LibValidator.SwapDescriptionStruct,
        permit: BytesLike,
        data: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            returnAmount: bigint;
            spentAmount: bigint;
            gasLeft: bigint;
        }
    ], "payable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    updateAssetRisks: TypedContractMethod<[
        assets: AddressLike[],
        risks: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    updateMarginalSettings: TypedContractMethod<[
        _collateralAssets: AddressLike[],
        _stakeRisk: BigNumberish,
        _liquidationPremium: BigNumberish,
        _priceOverdue: BigNumberish,
        _positionOverdue: BigNumberish
    ], [
        void
    ], "nonpayable">;
    validateCrossChainOrder: TypedContractMethod<[
        userOrder: LibValidator.CrossChainOrderStruct
    ], [
        boolean
    ], "view">;
    validateOrder: TypedContractMethod<[
        order: LibValidator.OrderStruct
    ], [
        boolean
    ], "view">;
    withdraw: TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    withdrawTo: TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "WETH"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "assetRisks"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "atomicSwaps"): TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            bigint,
            boolean,
            string,
            bigint,
            bigint
        ] & {
            sender: string;
            expiration: bigint;
            used: boolean;
            asset: string;
            amount: bigint;
            targetChainId: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "calcPosition"): TypedContractMethod<[
        user: AddressLike
    ], [
        MarginalFunctionality.PositionStructOutput
    ], "view">;
    getFunction(nameOrSignature: "checkPosition"): TypedContractMethod<[user: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "claimAtomic"): TypedContractMethod<[
        receiver: AddressLike,
        secret: BytesLike,
        matcherSignature: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "deposit"): TypedContractMethod<[], [void], "payable">;
    getFunction(nameOrSignature: "depositAsset"): TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "depositAssetTo"): TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "depositTo"): TypedContractMethod<[account: AddressLike], [void], "payable">;
    getFunction(nameOrSignature: "fillAndLockAtomic"): TypedContractMethod<[
        userOrder: LibValidator.CrossChainOrderStruct,
        brokerOrder: LibValidator.OrderStruct,
        filledPrice: BigNumberish,
        filledAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "fillOrders"): TypedContractMethod<[
        buyOrder: LibValidator.OrderStruct,
        sellOrder: LibValidator.OrderStruct,
        filledPrice: BigNumberish,
        filledAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "fillThroughPools"): TypedContractMethod<[
        filledAmount: BigNumberish,
        order: LibValidator.OrderStruct,
        executor: AddressLike,
        desc: LibValidator.SwapDescriptionStruct,
        permit: BytesLike,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "filledAmounts"): TypedContractMethod<[arg0: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "getBalance"): TypedContractMethod<[
        assetAddress: AddressLike,
        user: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getBalances"): TypedContractMethod<[
        assetsAddresses: AddressLike[],
        user: AddressLike
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "getCollateralAssets"): TypedContractMethod<[], [string[]], "view">;
    getFunction(nameOrSignature: "getFilledAmounts"): TypedContractMethod<[
        orderHash: BytesLike,
        order: LibValidator.OrderStruct
    ], [
        [bigint, bigint] & {
            totalFilled: bigint;
            totalFeesPaid: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "getLiabilities"): TypedContractMethod<[
        user: AddressLike
    ], [
        MarginalFunctionality.LiabilityStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[], [void], "payable">;
    getFunction(nameOrSignature: "liabilities"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint
        ] & {
            asset: string;
            timestamp: bigint;
            outstandingAmount: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "liquidationPremium"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "lockAtomic"): TypedContractMethod<[swap: LibAtomic.LockOrderStruct], [void], "payable">;
    getFunction(nameOrSignature: "lockAtomicByMatcher"): TypedContractMethod<[
        account: AddressLike,
        lockOrder: LibAtomic.LockOrderStruct
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "positionOverdue"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "priceOverdue"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "redeem2Atomics"): TypedContractMethod<[
        order1: LibAtomic.RedeemOrderStruct,
        secret1: BytesLike,
        order2: LibAtomic.RedeemOrderStruct,
        secret2: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "redeemAtomic"): TypedContractMethod<[
        order: LibAtomic.RedeemOrderStruct,
        secret: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "refundAtomic"): TypedContractMethod<[secretHash: BytesLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "secrets"): TypedContractMethod<[arg0: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "setAssetBalance"): TypedContractMethod<[
        assetAddress: AddressLike,
        account: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setBasicParams"): TypedContractMethod<[
        orionToken: AddressLike,
        priceOracleAddress: AddressLike,
        allowedMatcher: AddressLike,
        WETH_: AddressLike,
        claimAtomicFee: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "stakeRisk"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "swap"): TypedContractMethod<[
        executor: AddressLike,
        desc: LibValidator.SwapDescriptionStruct,
        permit: BytesLike,
        data: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            returnAmount: bigint;
            spentAmount: bigint;
            gasLeft: bigint;
        }
    ], "payable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "updateAssetRisks"): TypedContractMethod<[
        assets: AddressLike[],
        risks: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "updateMarginalSettings"): TypedContractMethod<[
        _collateralAssets: AddressLike[],
        _stakeRisk: BigNumberish,
        _liquidationPremium: BigNumberish,
        _priceOverdue: BigNumberish,
        _positionOverdue: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "validateCrossChainOrder"): TypedContractMethod<[
        userOrder: LibValidator.CrossChainOrderStruct
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "validateOrder"): TypedContractMethod<[order: LibValidator.OrderStruct], [boolean], "view">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "withdrawTo"): TypedContractMethod<[
        assetAddress: AddressLike,
        amount: BigNumberish,
        to: AddressLike
    ], [
        void
    ], "nonpayable">;
    getEvent(key: "AtomicClaimed"): TypedContractEvent<AtomicClaimedEvent.InputTuple, AtomicClaimedEvent.OutputTuple, AtomicClaimedEvent.OutputObject>;
    getEvent(key: "AtomicLocked"): TypedContractEvent<AtomicLockedEvent.InputTuple, AtomicLockedEvent.OutputTuple, AtomicLockedEvent.OutputObject>;
    getEvent(key: "AtomicRedeemed"): TypedContractEvent<AtomicRedeemedEvent.InputTuple, AtomicRedeemedEvent.OutputTuple, AtomicRedeemedEvent.OutputObject>;
    getEvent(key: "AtomicRefunded"): TypedContractEvent<AtomicRefundedEvent.InputTuple, AtomicRefundedEvent.OutputTuple, AtomicRefundedEvent.OutputObject>;
    getEvent(key: "Initialized"): TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
    getEvent(key: "NewAssetTransaction"): TypedContractEvent<NewAssetTransactionEvent.InputTuple, NewAssetTransactionEvent.OutputTuple, NewAssetTransactionEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "Trade"): TypedContractEvent<TradeEvent.InputTuple, TradeEvent.OutputTuple, TradeEvent.OutputObject>;
    filters: {
        "AtomicClaimed(address,address,bytes)": TypedContractEvent<AtomicClaimedEvent.InputTuple, AtomicClaimedEvent.OutputTuple, AtomicClaimedEvent.OutputObject>;
        AtomicClaimed: TypedContractEvent<AtomicClaimedEvent.InputTuple, AtomicClaimedEvent.OutputTuple, AtomicClaimedEvent.OutputObject>;
        "AtomicLocked(address,address,bytes32)": TypedContractEvent<AtomicLockedEvent.InputTuple, AtomicLockedEvent.OutputTuple, AtomicLockedEvent.OutputObject>;
        AtomicLocked: TypedContractEvent<AtomicLockedEvent.InputTuple, AtomicLockedEvent.OutputTuple, AtomicLockedEvent.OutputObject>;
        "AtomicRedeemed(address,address,address,bytes)": TypedContractEvent<AtomicRedeemedEvent.InputTuple, AtomicRedeemedEvent.OutputTuple, AtomicRedeemedEvent.OutputObject>;
        AtomicRedeemed: TypedContractEvent<AtomicRedeemedEvent.InputTuple, AtomicRedeemedEvent.OutputTuple, AtomicRedeemedEvent.OutputObject>;
        "AtomicRefunded(address,address,bytes32)": TypedContractEvent<AtomicRefundedEvent.InputTuple, AtomicRefundedEvent.OutputTuple, AtomicRefundedEvent.OutputObject>;
        AtomicRefunded: TypedContractEvent<AtomicRefundedEvent.InputTuple, AtomicRefundedEvent.OutputTuple, AtomicRefundedEvent.OutputObject>;
        "Initialized(uint8)": TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        Initialized: TypedContractEvent<InitializedEvent.InputTuple, InitializedEvent.OutputTuple, InitializedEvent.OutputObject>;
        "NewAssetTransaction(address,address,address,bool,uint112,uint64)": TypedContractEvent<NewAssetTransactionEvent.InputTuple, NewAssetTransactionEvent.OutputTuple, NewAssetTransactionEvent.OutputObject>;
        NewAssetTransaction: TypedContractEvent<NewAssetTransactionEvent.InputTuple, NewAssetTransactionEvent.OutputTuple, NewAssetTransactionEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "Trade(address,address,address,address,uint64,uint192,uint192,bytes32)": TypedContractEvent<TradeEvent.InputTuple, TradeEvent.OutputTuple, TradeEvent.OutputObject>;
        Trade: TypedContractEvent<TradeEvent.InputTuple, TradeEvent.OutputTuple, TradeEvent.OutputObject>;
    };
}
