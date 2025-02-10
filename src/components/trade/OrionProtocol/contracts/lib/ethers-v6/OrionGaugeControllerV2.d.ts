import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface OrionGaugeControllerV2Interface extends Interface {
    getFunction(nameOrSignature: "commit_transfer_ownership" | "apply_transfer_ownership" | "get_corrected_info" | "gauge_types" | "add_gauge" | "checkpoint" | "checkpoint_gauge" | "gauge_relative_weight(address)" | "gauge_relative_weight(address,uint256)" | "gauge_relative_weight_write(address)" | "gauge_relative_weight_write(address,uint256)" | "add_type" | "change_type_weight" | "change_gauge_weight" | "vote_for_gauge_weights" | "get_gauge_weight" | "get_type_weight" | "get_total_weight" | "get_weights_sum_per_type" | "change_global_emission_rate" | "admin" | "future_admin" | "token" | "voting_escrow" | "n_gauge_types" | "n_gauges" | "gauge_type_names" | "gauges" | "vote_user_slopes" | "vote_user_power" | "last_user_vote" | "points_weight" | "time_weight" | "points_sum" | "time_sum" | "points_total" | "time_total" | "points_type_weight" | "time_type_weight" | "global_emission_rate"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "CommitOwnership" | "ApplyOwnership" | "AddType" | "NewTypeWeight" | "NewGaugeWeight" | "VoteForGauge" | "NewGauge"): EventFragment;
    encodeFunctionData(functionFragment: "commit_transfer_ownership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "apply_transfer_ownership", values?: undefined): string;
    encodeFunctionData(functionFragment: "get_corrected_info", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "gauge_types", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "add_gauge", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "checkpoint", values?: undefined): string;
    encodeFunctionData(functionFragment: "checkpoint_gauge", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "gauge_relative_weight(address)", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "gauge_relative_weight(address,uint256)", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "gauge_relative_weight_write(address)", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "gauge_relative_weight_write(address,uint256)", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "add_type", values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "change_type_weight", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "change_gauge_weight", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "vote_for_gauge_weights", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "get_gauge_weight", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "get_type_weight", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "get_total_weight", values?: undefined): string;
    encodeFunctionData(functionFragment: "get_weights_sum_per_type", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "change_global_emission_rate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "admin", values?: undefined): string;
    encodeFunctionData(functionFragment: "future_admin", values?: undefined): string;
    encodeFunctionData(functionFragment: "token", values?: undefined): string;
    encodeFunctionData(functionFragment: "voting_escrow", values?: undefined): string;
    encodeFunctionData(functionFragment: "n_gauge_types", values?: undefined): string;
    encodeFunctionData(functionFragment: "n_gauges", values?: undefined): string;
    encodeFunctionData(functionFragment: "gauge_type_names", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "gauges", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "vote_user_slopes", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "vote_user_power", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "last_user_vote", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "points_weight", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "time_weight", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "points_sum", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "time_sum", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "points_total", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "time_total", values?: undefined): string;
    encodeFunctionData(functionFragment: "points_type_weight", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "time_type_weight", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "global_emission_rate", values?: undefined): string;
    decodeFunctionResult(functionFragment: "commit_transfer_ownership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "apply_transfer_ownership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_corrected_info", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_types", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_gauge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkpoint_gauge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_relative_weight(address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_relative_weight(address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_relative_weight_write(address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_relative_weight_write(address,uint256)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "add_type", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "change_type_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "change_gauge_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote_for_gauge_weights", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_gauge_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_type_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_total_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "get_weights_sum_per_type", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "change_global_emission_rate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "future_admin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voting_escrow", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "n_gauge_types", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "n_gauges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauge_type_names", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gauges", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote_user_slopes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote_user_power", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "last_user_vote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "points_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "time_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "points_sum", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "time_sum", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "points_total", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "time_total", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "points_type_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "time_type_weight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "global_emission_rate", data: BytesLike): Result;
}
export declare namespace CommitOwnershipEvent {
    type InputTuple = [admin: AddressLike];
    type OutputTuple = [admin: string];
    interface OutputObject {
        admin: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ApplyOwnershipEvent {
    type InputTuple = [admin: AddressLike];
    type OutputTuple = [admin: string];
    interface OutputObject {
        admin: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace AddTypeEvent {
    type InputTuple = [name: string, type_id: BigNumberish];
    type OutputTuple = [name: string, type_id: bigint];
    interface OutputObject {
        name: string;
        type_id: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NewTypeWeightEvent {
    type InputTuple = [
        type_id: BigNumberish,
        time: BigNumberish,
        weight: BigNumberish,
        total_weight: BigNumberish
    ];
    type OutputTuple = [
        type_id: bigint,
        time: bigint,
        weight: bigint,
        total_weight: bigint
    ];
    interface OutputObject {
        type_id: bigint;
        time: bigint;
        weight: bigint;
        total_weight: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NewGaugeWeightEvent {
    type InputTuple = [
        gauge_address: AddressLike,
        time: BigNumberish,
        weight: BigNumberish,
        total_weight: BigNumberish
    ];
    type OutputTuple = [
        gauge_address: string,
        time: bigint,
        weight: bigint,
        total_weight: bigint
    ];
    interface OutputObject {
        gauge_address: string;
        time: bigint;
        weight: bigint;
        total_weight: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace VoteForGaugeEvent {
    type InputTuple = [
        time: BigNumberish,
        user: AddressLike,
        gauge_addr: AddressLike,
        weight: BigNumberish
    ];
    type OutputTuple = [
        time: bigint,
        user: string,
        gauge_addr: string,
        weight: bigint
    ];
    interface OutputObject {
        time: bigint;
        user: string;
        gauge_addr: string;
        weight: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NewGaugeEvent {
    type InputTuple = [
        addr: AddressLike,
        gauge_type: BigNumberish,
        weight: BigNumberish
    ];
    type OutputTuple = [addr: string, gauge_type: bigint, weight: bigint];
    interface OutputObject {
        addr: string;
        gauge_type: bigint;
        weight: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OrionGaugeControllerV2 extends BaseContract {
    connect(runner?: ContractRunner | null): OrionGaugeControllerV2;
    waitForDeployment(): Promise<this>;
    interface: OrionGaugeControllerV2Interface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    commit_transfer_ownership: TypedContractMethod<[
        addr: AddressLike
    ], [
        void
    ], "nonpayable">;
    apply_transfer_ownership: TypedContractMethod<[], [void], "nonpayable">;
    get_corrected_info: TypedContractMethod<[
        addr: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            bias: bigint;
            slope: bigint;
            lock_end: bigint;
            fxs_amount: bigint;
        }
    ], "view">;
    gauge_types: TypedContractMethod<[_addr: AddressLike], [bigint], "view">;
    add_gauge: TypedContractMethod<[
        addr: AddressLike,
        gauge_type: BigNumberish,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    checkpoint: TypedContractMethod<[], [void], "nonpayable">;
    checkpoint_gauge: TypedContractMethod<[
        addr: AddressLike
    ], [
        void
    ], "nonpayable">;
    "gauge_relative_weight(address)": TypedContractMethod<[
        addr: AddressLike
    ], [
        bigint
    ], "view">;
    "gauge_relative_weight(address,uint256)": TypedContractMethod<[
        addr: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    "gauge_relative_weight_write(address)": TypedContractMethod<[
        addr: AddressLike
    ], [
        bigint
    ], "nonpayable">;
    "gauge_relative_weight_write(address,uint256)": TypedContractMethod<[
        addr: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    add_type: TypedContractMethod<[
        _name: string,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    change_type_weight: TypedContractMethod<[
        type_id: BigNumberish,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    change_gauge_weight: TypedContractMethod<[
        addr: AddressLike,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    vote_for_gauge_weights: TypedContractMethod<[
        _gauge_addr: AddressLike,
        _user_weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    get_gauge_weight: TypedContractMethod<[addr: AddressLike], [bigint], "view">;
    get_type_weight: TypedContractMethod<[
        type_id: BigNumberish
    ], [
        bigint
    ], "view">;
    get_total_weight: TypedContractMethod<[], [bigint], "view">;
    get_weights_sum_per_type: TypedContractMethod<[
        type_id: BigNumberish
    ], [
        bigint
    ], "view">;
    change_global_emission_rate: TypedContractMethod<[
        new_rate: BigNumberish
    ], [
        void
    ], "nonpayable">;
    admin: TypedContractMethod<[], [string], "view">;
    future_admin: TypedContractMethod<[], [string], "view">;
    token: TypedContractMethod<[], [string], "view">;
    voting_escrow: TypedContractMethod<[], [string], "view">;
    n_gauge_types: TypedContractMethod<[], [bigint], "view">;
    n_gauges: TypedContractMethod<[], [bigint], "view">;
    gauge_type_names: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    gauges: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    vote_user_slopes: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        [bigint, bigint, bigint] & {
            slope: bigint;
            power: bigint;
            end: bigint;
        }
    ], "view">;
    vote_user_power: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    last_user_vote: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    points_weight: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            bias: bigint;
            slope: bigint;
        }
    ], "view">;
    time_weight: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    points_sum: TypedContractMethod<[
        arg0: BigNumberish,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            bias: bigint;
            slope: bigint;
        }
    ], "view">;
    time_sum: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    points_total: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    time_total: TypedContractMethod<[], [bigint], "view">;
    points_type_weight: TypedContractMethod<[
        arg0: BigNumberish,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    time_type_weight: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    global_emission_rate: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "commit_transfer_ownership"): TypedContractMethod<[addr: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "apply_transfer_ownership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "get_corrected_info"): TypedContractMethod<[
        addr: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            bias: bigint;
            slope: bigint;
            lock_end: bigint;
            fxs_amount: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "gauge_types"): TypedContractMethod<[_addr: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "add_gauge"): TypedContractMethod<[
        addr: AddressLike,
        gauge_type: BigNumberish,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "checkpoint"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "checkpoint_gauge"): TypedContractMethod<[addr: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "gauge_relative_weight(address)"): TypedContractMethod<[addr: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "gauge_relative_weight(address,uint256)"): TypedContractMethod<[
        addr: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "gauge_relative_weight_write(address)"): TypedContractMethod<[addr: AddressLike], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "gauge_relative_weight_write(address,uint256)"): TypedContractMethod<[
        addr: AddressLike,
        time: BigNumberish
    ], [
        bigint
    ], "nonpayable">;
    getFunction(nameOrSignature: "add_type"): TypedContractMethod<[
        _name: string,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "change_type_weight"): TypedContractMethod<[
        type_id: BigNumberish,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "change_gauge_weight"): TypedContractMethod<[
        addr: AddressLike,
        weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "vote_for_gauge_weights"): TypedContractMethod<[
        _gauge_addr: AddressLike,
        _user_weight: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "get_gauge_weight"): TypedContractMethod<[addr: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "get_type_weight"): TypedContractMethod<[type_id: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "get_total_weight"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "get_weights_sum_per_type"): TypedContractMethod<[type_id: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "change_global_emission_rate"): TypedContractMethod<[new_rate: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "admin"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "future_admin"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "token"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "voting_escrow"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "n_gauge_types"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "n_gauges"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "gauge_type_names"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "gauges"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "vote_user_slopes"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        [bigint, bigint, bigint] & {
            slope: bigint;
            power: bigint;
            end: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "vote_user_power"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "last_user_vote"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "points_weight"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            bias: bigint;
            slope: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "time_weight"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "points_sum"): TypedContractMethod<[
        arg0: BigNumberish,
        arg1: BigNumberish
    ], [
        [bigint, bigint] & {
            bias: bigint;
            slope: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "time_sum"): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "points_total"): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "time_total"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "points_type_weight"): TypedContractMethod<[
        arg0: BigNumberish,
        arg1: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "time_type_weight"): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "global_emission_rate"): TypedContractMethod<[], [bigint], "view">;
    getEvent(key: "CommitOwnership"): TypedContractEvent<CommitOwnershipEvent.InputTuple, CommitOwnershipEvent.OutputTuple, CommitOwnershipEvent.OutputObject>;
    getEvent(key: "ApplyOwnership"): TypedContractEvent<ApplyOwnershipEvent.InputTuple, ApplyOwnershipEvent.OutputTuple, ApplyOwnershipEvent.OutputObject>;
    getEvent(key: "AddType"): TypedContractEvent<AddTypeEvent.InputTuple, AddTypeEvent.OutputTuple, AddTypeEvent.OutputObject>;
    getEvent(key: "NewTypeWeight"): TypedContractEvent<NewTypeWeightEvent.InputTuple, NewTypeWeightEvent.OutputTuple, NewTypeWeightEvent.OutputObject>;
    getEvent(key: "NewGaugeWeight"): TypedContractEvent<NewGaugeWeightEvent.InputTuple, NewGaugeWeightEvent.OutputTuple, NewGaugeWeightEvent.OutputObject>;
    getEvent(key: "VoteForGauge"): TypedContractEvent<VoteForGaugeEvent.InputTuple, VoteForGaugeEvent.OutputTuple, VoteForGaugeEvent.OutputObject>;
    getEvent(key: "NewGauge"): TypedContractEvent<NewGaugeEvent.InputTuple, NewGaugeEvent.OutputTuple, NewGaugeEvent.OutputObject>;
    filters: {
        "CommitOwnership(address)": TypedContractEvent<CommitOwnershipEvent.InputTuple, CommitOwnershipEvent.OutputTuple, CommitOwnershipEvent.OutputObject>;
        CommitOwnership: TypedContractEvent<CommitOwnershipEvent.InputTuple, CommitOwnershipEvent.OutputTuple, CommitOwnershipEvent.OutputObject>;
        "ApplyOwnership(address)": TypedContractEvent<ApplyOwnershipEvent.InputTuple, ApplyOwnershipEvent.OutputTuple, ApplyOwnershipEvent.OutputObject>;
        ApplyOwnership: TypedContractEvent<ApplyOwnershipEvent.InputTuple, ApplyOwnershipEvent.OutputTuple, ApplyOwnershipEvent.OutputObject>;
        "AddType(string,int128)": TypedContractEvent<AddTypeEvent.InputTuple, AddTypeEvent.OutputTuple, AddTypeEvent.OutputObject>;
        AddType: TypedContractEvent<AddTypeEvent.InputTuple, AddTypeEvent.OutputTuple, AddTypeEvent.OutputObject>;
        "NewTypeWeight(int128,uint256,uint256,uint256)": TypedContractEvent<NewTypeWeightEvent.InputTuple, NewTypeWeightEvent.OutputTuple, NewTypeWeightEvent.OutputObject>;
        NewTypeWeight: TypedContractEvent<NewTypeWeightEvent.InputTuple, NewTypeWeightEvent.OutputTuple, NewTypeWeightEvent.OutputObject>;
        "NewGaugeWeight(address,uint256,uint256,uint256)": TypedContractEvent<NewGaugeWeightEvent.InputTuple, NewGaugeWeightEvent.OutputTuple, NewGaugeWeightEvent.OutputObject>;
        NewGaugeWeight: TypedContractEvent<NewGaugeWeightEvent.InputTuple, NewGaugeWeightEvent.OutputTuple, NewGaugeWeightEvent.OutputObject>;
        "VoteForGauge(uint256,address,address,uint256)": TypedContractEvent<VoteForGaugeEvent.InputTuple, VoteForGaugeEvent.OutputTuple, VoteForGaugeEvent.OutputObject>;
        VoteForGauge: TypedContractEvent<VoteForGaugeEvent.InputTuple, VoteForGaugeEvent.OutputTuple, VoteForGaugeEvent.OutputObject>;
        "NewGauge(address,int128,uint256)": TypedContractEvent<NewGaugeEvent.InputTuple, NewGaugeEvent.OutputTuple, NewGaugeEvent.OutputObject>;
        NewGauge: TypedContractEvent<NewGaugeEvent.InputTuple, NewGaugeEvent.OutputTuple, NewGaugeEvent.OutputObject>;
    };
}
