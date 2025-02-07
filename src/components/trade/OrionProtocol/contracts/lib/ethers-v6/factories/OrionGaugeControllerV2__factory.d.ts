import { type ContractRunner } from "ethers-v6";
import type { OrionGaugeControllerV2, OrionGaugeControllerV2Interface } from "../OrionGaugeControllerV2.js";
export declare class OrionGaugeControllerV2__factory {
    static readonly abi: readonly [{
        readonly name: "CommitOwnership";
        readonly inputs: readonly [{
            readonly name: "admin";
            readonly type: "address";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "ApplyOwnership";
        readonly inputs: readonly [{
            readonly name: "admin";
            readonly type: "address";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "AddType";
        readonly inputs: readonly [{
            readonly name: "name";
            readonly type: "string";
            readonly indexed: false;
        }, {
            readonly name: "type_id";
            readonly type: "int128";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "NewTypeWeight";
        readonly inputs: readonly [{
            readonly name: "type_id";
            readonly type: "int128";
            readonly indexed: false;
        }, {
            readonly name: "time";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "weight";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "total_weight";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "NewGaugeWeight";
        readonly inputs: readonly [{
            readonly name: "gauge_address";
            readonly type: "address";
            readonly indexed: false;
        }, {
            readonly name: "time";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "weight";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "total_weight";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "VoteForGauge";
        readonly inputs: readonly [{
            readonly name: "time";
            readonly type: "uint256";
            readonly indexed: false;
        }, {
            readonly name: "user";
            readonly type: "address";
            readonly indexed: false;
        }, {
            readonly name: "gauge_addr";
            readonly type: "address";
            readonly indexed: false;
        }, {
            readonly name: "weight";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly name: "NewGauge";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
            readonly indexed: false;
        }, {
            readonly name: "gauge_type";
            readonly type: "int128";
            readonly indexed: false;
        }, {
            readonly name: "weight";
            readonly type: "uint256";
            readonly indexed: false;
        }];
        readonly anonymous: false;
        readonly type: "event";
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
        readonly inputs: readonly [{
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly name: "_voting_escrow";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "commit_transfer_ownership";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "apply_transfer_ownership";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_corrected_info";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "bias";
                readonly type: "uint256";
            }, {
                readonly name: "slope";
                readonly type: "uint256";
            }, {
                readonly name: "lock_end";
                readonly type: "uint256";
            }, {
                readonly name: "fxs_amount";
                readonly type: "uint256";
            }];
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauge_types";
        readonly inputs: readonly [{
            readonly name: "_addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "int128";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_gauge";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly name: "gauge_type";
            readonly type: "int128";
        }, {
            readonly name: "weight";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "checkpoint";
        readonly inputs: readonly [];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "checkpoint_gauge";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauge_relative_weight";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauge_relative_weight";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly name: "time";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "gauge_relative_weight_write";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "gauge_relative_weight_write";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly name: "time";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "add_type";
        readonly inputs: readonly [{
            readonly name: "_name";
            readonly type: "string";
        }, {
            readonly name: "weight";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "change_type_weight";
        readonly inputs: readonly [{
            readonly name: "type_id";
            readonly type: "int128";
        }, {
            readonly name: "weight";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "change_gauge_weight";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }, {
            readonly name: "weight";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "vote_for_gauge_weights";
        readonly inputs: readonly [{
            readonly name: "_gauge_addr";
            readonly type: "address";
        }, {
            readonly name: "_user_weight";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_gauge_weight";
        readonly inputs: readonly [{
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_type_weight";
        readonly inputs: readonly [{
            readonly name: "type_id";
            readonly type: "int128";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_total_weight";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "get_weights_sum_per_type";
        readonly inputs: readonly [{
            readonly name: "type_id";
            readonly type: "int128";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "nonpayable";
        readonly type: "function";
        readonly name: "change_global_emission_rate";
        readonly inputs: readonly [{
            readonly name: "new_rate";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "admin";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "future_admin";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "token";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "voting_escrow";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "n_gauge_types";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "int128";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "n_gauges";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "int128";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauge_type_names";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "int128";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "string";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "gauges";
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
        readonly name: "vote_user_slopes";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }, {
            readonly name: "arg1";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "slope";
                readonly type: "uint256";
            }, {
                readonly name: "power";
                readonly type: "uint256";
            }, {
                readonly name: "end";
                readonly type: "uint256";
            }];
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "vote_user_power";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "last_user_vote";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }, {
            readonly name: "arg1";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "points_weight";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }, {
            readonly name: "arg1";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "bias";
                readonly type: "uint256";
            }, {
                readonly name: "slope";
                readonly type: "uint256";
            }];
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "time_weight";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "address";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "points_sum";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "int128";
        }, {
            readonly name: "arg1";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "bias";
                readonly type: "uint256";
            }, {
                readonly name: "slope";
                readonly type: "uint256";
            }];
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "time_sum";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "points_total";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "time_total";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "points_type_weight";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "int128";
        }, {
            readonly name: "arg1";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "time_type_weight";
        readonly inputs: readonly [{
            readonly name: "arg0";
            readonly type: "uint256";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }, {
        readonly stateMutability: "view";
        readonly type: "function";
        readonly name: "global_emission_rate";
        readonly inputs: readonly [];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "uint256";
        }];
    }];
    static createInterface(): OrionGaugeControllerV2Interface;
    static connect(address: string, runner?: ContractRunner | null): OrionGaugeControllerV2;
}
