/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
    BaseContract,
    BigNumberish,
    BytesLike,
    FunctionFragment,
    Result,
    Interface,
    AddressLike,
    ContractRunner,
    ContractMethod,
    Listener,
} from "ethers"
import type {
    TypedContractEvent,
    TypedDeferredTopicFilter,
    TypedEventLog,
    TypedListener,
    TypedContractMethod,
} from "../../../../../common"

export interface VRFCoordinatorV2InterfaceInterface extends Interface {
    getFunction(
        nameOrSignature:
            | "acceptSubscriptionOwnerTransfer"
            | "addConsumer"
            | "cancelSubscription"
            | "createSubscription"
            | "getRequestConfig"
            | "getSubscription"
            | "pendingRequestExists"
            | "removeConsumer"
            | "requestRandomWords"
            | "requestSubscriptionOwnerTransfer",
    ): FunctionFragment

    encodeFunctionData(
        functionFragment: "acceptSubscriptionOwnerTransfer",
        values: [BigNumberish],
    ): string
    encodeFunctionData(functionFragment: "addConsumer", values: [BigNumberish, AddressLike]): string
    encodeFunctionData(
        functionFragment: "cancelSubscription",
        values: [BigNumberish, AddressLike],
    ): string
    encodeFunctionData(functionFragment: "createSubscription", values?: undefined): string
    encodeFunctionData(functionFragment: "getRequestConfig", values?: undefined): string
    encodeFunctionData(functionFragment: "getSubscription", values: [BigNumberish]): string
    encodeFunctionData(functionFragment: "pendingRequestExists", values: [BigNumberish]): string
    encodeFunctionData(
        functionFragment: "removeConsumer",
        values: [BigNumberish, AddressLike],
    ): string
    encodeFunctionData(
        functionFragment: "requestRandomWords",
        values: [BytesLike, BigNumberish, BigNumberish, BigNumberish, BigNumberish],
    ): string
    encodeFunctionData(
        functionFragment: "requestSubscriptionOwnerTransfer",
        values: [BigNumberish, AddressLike],
    ): string

    decodeFunctionResult(
        functionFragment: "acceptSubscriptionOwnerTransfer",
        data: BytesLike,
    ): Result
    decodeFunctionResult(functionFragment: "addConsumer", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "cancelSubscription", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "createSubscription", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "getRequestConfig", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "getSubscription", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "pendingRequestExists", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "removeConsumer", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "requestRandomWords", data: BytesLike): Result
    decodeFunctionResult(
        functionFragment: "requestSubscriptionOwnerTransfer",
        data: BytesLike,
    ): Result
}

export interface VRFCoordinatorV2Interface extends BaseContract {
    connect(runner?: ContractRunner | null): VRFCoordinatorV2Interface
    waitForDeployment(): Promise<this>

    interface: VRFCoordinatorV2InterfaceInterface

    queryFilter<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined,
    ): Promise<Array<TypedEventLog<TCEvent>>>
    queryFilter<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined,
    ): Promise<Array<TypedEventLog<TCEvent>>>

    on<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        listener: TypedListener<TCEvent>,
    ): Promise<this>
    on<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        listener: TypedListener<TCEvent>,
    ): Promise<this>

    once<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        listener: TypedListener<TCEvent>,
    ): Promise<this>
    once<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        listener: TypedListener<TCEvent>,
    ): Promise<this>

    listeners<TCEvent extends TypedContractEvent>(
        event: TCEvent,
    ): Promise<Array<TypedListener<TCEvent>>>
    listeners(eventName?: string): Promise<Array<Listener>>
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>

    acceptSubscriptionOwnerTransfer: TypedContractMethod<
        [subId: BigNumberish],
        [void],
        "nonpayable"
    >

    addConsumer: TypedContractMethod<
        [subId: BigNumberish, consumer: AddressLike],
        [void],
        "nonpayable"
    >

    cancelSubscription: TypedContractMethod<
        [subId: BigNumberish, to: AddressLike],
        [void],
        "nonpayable"
    >

    createSubscription: TypedContractMethod<[], [bigint], "nonpayable">

    getRequestConfig: TypedContractMethod<[], [[bigint, bigint, string[]]], "view">

    getSubscription: TypedContractMethod<
        [subId: BigNumberish],
        [
            [bigint, bigint, string, string[]] & {
                balance: bigint
                reqCount: bigint
                owner: string
                consumers: string[]
            },
        ],
        "view"
    >

    pendingRequestExists: TypedContractMethod<[subId: BigNumberish], [boolean], "view">

    removeConsumer: TypedContractMethod<
        [subId: BigNumberish, consumer: AddressLike],
        [void],
        "nonpayable"
    >

    requestRandomWords: TypedContractMethod<
        [
            keyHash: BytesLike,
            subId: BigNumberish,
            minimumRequestConfirmations: BigNumberish,
            callbackGasLimit: BigNumberish,
            numWords: BigNumberish,
        ],
        [bigint],
        "nonpayable"
    >

    requestSubscriptionOwnerTransfer: TypedContractMethod<
        [subId: BigNumberish, newOwner: AddressLike],
        [void],
        "nonpayable"
    >

    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T

    getFunction(
        nameOrSignature: "acceptSubscriptionOwnerTransfer",
    ): TypedContractMethod<[subId: BigNumberish], [void], "nonpayable">
    getFunction(
        nameOrSignature: "addConsumer",
    ): TypedContractMethod<[subId: BigNumberish, consumer: AddressLike], [void], "nonpayable">
    getFunction(
        nameOrSignature: "cancelSubscription",
    ): TypedContractMethod<[subId: BigNumberish, to: AddressLike], [void], "nonpayable">
    getFunction(
        nameOrSignature: "createSubscription",
    ): TypedContractMethod<[], [bigint], "nonpayable">
    getFunction(
        nameOrSignature: "getRequestConfig",
    ): TypedContractMethod<[], [[bigint, bigint, string[]]], "view">
    getFunction(nameOrSignature: "getSubscription"): TypedContractMethod<
        [subId: BigNumberish],
        [
            [bigint, bigint, string, string[]] & {
                balance: bigint
                reqCount: bigint
                owner: string
                consumers: string[]
            },
        ],
        "view"
    >
    getFunction(
        nameOrSignature: "pendingRequestExists",
    ): TypedContractMethod<[subId: BigNumberish], [boolean], "view">
    getFunction(
        nameOrSignature: "removeConsumer",
    ): TypedContractMethod<[subId: BigNumberish, consumer: AddressLike], [void], "nonpayable">
    getFunction(
        nameOrSignature: "requestRandomWords",
    ): TypedContractMethod<
        [
            keyHash: BytesLike,
            subId: BigNumberish,
            minimumRequestConfirmations: BigNumberish,
            callbackGasLimit: BigNumberish,
            numWords: BigNumberish,
        ],
        [bigint],
        "nonpayable"
    >
    getFunction(
        nameOrSignature: "requestSubscriptionOwnerTransfer",
    ): TypedContractMethod<[subId: BigNumberish, newOwner: AddressLike], [void], "nonpayable">

    filters: {}
}
