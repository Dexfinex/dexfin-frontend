import { type ContractRunner } from "ethers-v6";
import type { CurveRegistry, CurveRegistryInterface } from "../CurveRegistry.js";
export declare class CurveRegistry__factory {
    static readonly abi: readonly [{
        readonly name: "PoolAdded";
        readonly inputs: readonly [{
            readonly name: "pool";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "rate_method_id";
            readonly type: "bytes";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "PoolRemoved";
        readonly inputs: readonly [{
            readonly name: "pool";
            readonly type: "address";
            readonly indexed: true;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
        readonly inputs: readonly [{
            readonly name: "_address_provider";
            readonly type: "address";
        }, {
            readonly name: "_gauge_controller";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "find_pool_for_coins";
        readonly inputs: readonly [{
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "find_pool_for_coins";
        readonly inputs: readonly [{
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly name: "i";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_n_coins";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[2]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_coins";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_underlying_coins";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_decimals";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_underlying_decimals";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_rates";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_gauges";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address[10]";
        }, {
            readonly name: "";
            readonly type: "int128[10]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_balances";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_underlying_balances";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_virtual_price_from_lp_token";
        readonly inputs: readonly [{
            readonly name: "_token";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_A";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_parameters";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "A";
            readonly type: "uint256";
        }, {
            readonly name: "future_A";
            readonly type: "uint256";
        }, {
            readonly name: "fee";
            readonly type: "uint256";
        }, {
            readonly name: "admin_fee";
            readonly type: "uint256";
        }, {
            readonly name: "future_fee";
            readonly type: "uint256";
        }, {
            readonly name: "future_admin_fee";
            readonly type: "uint256";
        }, {
            readonly name: "future_owner";
            readonly type: "address";
        }, {
            readonly name: "initial_A";
            readonly type: "uint256";
        }, {
            readonly name: "initial_A_time";
            readonly type: "uint256";
        }, {
            readonly name: "future_A_time";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_fees";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[2]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_admin_balances";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256[8]";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_coin_indices";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "int128";
        }, {
            readonly name: "";
            readonly type: "int128";
        }, {
            readonly name: "";
            readonly type: "bool";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "estimate_gas_used";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly name: "_to";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "is_meta";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "bool";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_pool_name";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "string";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_coin_swap_count";
        readonly inputs: readonly [{
            readonly name: "_coin";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_coin_swap_complement";
        readonly inputs: readonly [{
            readonly name: "_coin";
            readonly type: "address";
        }, {
            readonly name: "_index";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_pool_asset_type";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_pool";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_n_coins";
            readonly type: "uint256";
        }, {
            readonly name: "_lp_token";
            readonly type: "address";
        }, {
            readonly name: "_rate_info";
            readonly type: "bytes32";
        }, {
            readonly name: "_decimals";
            readonly type: "uint256";
        }, {
            readonly name: "_underlying_decimals";
            readonly type: "uint256";
        }, {
            readonly name: "_has_initial_A";
            readonly type: "bool";
        }, {
            readonly name: "_is_v1";
            readonly type: "bool";
        }, {
            readonly name: "_name";
            readonly type: "string";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_pool_without_underlying";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_n_coins";
            readonly type: "uint256";
        }, {
            readonly name: "_lp_token";
            readonly type: "address";
        }, {
            readonly name: "_rate_info";
            readonly type: "bytes32";
        }, {
            readonly name: "_decimals";
            readonly type: "uint256";
        }, {
            readonly name: "_use_rates";
            readonly type: "uint256";
        }, {
            readonly name: "_has_initial_A";
            readonly type: "bool";
        }, {
            readonly name: "_is_v1";
            readonly type: "bool";
        }, {
            readonly name: "_name";
            readonly type: "string";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_metapool";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_n_coins";
            readonly type: "uint256";
        }, {
            readonly name: "_lp_token";
            readonly type: "address";
        }, {
            readonly name: "_decimals";
            readonly type: "uint256";
        }, {
            readonly name: "_name";
            readonly type: "string";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_metapool";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_n_coins";
            readonly type: "uint256";
        }, {
            readonly name: "_lp_token";
            readonly type: "address";
        }, {
            readonly name: "_decimals";
            readonly type: "uint256";
        }, {
            readonly name: "_name";
            readonly type: "string";
        }, {
            readonly name: "_base_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "remove_pool";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "set_pool_gas_estimates";
        readonly inputs: readonly [{
            readonly name: "_addr";
            readonly type: "address[5]";
        }, {
            readonly name: "_amount";
            readonly type: "uint256[2][5]";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "set_coin_gas_estimates";
        readonly inputs: readonly [{
            readonly name: "_addr";
            readonly type: "address[10]";
        }, {
            readonly name: "_amount";
            readonly type: "uint256[10]";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "set_gas_estimate_contract";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_estimator";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "set_liquidity_gauges";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_liquidity_gauges";
            readonly type: "address[10]";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "set_pool_asset_type";
        readonly inputs: readonly [{
            readonly name: "_pool";
            readonly type: "address";
        }, {
            readonly name: "_asset_type";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "batch_set_pool_asset_type";
        readonly inputs: readonly [{
            readonly name: "_pools";
            readonly type: "address[32]";
        }, {
            readonly name: "_asset_types";
            readonly type: "uint256[32]";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "address_provider";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauge_controller";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "pool_list";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "pool_count";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "coin_count";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_coin";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_pool_from_lp_token";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_lp_token";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "last_updated";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }];
    static createInterface(): CurveRegistryInterface;
    static connect(address: string, runner?: ContractRunner | null): CurveRegistry;
}
