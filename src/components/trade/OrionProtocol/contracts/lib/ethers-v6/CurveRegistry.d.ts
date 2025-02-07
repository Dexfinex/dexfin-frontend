import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface CurveRegistryInterface extends Interface {
    getFunction(nameOrSignature: "find_pool_for_coins(address,address)" | "find_pool_for_coins(address,address,uint256)" | "get_n_coins" | "get_coins" | "get_underlying_coins" | "get_decimals" | "get_underlying_decimals" | "get_rates" | "get_gauges" | "get_balances" | "get_underlying_balances" | "get_virtual_price_from_lp_token" | "get_A" | "get_parameters" | "get_fees" | "get_admin_balances" | "get_coin_indices" | "estimate_gas_used" | "is_meta" | "get_pool_name" | "get_coin_swap_count" | "get_coin_swap_complement" | "get_pool_asset_type" | "add_pool" | "add_pool_without_underlying" | "add_metapool(address,uint256,address,uint256,string)" | "add_metapool(address,uint256,address,uint256,string,address)" | "remove_pool" | "set_pool_gas_estimates" | "set_coin_gas_estimates" | "set_gas_estimate_contract" | "set_liquidity_gauges" | "set_pool_asset_type" | "batch_set_pool_asset_type" | "address_provider" | "gauge_controller" | "pool_list" | "pool_count" | "coin_count" | "get_coin" | "get_pool_from_lp_token" | "get_lp_token" | "last_updated"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "PoolAdded" | "PoolRemoved"): EventFragment;
    encodeFunctionData(functionFragment: "find_pool_for_coins(address,address)", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "find_pool_for_coins(address,address,uint256)", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "get_n_coins", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_coins", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_underlying_coins", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_decimals", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_underlying_decimals", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_rates", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_gauges", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_underlying_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_virtual_price_from_lp_token", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_A", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_parameters", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_fees", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_admin_balances", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_coin_indices", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "estimate_gas_used", values: [AddressLike, AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "is_meta", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_pool_name", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_coin_swap_count", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_coin_swap_complement", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "get_pool_asset_type", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "add_pool", values: [
        AddressLike,
        BigNumberish,
        AddressLike,
        BytesLike,
        BigNumberish,
        BigNumberish,
        boolean,
        boolean,
        string
    ]): string;
    encodeFunctionData(functionFragment: "add_pool_without_underlying", values: [
        AddressLike,
        BigNumberish,
        AddressLike,
        BytesLike,
        BigNumberish,
        BigNumberish,
        boolean,
        boolean,
        string
    ]): string;
    encodeFunctionData(functionFragment: "add_metapool(address,uint256,address,uint256,string)", values: [AddressLike, BigNumberish, AddressLike, BigNumberish, string]): string;
    encodeFunctionData(functionFragment: "add_metapool(address,uint256,address,uint256,string,address)", values: [
        AddressLike,
        BigNumberish,
        AddressLike,
        BigNumberish,
        string,
        AddressLike
    ]): string;
    encodeFunctionData(functionFragment: "remove_pool", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "set_pool_gas_estimates", values: [
        [
            AddressLike,
            AddressLike,
            AddressLike,
            AddressLike,
            AddressLike
        ],
        [
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ]
        ]
    ]): string;
    encodeFunctionData(functionFragment: "set_coin_gas_estimates", values: [AddressLike[], BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "set_gas_estimate_contract", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "set_liquidity_gauges", values: [AddressLike, AddressLike[]]): string;
    encodeFunctionData(functionFragment: "set_pool_asset_type", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "batch_set_pool_asset_type", values: [AddressLike[], BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "address_provider", values?: undefined): string;
    encodeFunctionData(functionFragment: "gauge_controller", values?: undefined): string;
    encodeFunctionData(functionFragment: "pool_list", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "pool_count", values?: undefined): string;
    encodeFunctionData(functionFragment: "coin_count", values?: undefined): string;
    encodeFunctionData(functionFragment: "get_coin", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "get_pool_from_lp_token", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_lp_token", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "last_updated", values?: undefined): string;
    decodeFunctionResult(functionFragment: "find_pool_for_coins(address,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "find_pool_for_coins(address,address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_n_coins", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_coins", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_underlying_coins", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_decimals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_underlying_decimals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_rates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_gauges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_underlying_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_virtual_price_from_lp_token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_A", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_parameters", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_fees", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_admin_balances", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_coin_indices", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "estimate_gas_used", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "is_meta", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_pool_name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_coin_swap_count", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_coin_swap_complement", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_pool_asset_type", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_pool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_pool_without_underlying", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_metapool(address,uint256,address,uint256,string)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_metapool(address,uint256,address,uint256,string,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "remove_pool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set_pool_gas_estimates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set_coin_gas_estimates", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set_gas_estimate_contract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set_liquidity_gauges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set_pool_asset_type", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "batch_set_pool_asset_type", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "address_provider", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_controller", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pool_list", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pool_count", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coin_count", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_coin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_pool_from_lp_token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_lp_token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "last_updated", data: BytesLike): Result;
}
export declare namespace PoolAddedEvent {
    type InputTuple = [pool: AddressLike, rate_method_id: BytesLike];
    type OutputTuple = [pool: string, rate_method_id: string];
    interface OutputObject {
        pool: string;
        rate_method_id: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace PoolRemovedEvent {
    type InputTuple = [pool: AddressLike];
    type OutputTuple = [pool: string];
    interface OutputObject {
        pool: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface CurveRegistry extends BaseContract {
    connect(runner?: ContractRunner | null): CurveRegistry;
    waitForDeployment(): Promise<this>;
    interface: CurveRegistryInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    "find_pool_for_coins(address,address)": TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike
    ], [
        string
    ], "view">;
    "find_pool_for_coins(address,address,uint256)": TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike,
        i: BigNumberish
    ], [
        string
    ], "view">;
    get_n_coins: TypedContractMethod<[
        _pool: AddressLike
    ], [
        [bigint, bigint]
    ], "view">;
    get_coins: TypedContractMethod<[_pool: AddressLike], [string[]], "view">;
    get_underlying_coins: TypedContractMethod<[
        _pool: AddressLike
    ], [
        string[]
    ], "view">;
    get_decimals: TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    get_underlying_decimals: TypedContractMethod<[
        _pool: AddressLike
    ], [
        bigint[]
    ], "view">;
    get_rates: TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    get_gauges: TypedContractMethod<[
        _pool: AddressLike
    ], [
        [string[], bigint[]]
    ], "view">;
    get_balances: TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    get_underlying_balances: TypedContractMethod<[
        _pool: AddressLike
    ], [
        bigint[]
    ], "view">;
    get_virtual_price_from_lp_token: TypedContractMethod<[
        _token: AddressLike
    ], [
        bigint
    ], "view">;
    get_A: TypedContractMethod<[_pool: AddressLike], [bigint], "view">;
    get_parameters: TypedContractMethod<[
        _pool: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            string,
            bigint,
            bigint,
            bigint
        ] & {
            A: bigint;
            future_A: bigint;
            fee: bigint;
            admin_fee: bigint;
            future_fee: bigint;
            future_admin_fee: bigint;
            future_owner: string;
            initial_A: bigint;
            initial_A_time: bigint;
            future_A_time: bigint;
        }
    ], "view">;
    get_fees: TypedContractMethod<[
        _pool: AddressLike
    ], [
        [bigint, bigint]
    ], "view">;
    get_admin_balances: TypedContractMethod<[
        _pool: AddressLike
    ], [
        bigint[]
    ], "view">;
    get_coin_indices: TypedContractMethod<[
        _pool: AddressLike,
        _from: AddressLike,
        _to: AddressLike
    ], [
        [bigint, bigint, boolean]
    ], "view">;
    estimate_gas_used: TypedContractMethod<[
        _pool: AddressLike,
        _from: AddressLike,
        _to: AddressLike
    ], [
        bigint
    ], "view">;
    is_meta: TypedContractMethod<[_pool: AddressLike], [boolean], "view">;
    get_pool_name: TypedContractMethod<[_pool: AddressLike], [string], "view">;
    get_coin_swap_count: TypedContractMethod<[
        _coin: AddressLike
    ], [
        bigint
    ], "view">;
    get_coin_swap_complement: TypedContractMethod<[
        _coin: AddressLike,
        _index: BigNumberish
    ], [
        string
    ], "view">;
    get_pool_asset_type: TypedContractMethod<[
        _pool: AddressLike
    ], [
        bigint
    ], "view">;
    add_pool: TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _rate_info: BytesLike,
        _decimals: BigNumberish,
        _underlying_decimals: BigNumberish,
        _has_initial_A: boolean,
        _is_v1: boolean,
        _name: string
    ], [
        void
    ], "nonpayable">;
    add_pool_without_underlying: TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _rate_info: BytesLike,
        _decimals: BigNumberish,
        _use_rates: BigNumberish,
        _has_initial_A: boolean,
        _is_v1: boolean,
        _name: string
    ], [
        void
    ], "nonpayable">;
    "add_metapool(address,uint256,address,uint256,string)": TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _decimals: BigNumberish,
        _name: string
    ], [
        void
    ], "nonpayable">;
    "add_metapool(address,uint256,address,uint256,string,address)": TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _decimals: BigNumberish,
        _name: string,
        _base_pool: AddressLike
    ], [
        void
    ], "nonpayable">;
    remove_pool: TypedContractMethod<[_pool: AddressLike], [void], "nonpayable">;
    set_pool_gas_estimates: TypedContractMethod<[
        _addr: [AddressLike, AddressLike, AddressLike, AddressLike, AddressLike],
        _amount: [
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ]
        ]
    ], [
        void
    ], "nonpayable">;
    set_coin_gas_estimates: TypedContractMethod<[
        _addr: AddressLike[],
        _amount: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    set_gas_estimate_contract: TypedContractMethod<[
        _pool: AddressLike,
        _estimator: AddressLike
    ], [
        void
    ], "nonpayable">;
    set_liquidity_gauges: TypedContractMethod<[
        _pool: AddressLike,
        _liquidity_gauges: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    set_pool_asset_type: TypedContractMethod<[
        _pool: AddressLike,
        _asset_type: BigNumberish
    ], [
        void
    ], "nonpayable">;
    batch_set_pool_asset_type: TypedContractMethod<[
        _pools: AddressLike[],
        _asset_types: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    address_provider: TypedContractMethod<[], [string], "view">;
    gauge_controller: TypedContractMethod<[], [string], "view">;
    pool_list: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    pool_count: TypedContractMethod<[], [bigint], "view">;
    coin_count: TypedContractMethod<[], [bigint], "view">;
    get_coin: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    get_pool_from_lp_token: TypedContractMethod<[
        arg0: AddressLike
    ], [
        string
    ], "view">;
    get_lp_token: TypedContractMethod<[arg0: AddressLike], [string], "view">;
    last_updated: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "find_pool_for_coins(address,address)"): TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "find_pool_for_coins(address,address,uint256)"): TypedContractMethod<[
        _from: AddressLike,
        _to: AddressLike,
        i: BigNumberish
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "get_n_coins"): TypedContractMethod<[_pool: AddressLike], [[bigint, bigint]], "view">;
    getFunction(nameOrSignature: "get_coins"): TypedContractMethod<[_pool: AddressLike], [string[]], "view">;
    getFunction(nameOrSignature: "get_underlying_coins"): TypedContractMethod<[_pool: AddressLike], [string[]], "view">;
    getFunction(nameOrSignature: "get_decimals"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_underlying_decimals"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_rates"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_gauges"): TypedContractMethod<[_pool: AddressLike], [[string[], bigint[]]], "view">;
    getFunction(nameOrSignature: "get_balances"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_underlying_balances"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_virtual_price_from_lp_token"): TypedContractMethod<[_token: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "get_A"): TypedContractMethod<[_pool: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "get_parameters"): TypedContractMethod<[
        _pool: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            string,
            bigint,
            bigint,
            bigint
        ] & {
            A: bigint;
            future_A: bigint;
            fee: bigint;
            admin_fee: bigint;
            future_fee: bigint;
            future_admin_fee: bigint;
            future_owner: string;
            initial_A: bigint;
            initial_A_time: bigint;
            future_A_time: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "get_fees"): TypedContractMethod<[_pool: AddressLike], [[bigint, bigint]], "view">;
    getFunction(nameOrSignature: "get_admin_balances"): TypedContractMethod<[_pool: AddressLike], [bigint[]], "view">;
    getFunction(nameOrSignature: "get_coin_indices"): TypedContractMethod<[
        _pool: AddressLike,
        _from: AddressLike,
        _to: AddressLike
    ], [
        [bigint, bigint, boolean]
    ], "view">;
    getFunction(nameOrSignature: "estimate_gas_used"): TypedContractMethod<[
        _pool: AddressLike,
        _from: AddressLike,
        _to: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "is_meta"): TypedContractMethod<[_pool: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "get_pool_name"): TypedContractMethod<[_pool: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "get_coin_swap_count"): TypedContractMethod<[_coin: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "get_coin_swap_complement"): TypedContractMethod<[
        _coin: AddressLike,
        _index: BigNumberish
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "get_pool_asset_type"): TypedContractMethod<[_pool: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "add_pool"): TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _rate_info: BytesLike,
        _decimals: BigNumberish,
        _underlying_decimals: BigNumberish,
        _has_initial_A: boolean,
        _is_v1: boolean,
        _name: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "add_pool_without_underlying"): TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _rate_info: BytesLike,
        _decimals: BigNumberish,
        _use_rates: BigNumberish,
        _has_initial_A: boolean,
        _is_v1: boolean,
        _name: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "add_metapool(address,uint256,address,uint256,string)"): TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _decimals: BigNumberish,
        _name: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "add_metapool(address,uint256,address,uint256,string,address)"): TypedContractMethod<[
        _pool: AddressLike,
        _n_coins: BigNumberish,
        _lp_token: AddressLike,
        _decimals: BigNumberish,
        _name: string,
        _base_pool: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "remove_pool"): TypedContractMethod<[_pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "set_pool_gas_estimates"): TypedContractMethod<[
        _addr: [AddressLike, AddressLike, AddressLike, AddressLike, AddressLike],
        _amount: [
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ],
            [
                BigNumberish,
                BigNumberish
            ]
        ]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "set_coin_gas_estimates"): TypedContractMethod<[
        _addr: AddressLike[],
        _amount: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "set_gas_estimate_contract"): TypedContractMethod<[
        _pool: AddressLike,
        _estimator: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "set_liquidity_gauges"): TypedContractMethod<[
        _pool: AddressLike,
        _liquidity_gauges: AddressLike[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "set_pool_asset_type"): TypedContractMethod<[
        _pool: AddressLike,
        _asset_type: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "batch_set_pool_asset_type"): TypedContractMethod<[
        _pools: AddressLike[],
        _asset_types: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "address_provider"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "gauge_controller"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pool_list"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "pool_count"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "coin_count"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "get_coin"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "get_pool_from_lp_token"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "get_lp_token"): TypedContractMethod<[arg0: AddressLike], [string], "view">;
    getFunction(nameOrSignature: "last_updated"): TypedContractMethod<[], [bigint], "view">;
    getEvent(key: "PoolAdded"): TypedContractEvent<PoolAddedEvent.InputTuple, PoolAddedEvent.OutputTuple, PoolAddedEvent.OutputObject>;
    getEvent(key: "PoolRemoved"): TypedContractEvent<PoolRemovedEvent.InputTuple, PoolRemovedEvent.OutputTuple, PoolRemovedEvent.OutputObject>;
    filters: {
        "PoolAdded(address,bytes)": TypedContractEvent<PoolAddedEvent.InputTuple, PoolAddedEvent.OutputTuple, PoolAddedEvent.OutputObject>;
        PoolAdded: TypedContractEvent<PoolAddedEvent.InputTuple, PoolAddedEvent.OutputTuple, PoolAddedEvent.OutputObject>;
        "PoolRemoved(address)": TypedContractEvent<PoolRemovedEvent.InputTuple, PoolRemovedEvent.OutputTuple, PoolRemovedEvent.OutputObject>;
        PoolRemoved: TypedContractEvent<PoolRemovedEvent.InputTuple, PoolRemovedEvent.OutputTuple, PoolRemovedEvent.OutputObject>;
    };
}
