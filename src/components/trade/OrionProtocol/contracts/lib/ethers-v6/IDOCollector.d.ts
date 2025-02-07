import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface IDOCollectorInterface extends Interface {
    getFunction(nameOrSignature: "DEFAULT_ADMIN_ROLE" | "ORNToken" | "OWNER_ROLE" | "addOwner" | "allocation" | "claimTokens" | "emergencyAssetWithdrawal" | "finishTime" | "getRoleAdmin" | "getRoleMember" | "getRoleMemberCount" | "grantRole" | "hasRole" | "idoToken" | "initialize" | "participate" | "renounceRole" | "revokeRole" | "setIDOParams" | "startClaimTime" | "startTime" | "supportsInterface" | "totalORN" | "userBalances"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "RoleAdminChanged" | "RoleGranted" | "RoleRevoked" | "TokensClaimed" | "UserParticipated"): EventFragment;
    encodeFunctionData(functionFragment: "DEFAULT_ADMIN_ROLE", values?: undefined): string;
    encodeFunctionData(functionFragment: "ORNToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "OWNER_ROLE", values?: undefined): string;
    encodeFunctionData(functionFragment: "addOwner", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "allocation", values?: undefined): string;
    encodeFunctionData(functionFragment: "claimTokens", values?: undefined): string;
    encodeFunctionData(functionFragment: "emergencyAssetWithdrawal", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "finishTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRoleAdmin", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getRoleMember", values: [BytesLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRoleMemberCount", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "grantRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "hasRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "idoToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values?: undefined): string;
    encodeFunctionData(functionFragment: "participate", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "renounceRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "revokeRole", values: [BytesLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "setIDOParams", values: [
        AddressLike,
        AddressLike,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
    ]): string;
    encodeFunctionData(functionFragment: "startClaimTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "startTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "totalORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "userBalances", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "DEFAULT_ADMIN_ROLE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ORNToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "OWNER_ROLE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allocation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "emergencyAssetWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "finishTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRoleAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRoleMember", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRoleMemberCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "idoToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "participate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setIDOParams", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "startClaimTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "startTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userBalances", data: BytesLike): Result;
}
export declare namespace RoleAdminChangedEvent {
    type InputTuple = [
        role: BytesLike,
        previousAdminRole: BytesLike,
        newAdminRole: BytesLike
    ];
    type OutputTuple = [
        role: string,
        previousAdminRole: string,
        newAdminRole: string
    ];
    interface OutputObject {
        role: string;
        previousAdminRole: string;
        newAdminRole: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RoleGrantedEvent {
    type InputTuple = [
        role: BytesLike,
        account: AddressLike,
        sender: AddressLike
    ];
    type OutputTuple = [role: string, account: string, sender: string];
    interface OutputObject {
        role: string;
        account: string;
        sender: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace RoleRevokedEvent {
    type InputTuple = [
        role: BytesLike,
        account: AddressLike,
        sender: AddressLike
    ];
    type OutputTuple = [role: string, account: string, sender: string];
    interface OutputObject {
        role: string;
        account: string;
        sender: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace TokensClaimedEvent {
    type InputTuple = [
        receiver: AddressLike,
        amount: BigNumberish,
        time: BigNumberish
    ];
    type OutputTuple = [receiver: string, amount: bigint, time: bigint];
    interface OutputObject {
        receiver: string;
        amount: bigint;
        time: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UserParticipatedEvent {
    type InputTuple = [
        participant: AddressLike,
        amount: BigNumberish,
        time: BigNumberish
    ];
    type OutputTuple = [participant: string, amount: bigint, time: bigint];
    interface OutputObject {
        participant: string;
        amount: bigint;
        time: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface IDOCollector extends BaseContract {
    connect(runner?: ContractRunner | null): IDOCollector;
    waitForDeployment(): Promise<this>;
    interface: IDOCollectorInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;
    ORNToken: TypedContractMethod<[], [string], "view">;
    OWNER_ROLE: TypedContractMethod<[], [string], "view">;
    addOwner: TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    allocation: TypedContractMethod<[], [bigint], "view">;
    claimTokens: TypedContractMethod<[], [void], "nonpayable">;
    emergencyAssetWithdrawal: TypedContractMethod<[
        asset: AddressLike,
        wallet: AddressLike
    ], [
        void
    ], "nonpayable">;
    finishTime: TypedContractMethod<[], [bigint], "view">;
    getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;
    getRoleMember: TypedContractMethod<[
        role: BytesLike,
        index: BigNumberish
    ], [
        string
    ], "view">;
    getRoleMemberCount: TypedContractMethod<[role: BytesLike], [bigint], "view">;
    grantRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    hasRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        boolean
    ], "view">;
    idoToken: TypedContractMethod<[], [string], "view">;
    initialize: TypedContractMethod<[], [void], "nonpayable">;
    participate: TypedContractMethod<[
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    renounceRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    revokeRole: TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    setIDOParams: TypedContractMethod<[
        _ornToken: AddressLike,
        _idoToken: AddressLike,
        _startTime: BigNumberish,
        _finishTime: BigNumberish,
        _allocation: BigNumberish,
        _startClaimTime: BigNumberish
    ], [
        boolean
    ], "nonpayable">;
    startClaimTime: TypedContractMethod<[], [bigint], "view">;
    startTime: TypedContractMethod<[], [bigint], "view">;
    supportsInterface: TypedContractMethod<[
        interfaceId: BytesLike
    ], [
        boolean
    ], "view">;
    totalORN: TypedContractMethod<[], [bigint], "view">;
    userBalances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "DEFAULT_ADMIN_ROLE"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "ORNToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "OWNER_ROLE"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "addOwner"): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "allocation"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "claimTokens"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "emergencyAssetWithdrawal"): TypedContractMethod<[
        asset: AddressLike,
        wallet: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "finishTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getRoleAdmin"): TypedContractMethod<[role: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "getRoleMember"): TypedContractMethod<[
        role: BytesLike,
        index: BigNumberish
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "getRoleMemberCount"): TypedContractMethod<[role: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "grantRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "hasRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "idoToken"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "initialize"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "participate"): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "renounceRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "revokeRole"): TypedContractMethod<[
        role: BytesLike,
        account: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setIDOParams"): TypedContractMethod<[
        _ornToken: AddressLike,
        _idoToken: AddressLike,
        _startTime: BigNumberish,
        _finishTime: BigNumberish,
        _allocation: BigNumberish,
        _startClaimTime: BigNumberish
    ], [
        boolean
    ], "nonpayable">;
    getFunction(nameOrSignature: "startClaimTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "startTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "supportsInterface"): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
    getFunction(nameOrSignature: "totalORN"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "userBalances"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getEvent(key: "RoleAdminChanged"): TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
    getEvent(key: "RoleGranted"): TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
    getEvent(key: "RoleRevoked"): TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
    getEvent(key: "TokensClaimed"): TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
    getEvent(key: "UserParticipated"): TypedContractEvent<UserParticipatedEvent.InputTuple, UserParticipatedEvent.OutputTuple, UserParticipatedEvent.OutputObject>;
    filters: {
        "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
        RoleAdminChanged: TypedContractEvent<RoleAdminChangedEvent.InputTuple, RoleAdminChangedEvent.OutputTuple, RoleAdminChangedEvent.OutputObject>;
        "RoleGranted(bytes32,address,address)": TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        RoleGranted: TypedContractEvent<RoleGrantedEvent.InputTuple, RoleGrantedEvent.OutputTuple, RoleGrantedEvent.OutputObject>;
        "RoleRevoked(bytes32,address,address)": TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
        RoleRevoked: TypedContractEvent<RoleRevokedEvent.InputTuple, RoleRevokedEvent.OutputTuple, RoleRevokedEvent.OutputObject>;
        "TokensClaimed(address,uint256,uint256)": TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
        TokensClaimed: TypedContractEvent<TokensClaimedEvent.InputTuple, TokensClaimedEvent.OutputTuple, TokensClaimedEvent.OutputObject>;
        "UserParticipated(address,uint256,uint256)": TypedContractEvent<UserParticipatedEvent.InputTuple, UserParticipatedEvent.OutputTuple, UserParticipatedEvent.OutputObject>;
        UserParticipated: TypedContractEvent<UserParticipatedEvent.InputTuple, UserParticipatedEvent.OutputTuple, UserParticipatedEvent.OutputObject>;
    };
}
