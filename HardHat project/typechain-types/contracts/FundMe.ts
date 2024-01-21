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
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface FundMeInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "MINIMUM_USD"
      | "fund"
      | "getFunder"
      | "getFundersAmountFunded"
      | "getOwner"
      | "getPriceFeed"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MINIMUM_USD",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "fund", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getFunder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFundersAmountFunded",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPriceFeed",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "MINIMUM_USD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getFunder", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getFundersAmountFunded",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPriceFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export interface FundMe extends BaseContract {
  connect(runner?: ContractRunner | null): FundMe;
  waitForDeployment(): Promise<this>;

  interface: FundMeInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  MINIMUM_USD: TypedContractMethod<[], [bigint], "view">;

  fund: TypedContractMethod<[], [void], "payable">;

  getFunder: TypedContractMethod<[index: BigNumberish], [string], "view">;

  getFundersAmountFunded: TypedContractMethod<
    [funder: AddressLike],
    [bigint],
    "view"
  >;

  getOwner: TypedContractMethod<[], [string], "view">;

  getPriceFeed: TypedContractMethod<[], [string], "view">;

  withdraw: TypedContractMethod<[], [void], "payable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "MINIMUM_USD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "fund"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "getFunder"
  ): TypedContractMethod<[index: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getFundersAmountFunded"
  ): TypedContractMethod<[funder: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getOwner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPriceFeed"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "payable">;

  filters: {};
}
