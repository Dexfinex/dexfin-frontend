import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export declare namespace IOrionV3NFTManager {
    type ModifyLiqParamsStruct = {
        tokenId: BigNumberish;
        amount: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        deadline: BigNumberish;
    };
    type ModifyLiqParamsStructOutput = [
        tokenId: bigint,
        amount: bigint,
        amount0Min: bigint,
        amount1Min: bigint,
        deadline: bigint
    ] & {
        tokenId: bigint;
        amount: bigint;
        amount0Min: bigint;
        amount1Min: bigint;
        deadline: bigint;
    };
    type NFTOrderStruct = {
        key: BigNumberish;
        tokenId: BigNumberish;
        amount: BigNumberish;
        fee: BigNumberish;
        collectFee: BigNumberish;
        indexFrom: BigNumberish;
        indexTo: BigNumberish;
        disable: BigNumberish;
        pool: AddressLike;
        token0: AddressLike;
        token1: AddressLike;
        poolFee: BigNumberish;
        tickMultiplier: BigNumberish;
        denominator0: BigNumberish;
        denominator1: BigNumberish;
        amount0: BigNumberish;
        amount1: BigNumberish;
    };
    type NFTOrderStructOutput = [
        key: bigint,
        tokenId: bigint,
        amount: bigint,
        fee: bigint,
        collectFee: bigint,
        indexFrom: bigint,
        indexTo: bigint,
        disable: bigint,
        pool: string,
        token0: string,
        token1: string,
        poolFee: bigint,
        tickMultiplier: bigint,
        denominator0: bigint,
        denominator1: bigint,
        amount0: bigint,
        amount1: bigint
    ] & {
        key: bigint;
        tokenId: bigint;
        amount: bigint;
        fee: bigint;
        collectFee: bigint;
        indexFrom: bigint;
        indexTo: bigint;
        disable: bigint;
        pool: string;
        token0: string;
        token1: string;
        poolFee: bigint;
        tickMultiplier: bigint;
        denominator0: bigint;
        denominator1: bigint;
        amount0: bigint;
        amount1: bigint;
    };
    type MintParamsStruct = {
        token0: AddressLike;
        token1: AddressLike;
        fee: BigNumberish;
        indexFrom: BigNumberish;
        indexTo: BigNumberish;
        amount: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        deadline: BigNumberish;
    };
    type MintParamsStructOutput = [
        token0: string,
        token1: string,
        fee: bigint,
        indexFrom: bigint,
        indexTo: bigint,
        amount: bigint,
        amount0Min: bigint,
        amount1Min: bigint,
        deadline: bigint
    ] & {
        token0: string;
        token1: string;
        fee: bigint;
        indexFrom: bigint;
        indexTo: bigint;
        amount: bigint;
        amount0Min: bigint;
        amount1Min: bigint;
        deadline: bigint;
    };
}
export declare namespace KeyList {
    type SItemValueStruct = {
        key: BigNumberish;
        value: BigNumberish;
    };
    type SItemValueStructOutput = [key: bigint, value: bigint] & {
        key: bigint;
        value: bigint;
    };
}
export interface OrionV3NFTManagerInterface extends Interface {
    getFunction(nameOrSignature: "DOMAIN_SEPARATOR" | "PERMIT_TYPEHASH" | "WETH9" | "approve" | "balanceOf" | "baseTokenURI" | "baseURI" | "burn" | "burnByKey" | "collect" | "collectList" | "createAndInitializePoolIfNecessary" | "decreaseLiquidity" | "factory" | "getApproved" | "increaseLiquidity" | "isApprovedForAll" | "listNFT" | "listNFTOrder" | "listPermit" | "mint" | "multicall" | "name" | "ownerOf" | "permit" | "refundETH" | "safeTransferFrom(address,address,uint256)" | "safeTransferFrom(address,address,uint256,bytes)" | "selfPermit" | "selfPermitAllowed" | "selfPermitAllowedIfNecessary" | "selfPermitIfNecessary" | "setApprovalForAll" | "setNFTDescriptor" | "supportsInterface" | "sweepToken" | "symbol" | "tokenDescriptor" | "tokenURI" | "transferFrom" | "uniswapV3MintCallback" | "unwrapWETH9"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "Approval" | "ApprovalForAll" | "Collect" | "DecreaseLiquidity" | "IncreaseLiquidity" | "Transfer"): EventFragment;
    encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
    encodeFunctionData(functionFragment: "PERMIT_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "WETH9", values?: undefined): string;
    encodeFunctionData(functionFragment: "approve", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "balanceOf", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "baseTokenURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "baseURI", values?: undefined): string;
    encodeFunctionData(functionFragment: "burn", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "burnByKey", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "collect", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "collectList", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "createAndInitializePoolIfNecessary", values: [AddressLike, AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "decreaseLiquidity", values: [IOrionV3NFTManager.ModifyLiqParamsStruct]): string;
    encodeFunctionData(functionFragment: "factory", values?: undefined): string;
    encodeFunctionData(functionFragment: "getApproved", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "increaseLiquidity", values: [IOrionV3NFTManager.ModifyLiqParamsStruct]): string;
    encodeFunctionData(functionFragment: "isApprovedForAll", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "listNFT", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listNFTOrder", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listPermit", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "mint", values: [IOrionV3NFTManager.MintParamsStruct]): string;
    encodeFunctionData(functionFragment: "multicall", values: [BytesLike[]]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "ownerOf", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "permit", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "refundETH", values?: undefined): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256)", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", values: [AddressLike, AddressLike, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "selfPermit", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "selfPermitAllowed", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "selfPermitAllowedIfNecessary", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "selfPermitIfNecessary", values: [
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BytesLike,
        BytesLike
    ]): string;
    encodeFunctionData(functionFragment: "setApprovalForAll", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "setNFTDescriptor", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "sweepToken", values: [AddressLike, BigNumberish, AddressLike]): string;
    encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenDescriptor", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokenURI", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferFrom", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "uniswapV3MintCallback", values: [BigNumberish, BigNumberish, BytesLike]): string;
    encodeFunctionData(functionFragment: "unwrapWETH9", values: [BigNumberish, AddressLike]): string;
    decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "PERMIT_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "WETH9", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "baseTokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "baseURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burnByKey", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "collectList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createAndInitializePoolIfNecessary", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decreaseLiquidity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getApproved", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "increaseLiquidity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isApprovedForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listNFT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listNFTOrder", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "permit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "refundETH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "safeTransferFrom(address,address,uint256,bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfPermit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfPermitAllowed", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfPermitAllowedIfNecessary", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfPermitIfNecessary", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setApprovalForAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setNFTDescriptor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sweepToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenDescriptor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferFrom", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "uniswapV3MintCallback", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unwrapWETH9", data: BytesLike): Result;
}
export declare namespace ApprovalEvent {
    type InputTuple = [
        owner: AddressLike,
        approved: AddressLike,
        tokenId: BigNumberish
    ];
    type OutputTuple = [owner: string, approved: string, tokenId: bigint];
    interface OutputObject {
        owner: string;
        approved: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ApprovalForAllEvent {
    type InputTuple = [
        owner: AddressLike,
        operator: AddressLike,
        approved: boolean
    ];
    type OutputTuple = [
        owner: string,
        operator: string,
        approved: boolean
    ];
    interface OutputObject {
        owner: string;
        operator: string;
        approved: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace CollectEvent {
    type InputTuple = [
        tokenId: BigNumberish,
        recipient: AddressLike,
        amount0: BigNumberish
    ];
    type OutputTuple = [
        tokenId: bigint,
        recipient: string,
        amount0: bigint
    ];
    interface OutputObject {
        tokenId: bigint;
        recipient: string;
        amount0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace DecreaseLiquidityEvent {
    type InputTuple = [
        tokenId: BigNumberish,
        liquidity: BigNumberish,
        amount0: BigNumberish,
        amount1: BigNumberish
    ];
    type OutputTuple = [
        tokenId: bigint,
        liquidity: bigint,
        amount0: bigint,
        amount1: bigint
    ];
    interface OutputObject {
        tokenId: bigint;
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace IncreaseLiquidityEvent {
    type InputTuple = [
        tokenId: BigNumberish,
        liquidity: BigNumberish,
        amount0: BigNumberish,
        amount1: BigNumberish
    ];
    type OutputTuple = [
        tokenId: bigint,
        liquidity: bigint,
        amount0: bigint,
        amount1: bigint
    ];
    interface OutputObject {
        tokenId: bigint;
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TransferEvent {
    type InputTuple = [
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ];
    type OutputTuple = [from: string, to: string, tokenId: bigint];
    interface OutputObject {
        from: string;
        to: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionV3NFTManager extends BaseContract {
    connect(runner?: ContractRunner | null): OrionV3NFTManager;
    waitForDeployment(): Promise<this>;
    interface: OrionV3NFTManagerInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DOMAIN_SEPARATOR: TypedContractMethod<[], [string], "view">;
    PERMIT_TYPEHASH: TypedContractMethod<[], [string], "view">;
    WETH9: TypedContractMethod<[], [string], "view">;
    approve: TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;
    baseTokenURI: TypedContractMethod<[], [string], "view">;
    baseURI: TypedContractMethod<[], [string], "view">;
    burn: TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    burnByKey: TypedContractMethod<[key: BigNumberish], [void], "nonpayable">;
    collect: TypedContractMethod<[tokenId: BigNumberish], [bigint], "nonpayable">;
    collectList: TypedContractMethod<[
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        void
    ], "nonpayable">;
    createAndInitializePoolIfNecessary: TypedContractMethod<[
        token0: AddressLike,
        token1: AddressLike,
        fee: BigNumberish,
        tickStart: BigNumberish
    ], [
        string
    ], "payable">;
    decreaseLiquidity: TypedContractMethod<[
        params: IOrionV3NFTManager.ModifyLiqParamsStruct
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    factory: TypedContractMethod<[], [string], "view">;
    getApproved: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    increaseLiquidity: TypedContractMethod<[
        params: IOrionV3NFTManager.ModifyLiqParamsStruct
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "payable">;
    isApprovedForAll: TypedContractMethod<[
        owner: AddressLike,
        operator: AddressLike
    ], [
        boolean
    ], "view">;
    listNFT: TypedContractMethod<[
        owner: AddressLike,
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        KeyList.SItemValueStructOutput[]
    ], "view">;
    listNFTOrder: TypedContractMethod<[
        owner: AddressLike,
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        IOrionV3NFTManager.NFTOrderStructOutput[]
    ], "view">;
    listPermit: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [bigint, string] & {
            nonce: bigint;
            operator: string;
        }
    ], "view">;
    mint: TypedContractMethod<[
        params: IOrionV3NFTManager.MintParamsStruct
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            tokenId: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "payable">;
    multicall: TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;
    name: TypedContractMethod<[], [string], "view">;
    ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    permit: TypedContractMethod<[
        spender: AddressLike,
        tokenId: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    refundETH: TypedContractMethod<[], [void], "payable">;
    "safeTransferFrom(address,address,uint256)": TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    selfPermit: TypedContractMethod<[
        token: AddressLike,
        value: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    selfPermitAllowed: TypedContractMethod<[
        token: AddressLike,
        nonce: BigNumberish,
        expiry: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    selfPermitAllowedIfNecessary: TypedContractMethod<[
        token: AddressLike,
        nonce: BigNumberish,
        expiry: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    selfPermitIfNecessary: TypedContractMethod<[
        token: AddressLike,
        value: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    setApprovalForAll: TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    setNFTDescriptor: TypedContractMethod<[
        _tokenDescriptor: AddressLike
    ], [
        void
    ], "nonpayable">;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], "view">;
    sweepToken: TypedContractMethod<[
        token: AddressLike,
        amountMinimum: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "payable">;
    symbol: TypedContractMethod<[], [string], "view">;
    tokenDescriptor: TypedContractMethod<[], [string], "view">;
    tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    transferFrom: TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    uniswapV3MintCallback: TypedContractMethod<[
        amount0Owed: BigNumberish,
        amount1Owed: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    unwrapWETH9: TypedContractMethod<[
        amountMinimum: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "DOMAIN_SEPARATOR"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "PERMIT_TYPEHASH"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "WETH9"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "approve"): TypedContractMethod<[
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "balanceOf"): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "baseTokenURI"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "baseURI"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "burn"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "burnByKey"): TypedContractMethod<[key: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "collect"): TypedContractMethod<[tokenId: BigNumberish], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "collectList"): TypedContractMethod<[
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "createAndInitializePoolIfNecessary"): TypedContractMethod<[
        token0: AddressLike,
        token1: AddressLike,
        fee: BigNumberish,
        tickStart: BigNumberish
    ], [
        string
    ], "payable">;
    getFunction(nameOrSignature: "decreaseLiquidity"): TypedContractMethod<[
        params: IOrionV3NFTManager.ModifyLiqParamsStruct
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "nonpayable">;
    getFunction(nameOrSignature: "factory"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getApproved"): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "increaseLiquidity"): TypedContractMethod<[
        params: IOrionV3NFTManager.ModifyLiqParamsStruct
    ], [
        [bigint, bigint] & {
            amount0: bigint;
            amount1: bigint;
        }
    ], "payable">;
    getFunction(nameOrSignature: "isApprovedForAll"): TypedContractMethod<[
        owner: AddressLike,
        operator: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "listNFT"): TypedContractMethod<[
        owner: AddressLike,
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        KeyList.SItemValueStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "listNFTOrder"): TypedContractMethod<[
        owner: AddressLike,
        startKey: BigNumberish,
        counts: BigNumberish
    ], [
        IOrionV3NFTManager.NFTOrderStructOutput[]
    ], "view">;
    getFunction(nameOrSignature: "listPermit"): TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [bigint, string] & {
            nonce: bigint;
            operator: string;
        }
    ], "view">;
    getFunction(nameOrSignature: "mint"): TypedContractMethod<[
        params: IOrionV3NFTManager.MintParamsStruct
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            tokenId: bigint;
            amount0: bigint;
            amount1: bigint;
        }
    ], "payable">;
    getFunction(nameOrSignature: "multicall"): TypedContractMethod<[data: BytesLike[]], [string[]], "payable">;
    getFunction(nameOrSignature: "name"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "ownerOf"): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "permit"): TypedContractMethod<[
        spender: AddressLike,
        tokenId: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "refundETH"): TypedContractMethod<[], [void], "payable">;
    getFunction(nameOrSignature: "safeTransferFrom(address,address,uint256)"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "selfPermit"): TypedContractMethod<[
        token: AddressLike,
        value: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "selfPermitAllowed"): TypedContractMethod<[
        token: AddressLike,
        nonce: BigNumberish,
        expiry: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "selfPermitAllowedIfNecessary"): TypedContractMethod<[
        token: AddressLike,
        nonce: BigNumberish,
        expiry: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "selfPermitIfNecessary"): TypedContractMethod<[
        token: AddressLike,
        value: BigNumberish,
        deadline: BigNumberish,
        v: BigNumberish,
        r: BytesLike,
        s: BytesLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "setApprovalForAll"): TypedContractMethod<[
        operator: AddressLike,
        approved: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setNFTDescriptor"): TypedContractMethod<[_tokenDescriptor: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "sweepToken"): TypedContractMethod<[
        token: AddressLike,
        amountMinimum: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "payable">;
    getFunction(nameOrSignature: "symbol"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "tokenDescriptor"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "tokenURI"): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "transferFrom"): TypedContractMethod<[
        from: AddressLike,
        to: AddressLike,
        tokenId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "uniswapV3MintCallback"): TypedContractMethod<[
        amount0Owed: BigNumberish,
        amount1Owed: BigNumberish,
        data: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "unwrapWETH9"): TypedContractMethod<[
        amountMinimum: BigNumberish,
        recipient: AddressLike
    ], [
        void
    ], "payable">;
    getEvent(key: "Approval"): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
    getEvent(key: "ApprovalForAll"): TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
    getEvent(key: "Collect"): TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
    getEvent(key: "DecreaseLiquidity"): TypedContractEvent<DecreaseLiquidityEvent.InputTuple, DecreaseLiquidityEvent.OutputTuple, DecreaseLiquidityEvent.OutputObject>;
    getEvent(key: "IncreaseLiquidity"): TypedContractEvent<IncreaseLiquidityEvent.InputTuple, IncreaseLiquidityEvent.OutputTuple, IncreaseLiquidityEvent.OutputObject>;
    getEvent(key: "Transfer"): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    filters: {
        "Approval(address,address,uint256)": TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
        Approval: TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
        "ApprovalForAll(address,address,bool)": TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
        ApprovalForAll: TypedContractEvent<ApprovalForAllEvent.InputTuple, ApprovalForAllEvent.OutputTuple, ApprovalForAllEvent.OutputObject>;
        "Collect(uint256,address,uint256)": TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
        Collect: TypedContractEvent<CollectEvent.InputTuple, CollectEvent.OutputTuple, CollectEvent.OutputObject>;
        "DecreaseLiquidity(uint256,uint128,uint256,uint256)": TypedContractEvent<DecreaseLiquidityEvent.InputTuple, DecreaseLiquidityEvent.OutputTuple, DecreaseLiquidityEvent.OutputObject>;
        DecreaseLiquidity: TypedContractEvent<DecreaseLiquidityEvent.InputTuple, DecreaseLiquidityEvent.OutputTuple, DecreaseLiquidityEvent.OutputObject>;
        "IncreaseLiquidity(uint256,uint128,uint256,uint256)": TypedContractEvent<IncreaseLiquidityEvent.InputTuple, IncreaseLiquidityEvent.OutputTuple, IncreaseLiquidityEvent.OutputObject>;
        IncreaseLiquidity: TypedContractEvent<IncreaseLiquidityEvent.InputTuple, IncreaseLiquidityEvent.OutputTuple, IncreaseLiquidityEvent.OutputObject>;
        "Transfer(address,address,uint256)": TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
        Transfer: TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
    };
}
