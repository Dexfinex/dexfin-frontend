import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers-v6";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common.js";
export interface VeOrnVotingInterface extends Interface {
    getFunction(nameOrSignature: "ORN" | "addPool" | "addPool2" | "allStake" | "calcNewRate" | "changeVoteProposal" | "claimReward" | "countPool" | "createProposal" | "deletePool" | "getReward" | "getRewardCumulative" | "getRewardCumulativeAll" | "getRewardWithdraw" | "getStake" | "havePool" | "poolIndex" | "poolList" | "poolStake" | "proposalInfo" | "proposalVotes" | "rateCumulative" | "rateTime" | "rewardRate" | "setRewards" | "setSmart" | "smartOwner" | "smarts" | "unvote" | "unvoteAll" | "unvotePercent" | "userVotedChoice" | "users" | "usersPool" | "veORN" | "vote" | "voteArr" | "votePercent" | "voteProposal" | "voted"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ClaimReward" | "ProposalCreated" | "ProposalUnvoted" | "ProposalVoted" | "SetRewards" | "Stake" | "Unstake" | "Unvote" | "UnvoteAll" | "UsePool" | "Vote"): EventFragment;
    encodeFunctionData(functionFragment: "ORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "addPool", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "addPool2", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "allStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "calcNewRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "changeVoteProposal", values: [BytesLike, BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "claimReward", values: [AddressLike, AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "countPool", values?: undefined): string;
    encodeFunctionData(functionFragment: "createProposal", values: [BytesLike, BytesLike[], BigNumberish]): string;
    encodeFunctionData(functionFragment: "deletePool", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getReward", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulative", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getRewardCumulativeAll", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRewardWithdraw", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "havePool", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "poolIndex", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "poolList", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "poolStake", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "proposalInfo", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "proposalVotes", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "rateCumulative", values?: undefined): string;
    encodeFunctionData(functionFragment: "rateTime", values?: undefined): string;
    encodeFunctionData(functionFragment: "rewardRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "setRewards", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "setSmart", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "smartOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "smarts", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "unvote", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "unvoteAll", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "unvotePercent", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "userVotedChoice", values: [AddressLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "users", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "usersPool", values: [AddressLike, AddressLike]): string;
    encodeFunctionData(functionFragment: "veORN", values?: undefined): string;
    encodeFunctionData(functionFragment: "vote", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "voteArr", values: [AddressLike[], BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "votePercent", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "voteProposal", values: [BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "voted", values: [BytesLike, AddressLike]): string;
    decodeFunctionResult(functionFragment: "ORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addPool2", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcNewRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeVoteProposal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "countPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createProposal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deletePool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardCumulativeAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRewardWithdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "havePool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolList", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "poolStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposalInfo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposalVotes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateCumulative", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rateTime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "rewardRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRewards", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSmart", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smartOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "smarts", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unvote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unvoteAll", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unvotePercent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "userVotedChoice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "users", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usersPool", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "veORN", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voteArr", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "votePercent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voteProposal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "voted", data: BytesLike): Result;
}
export declare namespace ClaimRewardEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ProposalCreatedEvent {
    type InputTuple = [
        name: BytesLike,
        timestampFinish: BigNumberish,
        choices: BytesLike[]
    ];
    type OutputTuple = [
        name: string,
        timestampFinish: bigint,
        choices: string[]
    ];
    interface OutputObject {
        name: string;
        timestampFinish: bigint;
        choices: string[];
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ProposalUnvotedEvent {
    type InputTuple = [
        user: AddressLike,
        name: BytesLike,
        choice: BytesLike,
        votePower: BigNumberish
    ];
    type OutputTuple = [
        user: string,
        name: string,
        choice: string,
        votePower: bigint
    ];
    interface OutputObject {
        user: string;
        name: string;
        choice: string;
        votePower: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ProposalVotedEvent {
    type InputTuple = [
        user: AddressLike,
        name: BytesLike,
        choice: BytesLike,
        votePower: BigNumberish
    ];
    type OutputTuple = [
        user: string,
        name: string,
        choice: string,
        votePower: bigint
    ];
    interface OutputObject {
        user: string;
        name: string;
        choice: string;
        votePower: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace SetRewardsEvent {
    type InputTuple = [
        rewards: BigNumberish,
        duration: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        rewards: bigint,
        duration: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        rewards: bigint;
        duration: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace StakeEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UnstakeEvent {
    type InputTuple = [
        account: AddressLike,
        amount: BigNumberish,
        rewardCumulativeTotal: BigNumberish,
        rateCumulative: BigNumberish,
        reward: BigNumberish,
        timestamp: BigNumberish
    ];
    type OutputTuple = [
        account: string,
        amount: bigint,
        rewardCumulativeTotal: bigint,
        rateCumulative: bigint,
        reward: bigint,
        timestamp: bigint
    ];
    interface OutputObject {
        account: string;
        amount: bigint;
        rewardCumulativeTotal: bigint;
        rateCumulative: bigint;
        reward: bigint;
        timestamp: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UnvoteEvent {
    type InputTuple = [
        pool: AddressLike,
        account: AddressLike,
        amount: BigNumberish
    ];
    type OutputTuple = [pool: string, account: string, amount: bigint];
    interface OutputObject {
        pool: string;
        account: string;
        amount: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UnvoteAllEvent {
    type InputTuple = [account: AddressLike];
    type OutputTuple = [account: string];
    interface OutputObject {
        account: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace UsePoolEvent {
    type InputTuple = [pool: AddressLike, bUse: boolean];
    type OutputTuple = [pool: string, bUse: boolean];
    interface OutputObject {
        pool: string;
        bUse: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace VoteEvent {
    type InputTuple = [
        pool: AddressLike,
        account: AddressLike,
        amount: BigNumberish
    ];
    type OutputTuple = [pool: string, account: string, amount: bigint];
    interface OutputObject {
        pool: string;
        account: string;
        amount: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface VeOrnVoting extends BaseContract {
    connect(runner?: ContractRunner | null): VeOrnVoting;
    waitForDeployment(): Promise<this>;
    interface: VeOrnVotingInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    ORN: TypedContractMethod<[], [string], "view">;
    addPool: TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    addPool2: TypedContractMethod<[
        pool: AddressLike,
        farmv2: AddressLike
    ], [
        void
    ], "nonpayable">;
    allStake: TypedContractMethod<[], [bigint], "view">;
    calcNewRate: TypedContractMethod<[], [bigint], "view">;
    changeVoteProposal: TypedContractMethod<[
        name: BytesLike,
        previousChoice: BytesLike,
        newChoice: BytesLike
    ], [
        void
    ], "nonpayable">;
    claimReward: TypedContractMethod<[
        pool: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    countPool: TypedContractMethod<[], [bigint], "view">;
    createProposal: TypedContractMethod<[
        name: BytesLike,
        choices: BytesLike[],
        timestampFinish: BigNumberish
    ], [
        void
    ], "nonpayable">;
    deletePool: TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getReward: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getRewardCumulative: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getRewardCumulativeAll: TypedContractMethod<[], [bigint], "view">;
    getRewardWithdraw: TypedContractMethod<[
        account: AddressLike
    ], [
        bigint
    ], "view">;
    getStake: TypedContractMethod<[account: AddressLike], [bigint], "view">;
    havePool: TypedContractMethod<[account: AddressLike], [boolean], "view">;
    poolIndex: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    poolList: TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    poolStake: TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            stake: bigint;
            rateCumulative: bigint;
            reward: bigint;
            rewardWithdraw: bigint;
        }
    ], "view">;
    proposalInfo: TypedContractMethod<[
        name: BytesLike
    ], [
        [string, bigint, string[], bigint[]]
    ], "view">;
    proposalVotes: TypedContractMethod<[arg0: BytesLike], [bigint], "view">;
    rateCumulative: TypedContractMethod<[], [bigint], "view">;
    rateTime: TypedContractMethod<[], [bigint], "view">;
    rewardRate: TypedContractMethod<[], [bigint], "view">;
    setRewards: TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setSmart: TypedContractMethod<[
        addr: AddressLike,
        bUse: boolean
    ], [
        void
    ], "nonpayable">;
    smartOwner: TypedContractMethod<[], [string], "view">;
    smarts: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    unvote: TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    unvoteAll: TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
    unvotePercent: TypedContractMethod<[
        pool: AddressLike,
        percent: BigNumberish
    ], [
        void
    ], "nonpayable">;
    userVotedChoice: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BytesLike
    ], [
        string
    ], "view">;
    users: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    usersPool: TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    veORN: TypedContractMethod<[], [string], "view">;
    vote: TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    voteArr: TypedContractMethod<[
        pools: AddressLike[],
        amounts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    votePercent: TypedContractMethod<[
        pool: AddressLike,
        percent: BigNumberish
    ], [
        void
    ], "nonpayable">;
    voteProposal: TypedContractMethod<[
        name: BytesLike,
        choice: BytesLike
    ], [
        void
    ], "nonpayable">;
    voted: TypedContractMethod<[
        arg0: BytesLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "ORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "addPool"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "addPool2"): TypedContractMethod<[
        pool: AddressLike,
        farmv2: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "allStake"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "calcNewRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "changeVoteProposal"): TypedContractMethod<[
        name: BytesLike,
        previousChoice: BytesLike,
        newChoice: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimReward"): TypedContractMethod<[
        pool: AddressLike,
        to: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "countPool"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "createProposal"): TypedContractMethod<[
        name: BytesLike,
        choices: BytesLike[],
        timestampFinish: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "deletePool"): TypedContractMethod<[pool: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "getReward"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulative"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardCumulativeAll"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getRewardWithdraw"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getStake"): TypedContractMethod<[account: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "havePool"): TypedContractMethod<[account: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "poolIndex"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "poolList"): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "poolStake"): TypedContractMethod<[
        arg0: AddressLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            stake: bigint;
            rateCumulative: bigint;
            reward: bigint;
            rewardWithdraw: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "proposalInfo"): TypedContractMethod<[
        name: BytesLike
    ], [
        [string, bigint, string[], bigint[]]
    ], "view">;
    getFunction(nameOrSignature: "proposalVotes"): TypedContractMethod<[arg0: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "rateCumulative"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rateTime"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "rewardRate"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "setRewards"): TypedContractMethod<[
        rewards: BigNumberish,
        duration: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "setSmart"): TypedContractMethod<[
        addr: AddressLike,
        bUse: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "smartOwner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "smarts"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "unvote"): TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "unvoteAll"): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "unvotePercent"): TypedContractMethod<[
        pool: AddressLike,
        percent: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "userVotedChoice"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BytesLike
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "users"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "usersPool"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "veORN"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "vote"): TypedContractMethod<[
        pool: AddressLike,
        amount: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "voteArr"): TypedContractMethod<[
        pools: AddressLike[],
        amounts: BigNumberish[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "votePercent"): TypedContractMethod<[
        pool: AddressLike,
        percent: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "voteProposal"): TypedContractMethod<[
        name: BytesLike,
        choice: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "voted"): TypedContractMethod<[
        arg0: BytesLike,
        arg1: AddressLike
    ], [
        bigint
    ], "view">;
    getEvent(key: "ClaimReward"): TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
    getEvent(key: "ProposalCreated"): TypedContractEvent<ProposalCreatedEvent.InputTuple, ProposalCreatedEvent.OutputTuple, ProposalCreatedEvent.OutputObject>;
    getEvent(key: "ProposalUnvoted"): TypedContractEvent<ProposalUnvotedEvent.InputTuple, ProposalUnvotedEvent.OutputTuple, ProposalUnvotedEvent.OutputObject>;
    getEvent(key: "ProposalVoted"): TypedContractEvent<ProposalVotedEvent.InputTuple, ProposalVotedEvent.OutputTuple, ProposalVotedEvent.OutputObject>;
    getEvent(key: "SetRewards"): TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
    getEvent(key: "Stake"): TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
    getEvent(key: "Unstake"): TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
    getEvent(key: "Unvote"): TypedContractEvent<UnvoteEvent.InputTuple, UnvoteEvent.OutputTuple, UnvoteEvent.OutputObject>;
    getEvent(key: "UnvoteAll"): TypedContractEvent<UnvoteAllEvent.InputTuple, UnvoteAllEvent.OutputTuple, UnvoteAllEvent.OutputObject>;
    getEvent(key: "UsePool"): TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
    getEvent(key: "Vote"): TypedContractEvent<VoteEvent.InputTuple, VoteEvent.OutputTuple, VoteEvent.OutputObject>;
    filters: {
        "ClaimReward(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        ClaimReward: TypedContractEvent<ClaimRewardEvent.InputTuple, ClaimRewardEvent.OutputTuple, ClaimRewardEvent.OutputObject>;
        "ProposalCreated(bytes32,uint256,bytes32[])": TypedContractEvent<ProposalCreatedEvent.InputTuple, ProposalCreatedEvent.OutputTuple, ProposalCreatedEvent.OutputObject>;
        ProposalCreated: TypedContractEvent<ProposalCreatedEvent.InputTuple, ProposalCreatedEvent.OutputTuple, ProposalCreatedEvent.OutputObject>;
        "ProposalUnvoted(address,bytes32,bytes32,uint256)": TypedContractEvent<ProposalUnvotedEvent.InputTuple, ProposalUnvotedEvent.OutputTuple, ProposalUnvotedEvent.OutputObject>;
        ProposalUnvoted: TypedContractEvent<ProposalUnvotedEvent.InputTuple, ProposalUnvotedEvent.OutputTuple, ProposalUnvotedEvent.OutputObject>;
        "ProposalVoted(address,bytes32,bytes32,uint256)": TypedContractEvent<ProposalVotedEvent.InputTuple, ProposalVotedEvent.OutputTuple, ProposalVotedEvent.OutputObject>;
        ProposalVoted: TypedContractEvent<ProposalVotedEvent.InputTuple, ProposalVotedEvent.OutputTuple, ProposalVotedEvent.OutputObject>;
        "SetRewards(uint64,uint64,uint256,uint256,uint256)": TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        SetRewards: TypedContractEvent<SetRewardsEvent.InputTuple, SetRewardsEvent.OutputTuple, SetRewardsEvent.OutputObject>;
        "Stake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        Stake: TypedContractEvent<StakeEvent.InputTuple, StakeEvent.OutputTuple, StakeEvent.OutputObject>;
        "Unstake(address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        Unstake: TypedContractEvent<UnstakeEvent.InputTuple, UnstakeEvent.OutputTuple, UnstakeEvent.OutputObject>;
        "Unvote(address,address,uint256)": TypedContractEvent<UnvoteEvent.InputTuple, UnvoteEvent.OutputTuple, UnvoteEvent.OutputObject>;
        Unvote: TypedContractEvent<UnvoteEvent.InputTuple, UnvoteEvent.OutputTuple, UnvoteEvent.OutputObject>;
        "UnvoteAll(address)": TypedContractEvent<UnvoteAllEvent.InputTuple, UnvoteAllEvent.OutputTuple, UnvoteAllEvent.OutputObject>;
        UnvoteAll: TypedContractEvent<UnvoteAllEvent.InputTuple, UnvoteAllEvent.OutputTuple, UnvoteAllEvent.OutputObject>;
        "UsePool(address,bool)": TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
        UsePool: TypedContractEvent<UsePoolEvent.InputTuple, UsePoolEvent.OutputTuple, UsePoolEvent.OutputObject>;
        "Vote(address,address,uint256)": TypedContractEvent<VoteEvent.InputTuple, VoteEvent.OutputTuple, VoteEvent.OutputObject>;
        Vote: TypedContractEvent<VoteEvent.InputTuple, VoteEvent.OutputTuple, VoteEvent.OutputObject>;
    };
}
