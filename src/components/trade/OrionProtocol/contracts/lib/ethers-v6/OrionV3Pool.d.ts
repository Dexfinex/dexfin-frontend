import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export type CurrentInfoStruct = {
    totalAmount: BigNumberish;
    amount: BigNumberish;
    pool: BigNumberish;
    swap: BigNumberish;
    indexFrom: BigNumberish;
    indexTo: BigNumberish;
    index: BigNumberish;
    totalOrders: BigNumberish;
};
export type CurrentInfoStructOutput = [
    totalAmount: bigint,
    amount: bigint,
    pool: bigint,
    swap: bigint,
    indexFrom: bigint,
    indexTo: bigint,
    index: bigint,
    totalOrders: bigint
] & {
    totalAmount: bigint;
    amount: bigint;
    pool: bigint;
    swap: bigint;
    indexFrom: bigint;
    indexTo: bigint;
    index: bigint;
    totalOrders: bigint;
};
export type OrderDataStruct = {
    amountLow: BigNumberish;
    feeLow: BigNumberish;
    indexFrom: BigNumberish;
    indexTo: BigNumberish;
    OrdersCounter: BigNumberish;
    amountHigh: BigNumberish;
    feeHigh: BigNumberish;
    disable: BigNumberish;
    collectFee: BigNumberish;
};
export type OrderDataStructOutput = [
    amountLow: bigint,
    feeLow: bigint,
    indexFrom: bigint,
    indexTo: bigint,
    OrdersCounter: bigint,
    amountHigh: bigint,
    feeHigh: bigint,
    disable: bigint,
    collectFee: bigint
] & {
    amountLow: bigint;
    feeLow: bigint;
    indexFrom: bigint;
    indexTo: bigint;
    OrdersCounter: bigint;
    amountHigh: bigint;
    feeHigh: bigint;
    disable: bigint;
    collectFee: bigint;
};
export type PoolInfoStruct = {
    token0: AddressLike;
    token1: AddressLike;
    fee: BigNumberish;
    tickMultiplier: BigNumberish;
    denominator0: BigNumberish;
    denominator1: BigNumberish;
};
export type PoolInfoStructOutput = [
    token0: string,
    token1: string,
    fee: bigint,
    tickMultiplier: bigint,
    denominator0: bigint,
    denominator1: bigint
] & {
    token0: string;
    token1: string;
    fee: bigint;
    tickMultiplier: bigint;
    denominator0: bigint;
    denominator1: bigint;
};
export type TWItemStruct = {
    priceTime: BigNumberish;
    priceTW: BigNumberish;
};
export type TWItemStructOutput = [priceTime: bigint, priceTW: bigint] & {
    priceTime: bigint;
    priceTW: bigint;
};
export type OrderViewStruct = {
    amount: BigNumberish;
    fee: BigNumberish;
    collectFee: BigNumberish;
    indexFrom: BigNumberish;
    indexTo: BigNumberish;
    disable: BigNumberish;
};
export type OrderViewStructOutput = [
    amount: bigint,
    fee: bigint,
    collectFee: bigint,
    indexFrom: bigint,
    indexTo: bigint,
    disable: bigint
] & {
    amount: bigint;
    fee: bigint;
    collectFee: bigint;
    indexFrom: bigint;
    indexTo: bigint;
    disable: bigint;
};
export interface OrionV3PoolInterface extends Interface {
    getFunction(nameOrSignature: "GetAvgRate" | "MAX_AMOUNT" | "MAX_TICK" | "addCounter" | "addLiqByIndex" | "addLiqToTick" | "addTickAmount" | "burn" | "calcAmount0" | "calcAmount1" | "calcAmounts" | "collect" | "collectProtocol" | "decreaseLiquidity" | "doTestLog2" | "doTestLog3" | "do_calcAmount0" | "do_calcAmount1" | "factory" | "getCurrent" | "getExp2" | "getExp3" | "getExp3_2" | "getIndex" | "getIndexByRate" | "getIntegralRate128" | "getLog2" | "getLog3" | "getLog4" | "getMagic_a1" | "getMagic_math" | "getMapBits" | "getNextTick" | "getOracle" | "getOrder" | "getPoolInfo" | "getPriceTick" | "getRateByIndex" | "getRateByIndex128" | "getRootBits" | "getTWAP" | "getTWAPPos" | "increaseLiquidity" | "initialize" | "isInit" | "isLock" | "listAmount" | "listBitmap" | "listCumulFee" | "listFee" | "listOrder" | "listTWAP" | "mint" | "removeCounter" | "removeLiq" | "removeLiqFromTick" | "setFee" | "setTickAmount" | "speed_Integral" | "speed_getIndex" | "speed_getNextTick" | "speed_getRate" | "swap" | "swap1" | "swap2" | "totalFee"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Burn" | "Collect" | "CollectProtocol" | "Initialize" | "Mint" | "Swap"): EventFragment;
    encodeFunctionData(functionFragment: "GetAvgRate", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "MAX_AMOUNT", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_TICK", values?: undefined): string;
    encodeFunctionData(functionFragment: "addCounter", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "addLiqByIndex", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "addLiqToTick", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "addTickAmount", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "burn", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "calcAmount0", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "calcAmount1", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "calcAmounts", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "collect", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "collectProtocol", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "decreaseLiquidity", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "doTestLog2", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "doTestLog3", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "do_calcAmount0", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "do_calcAmount1", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "factory", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrent", values?: undefined): string;
    encodeFunctionData(functionFragment: "getExp2", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getExp3", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getExp3_2", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getIndex", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getIndexByRate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getIntegralRate128", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getLog2", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getLog3", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getLog4", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getMagic_a1", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMagic_math", values?: undefined): string;
    encodeFunctionData(functionFragment: "getMapBits", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getNextTick", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getOracle", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getOrder", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getPoolInfo", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPriceTick", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRateByIndex", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRateByIndex128", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRootBits", values?: undefined): string;
    encodeFunctionData(functionFragment: "getTWAP", values?: undefined): string;
    encodeFunctionData(functionFragment: "getTWAPPos", values?: undefined): string;
    encodeFunctionData(functionFragment: "increaseLiquidity", values: [AddressLike, BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "initialize", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "isInit", values?: undefined): string;
    encodeFunctionData(functionFragment: "isLock", values?: undefined): string;
    encodeFunctionData(functionFragment: "listAmount", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listBitmap", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listCumulFee", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listFee", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listOrder", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listTWAP", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "mint", values: [AddressLike, BigNumberish, BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "removeCounter", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "removeLiq", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "removeLiqFromTick", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setTickAmount", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "speed_Integral", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "speed_getIndex", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "speed_getNextTick", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "speed_getRate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "swap", values: [AddressLike, boolean, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "swap1", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "swap2", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "totalFee", values?: undefined): string;
    decodeFunctionResult(functionFragment: "GetAvgRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_AMOUNT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_TICK", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addCounter", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addLiqByIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addLiqToTick", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addTickAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcAmount0", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcAmount1", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcAmounts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "collectProtocol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decreaseLiquidity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "doTestLog2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "doTestLog3", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "do_calcAmount0", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "do_calcAmount1", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getExp2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getExp3", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getExp3_2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIndexByRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getIntegralRate128", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLog2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLog3", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLog4", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMagic_a1", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMagic_math", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getMapBits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextTick", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOrder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPoolInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPriceTick", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateByIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateByIndex128", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRootBits", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTWAP", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTWAPPos", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increaseLiquidity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isInit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isLock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listBitmap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listCumulFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listOrder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listTWAP", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeCounter", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeLiq", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeLiqFromTick", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTickAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "speed_Integral", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "speed_getIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "speed_getNextTick", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "speed_getRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swap1", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "swap2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalFee", data: BytesLike): Result;
}
export declare namespace BurnEvent {
    type InputTuple = [
        owner: AddressLike,
        recipient: AddressLike,
        orderId: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish,
        amount: BigNumberish,
        amount0: BigNumberish,
        amount1: BigNumberish
    ];
    type OutputTuple = [
        owner: string,
        recipient: string,
        orderId: bigint,
        indexFrom: bigint,
        indexTo: bigint,
        amount: bigint,
        amount0: bigint,
        amount1: bigint
    ];
    interface OutputObject {
        owner: string;
        recipient: string;
        orderId: bigint;
        indexFrom: bigint;
        indexTo: bigint;
        amount: bigint;
        amount0: bigint;
        amount1: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace CollectEvent {
    type InputTuple = [
        owner: AddressLike,
        recipient: AddressLike,
        orderId: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish,
        amount0: BigNumberish
    ];
    type OutputTuple = [
        owner: string,
        recipient: string,
        orderId: bigint,
        indexFrom: bigint,
        indexTo: bigint,
        amount0: bigint
    ];
    interface OutputObject {
        owner: string;
        recipient: string;
        orderId: bigint;
        indexFrom: bigint;
        indexTo: bigint;
        amount0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace CollectProtocolEvent {
    type InputTuple = [
        sender: AddressLike,
        recipient: AddressLike,
        amount0: BigNumberish
    ];
    type OutputTuple = [
        sender: string,
        recipient: string,
        amount0: bigint
    ];
    interface OutputObject {
        sender: string;
        recipient: string;
        amount0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace InitializeEvent {
    type InputTuple = [index: BigNumberish];
    type OutputTuple = [index: bigint];
    interface OutputObject {
        index: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace MintEvent {
    type InputTuple = [
        sender: AddressLike,
        recipient: AddressLike,
        orderId: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish,
        amount: BigNumberish,
        amount0: BigNumberish,
        amount1: BigNumberish,
        time: BigNumberish
    ];
    type OutputTuple = [
        sender: string,
        recipient: string,
        orderId: bigint,
        indexFrom: bigint,
        indexTo: bigint,
        amount: bigint,
        amount0: bigint,
        amount1: bigint,
        time: bigint
    ];
    interface OutputObject {
        sender: string;
        recipient: string;
        orderId: bigint;
        indexFrom: bigint;
        indexTo: bigint;
        amount: bigint;
        amount0: bigint;
        amount1: bigint;
        time: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace SwapEvent {
    type InputTuple = [
        sender: AddressLike,
        recipient: AddressLike,
        amount0: BigNumberish,
        amount1: BigNumberish,
        liquidity: BigNumberish,
        index: BigNumberish
    ];
    type OutputTuple = [
        sender: string,
        recipient: string,
        amount0: bigint,
        amount1: bigint,
        liquidity: bigint,
        index: bigint
    ];
    interface OutputObject {
        sender: string;
        recipient: string;
        amount0: bigint;
        amount1: bigint;
        liquidity: bigint;
        index: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionV3Pool extends BaseContract {
    connect(runner?: ContractRunner | null): OrionV3Pool;
    waitForDeployment(): Promise<this>;
    interface: OrionV3PoolInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    GetAvgRate: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint
    ], "view">;
    MAX_AMOUNT: TypedContractMethod<[], [bigint], "view">;
    MAX_TICK: TypedContractMethod<[], [bigint], "view">;
    addCounter: TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    addLiqByIndex: TypedContractMethod<[
        amount0: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish
    ], [
        void
    ], "nonpayable">;
    addLiqToTick: TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    addTickAmount: TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    burn: TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            liquidity: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    calcAmount0: TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    calcAmount1: TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    calcAmounts: TypedContractMethod<[
        amount: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "view">;
    collect: TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    collectProtocol: TypedContractMethod<[
        recipient: AddressLike
    ], [
        bigint
    ], "nonpayable">;
    decreaseLiquidity: TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish,
        amount: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            liquidity: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    doTestLog2: TypedContractMethod<[x: BigNumberish], [void], "nonpayable">;
    doTestLog3: TypedContractMethod<[x: BigNumberish], [void], "nonpayable">;
    do_calcAmount0: TypedContractMethod<[
        index: BigNumberish
    ], [
        void
    ], "nonpayable">;
    do_calcAmount1: TypedContractMethod<[
        index: BigNumberish
    ], [
        void
    ], "nonpayable">;
    factory: TypedContractMethod<[], [string], "view">;
    getCurrent: TypedContractMethod<[], [CurrentInfoStructOutput], "view">;
    getExp2: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getExp3: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getExp3_2: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getIndex: TypedContractMethod<[rate: BigNumberish], [bigint], "view">;
    getIndexByRate: TypedContractMethod<[rate: BigNumberish], [bigint], "view">;
    getIntegralRate128: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint
    ], "view">;
    getLog2: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getLog3: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getLog4: TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getMagic_a1: TypedContractMethod<[], [bigint], "view">;
    getMagic_math: TypedContractMethod<[], [bigint], "view">;
    getMapBits: TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getNextTick: TypedContractMethod<[
        index: BigNumberish,
        direct: BigNumberish
    ], [
        bigint
    ], "view">;
    getOracle: TypedContractMethod<[secondsAgo: BigNumberish], [bigint], "view">;
    getOrder: TypedContractMethod<[
        owner: AddressLike,
        index: BigNumberish
    ], [
        OrderDataStructOutput
    ], "view">;
    getPoolInfo: TypedContractMethod<[], [PoolInfoStructOutput], "view">;
    getPriceTick: TypedContractMethod<[], [bigint], "view">;
    getRateByIndex: TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getRateByIndex128: TypedContractMethod<[
        index: BigNumberish
    ], [
        bigint
    ], "view">;
    getRootBits: TypedContractMethod<[], [bigint], "view">;
    getTWAP: TypedContractMethod<[], [TWItemStructOutput], "view">;
    getTWAPPos: TypedContractMethod<[], [bigint], "view">;
    increaseLiquidity: TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish,
        amount: BigNumberish,
        data: BytesLike
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    initialize: TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    isInit: TypedContractMethod<[], [boolean], "view">;
    isLock: TypedContractMethod<[], [bigint], "view">;
    listAmount: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    listBitmap: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    listCumulFee: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    listFee: TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    listOrder: TypedContractMethod<[
        owner: AddressLike,
        indexFrom: BigNumberish,
        count: BigNumberish
    ], [
        OrderViewStructOutput[]
    ], "view">;
    listTWAP: TypedContractMethod<[
        indexFrom: BigNumberish,
        count: BigNumberish
    ], [
        TWItemStructOutput[]
    ], "view">;
    mint: TypedContractMethod<[
        recipient: AddressLike,
        indexFrom: BigNumberish,
        indexTo: BigNumberish,
        amount: BigNumberish,
        data: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            amount0: bigint;
            amount1: bigint;
            id: bigint;
        }
    ], "nonpayable">;
    removeCounter: TypedContractMethod<[
        index: BigNumberish
    ], [
        void
    ], "nonpayable">;
    removeLiq: TypedContractMethod<[
        orderIndex: BigNumberish
    ], [
        void
    ], "nonpayable">;
    removeLiqFromTick: TypedContractMethod<[
        index: BigNumberish,
        removeAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setFee: TypedContractMethod<[fee: BigNumberish], [void], "nonpayable">;
    setTickAmount: TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    speed_Integral: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        void
    ], "nonpayable">;
    speed_getIndex: TypedContractMethod<[
        rate0: BigNumberish
    ], [
        void
    ], "nonpayable">;
    speed_getNextTick: TypedContractMethod<[
        index: BigNumberish,
        direct: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    speed_getRate: TypedContractMethod<[
        index: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swap: TypedContractMethod<[
        recipient: AddressLike,
        zeroForOne: boolean,
        amountSpecified: BigNumberish,
        data: BytesLike
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    swap1: TypedContractMethod<[
        amount0: BigNumberish,
        direct: BigNumberish
    ], [
        void
    ], "nonpayable">;
    swap2: TypedContractMethod<[
        amount0: BigNumberish,
        amount1: BigNumberish,
        direct: BigNumberish
    ], [
        void
    ], "nonpayable">;
    totalFee: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "GetAvgRate"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "MAX_AMOUNT"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_TICK"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "addCounter"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "addLiqByIndex"): TypedContractMethod<[
        amount0: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "addLiqToTick"): TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "addTickAmount"): TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "burn"): TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            liquidity: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "calcAmount0"): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "calcAmount1"): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "calcAmounts"): TypedContractMethod<[
        amount: BigNumberish,
        indexFrom: BigNumberish,
        indexTo: BigNumberish
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "collect"): TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "collectProtocol"): TypedContractMethod<[recipient: AddressLike], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "decreaseLiquidity"): TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish,
        amount: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            liquidity: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "doTestLog2"): TypedContractMethod<[x: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "doTestLog3"): TypedContractMethod<[x: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "do_calcAmount0"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "do_calcAmount1"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "factory"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getCurrent"): TypedContractMethod<[], [CurrentInfoStructOutput], "view">;
    getFunction(nameOrSignature: "getExp2"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getExp3"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getExp3_2"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getIndex"): TypedContractMethod<[rate: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getIndexByRate"): TypedContractMethod<[rate: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getIntegralRate128"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getLog2"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getLog3"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getLog4"): TypedContractMethod<[x: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getMagic_a1"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getMagic_math"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getMapBits"): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getNextTick"): TypedContractMethod<[
        index: BigNumberish,
        direct: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getOracle"): TypedContractMethod<[secondsAgo: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getOrder"): TypedContractMethod<[
        owner: AddressLike,
        index: BigNumberish
    ], [
        OrderDataStructOutput
    ], "view">;
    getFunction(nameOrSignature: "getPoolInfo"): TypedContractMethod<[], [PoolInfoStructOutput], "view">;
    getFunction(nameOrSignature: "getPriceTick"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getRateByIndex"): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getRateByIndex128"): TypedContractMethod<[index: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getRootBits"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getTWAP"): TypedContractMethod<[], [TWItemStructOutput], "view">;
    getFunction(nameOrSignature: "getTWAPPos"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "increaseLiquidity"): TypedContractMethod<[
        recipient: AddressLike,
        orderIndex: BigNumberish,
        amount: BigNumberish,
        data: BytesLike
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "isInit"): TypedContractMethod<[], [boolean], "view">;
    getFunction(nameOrSignature: "isLock"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "listAmount"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "listBitmap"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "listCumulFee"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "listFee"): TypedContractMethod<[
        from: BigNumberish,
        to: BigNumberish
    ], [
        bigint[]
    ], "view">;
    getFunction(nameOrSignature: "listOrder"): TypedContractMethod<[
        owner: AddressLike,
        indexFrom: BigNumberish,
        count: BigNumberish
    ], [
        OrderViewStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "listTWAP"): TypedContractMethod<[
        indexFrom: BigNumberish,
        count: BigNumberish
    ], [
        TWItemStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        recipient: AddressLike,
        indexFrom: BigNumberish,
        indexTo: BigNumberish,
        amount: BigNumberish,
        data: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            amount0: bigint;
            amount1: bigint;
            id: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "removeCounter"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeLiq"): TypedContractMethod<[orderIndex: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeLiqFromTick"): TypedContractMethod<[
        index: BigNumberish,
        removeAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setFee"): TypedContractMethod<[fee: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setTickAmount"): TypedContractMethod<[
        index: BigNumberish,
        addAmount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "speed_Integral"): TypedContractMethod<[arg0: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "speed_getIndex"): TypedContractMethod<[rate0: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "speed_getNextTick"): TypedContractMethod<[
        index: BigNumberish,
        direct: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "speed_getRate"): TypedContractMethod<[index: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "swap"): TypedContractMethod<[
        recipient: AddressLike,
        zeroForOne: boolean,
        amountSpecified: BigNumberish,
        data: BytesLike
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "swap1"): TypedContractMethod<[
        amount0: BigNumberish,
        direct: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "swap2"): TypedContractMethod<[
        amount0: BigNumberish,
        amount1: BigNumberish,
        direct: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "totalFee"): TypedContractMethod<[], [bigint], "view">;
    getEvent(key: "Burn"): TypedContractEvent<BurnEvent.InputTuple, BurnEvent.OutputTuple, BurnEvent.OutputObject>;
    getEvent(key: "Collect"): TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
    getEvent(key: "CollectProtocol"): TypedContractEvent<CollectProtocolEvent.InputTuple, CollectProtocolEvent.OutputTuple, CollectProtocolEvent.OutputObject>;
    getEvent(key: "Initialize"): TypedContractEvent<InitializeEvent.InputTuple, InitializeEvent.OutputTuple, InitializeEvent.OutputObject>;
    getEvent(key: "Mint"): TypedContractEvent<MintEvent.InputTuple, MintEvent.OutputTuple, MintEvent.OutputObject>;
    getEvent(key: "Swap"): TypedContractEvent<SwapEvent.InputTuple, SwapEvent.OutputTuple, SwapEvent.OutputObject>;
    filters: {
        "Burn(address,address,uint32,int24,int24,uint256,uint256,uint256)": TypedContractEvent<BurnEvent.InputTuple, BurnEvent.OutputTuple, BurnEvent.OutputObject>;
        Burn: TypedContractEvent<BurnEvent.InputTuple, BurnEvent.OutputTuple, BurnEvent.OutputObject>;
        "Collect(address,address,uint32,int24,int24,uint256)": TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
        Collect: TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
        "CollectProtocol(address,address,uint256)": TypedContractEvent<CollectProtocolEvent.InputTuple, CollectProtocolEvent.OutputTuple, CollectProtocolEvent.OutputObject>;
        CollectProtocol: TypedContractEvent<CollectProtocolEvent.InputTuple, CollectProtocolEvent.OutputTuple, CollectProtocolEvent.OutputObject>;
        "Initialize(int24)": TypedContractEvent<InitializeEvent.InputTuple, InitializeEvent.OutputTuple, InitializeEvent.OutputObject>;
        Initialize: TypedContractEvent<InitializeEvent.InputTuple, InitializeEvent.OutputTuple, InitializeEvent.OutputObject>;
        "Mint(address,address,uint32,int24,int24,uint256,uint256,uint256,uint48)": TypedContractEvent<MintEvent.InputTuple, MintEvent.OutputTuple, MintEvent.OutputObject>;
        Mint: TypedContractEvent<MintEvent.InputTuple, MintEvent.OutputTuple, MintEvent.OutputObject>;
        "Swap(address,address,uint256,uint256,int128,int128)": TypedContractEvent<SwapEvent.InputTuple, SwapEvent.OutputTuple, SwapEvent.OutputObject>;
        Swap: TypedContractEvent<SwapEvent.InputTuple, SwapEvent.OutputTuple, SwapEvent.OutputObject>;
    };
}
