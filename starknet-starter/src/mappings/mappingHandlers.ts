import { StarknetLog } from "@subql/types-starknet";
import { BigNumber } from "ethers";

import { createtppTransferDatasource } from "../types";

/***
 *
 * 
 *     {
 *       "data": [
 *         {
 *           "name": "address",
 *           "type": "felt"
 *         },
 *         {
 *           "name": "deployer",
 *           "type": "felt"
 *         },
 *         {
 *           "name": "unique",
 *           "type": "felt"
 *         },
 *         {
 *           "name": "classHash",
 *           "type": "felt"
 *         },
 *         {
 *           "name": "calldata_len",
 *           "type": "felt"
 *         },
 *         {
 *           "name": "calldata",
 *           "type": "felt*"
 *         },
 *         {
 *           "name": "salt",
 *           "type": "felt"
 *         }
 *       ],
 *       "keys": [],
 *       "name": "ContractDeployed",
 *       "type": "event"
 *     },
 * 
 */

type ContractDeployedEvent = {
    address: any;
    deployer: any;
    unique: any;
    classHash: any;
    calldata_len: any;
    calldata: any;
    salt:       any;        
 };

type ContractDeployedArgs = {
  "ContractDeployed": ContractDeployedEvent;
  block_hash: string;
  block_number: number;
  transaction_hash: string;
};

// @ts-ignore
type ContractDeployedLog = StarknetLog<ContractDeployedArgs>;

 /**
  * 
  *  "type": "event",
  *  "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
  *  "kind": "struct",
  *  "members": [
  *    {
  *      "name": "from",
  *      "type": "core::starknet::contract_address::ContractAddress",
  *      "kind": "key"
  *    },
  *    {
  *      "name": "to",
  *      "type": "core::starknet::contract_address::ContractAddress",
  *      "kind": "key"
  *    },
  *    {
  *      "name": "token_id",
  *      "type": "core::integer::u256",
  *      "kind": "key"
  *    }
  *  ]
  * 
  */

 type TransferEvent = {
    from: any;
    to: any;
    token_id: any;
  };

type TransferArgs = {
  "openzeppelin_token::erc721::erc721::ERC721Component::Transfer": TransferEvent;
  block_hash: string;
  block_number: number;
  transaction_hash: string;
};

/// type TransferArgs = {
///   [_: string]: {
///     from: bigint;
///     to: bigint;
///     token_id: bigint;
///   };
/// };

// @ts-ignore
type TransferLog = StarknetLog<TransferArgs>;

/**
 * 
 *     "type": "event",
 *     "name": "contracts::contract_factory::KeybanContractFactory::KeybanContractDeployed",
 *     "kind": "struct",
 *     "members": [
 *       {
 *         "name": "class_hash",
 *         "type": "core::felt252",
 *         "kind": "key"
 *       },
 *       {
 *         "name": "address",
 *         "type": "core::felt252",
 *         "kind": "key"
 *       }
 *     ]
 * 
 * 
 */

type KeybanContractDeployedEvent = {
    class_hash: any;
    address: any;
  };

type KeybanContractDeployedArgs = {
  "KeybanContractDeployed": KeybanContractDeployedEvent;
  block_hash: string;
  block_number: number;
  transaction_hash: string;
};

// @ts-ignore
type KeybanContractDeployedLog = StarknetLog<KeybanContractDeployedArgs>;


async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handleContractDeployed(log: ContractDeployedLog): Promise<void> {
  await sleep(2000);
  logger.info(`New ContractDeployed event at block ${log.blockNumber}`);
  const deployedContractAddress = BigNumber.from(log.args?.ContractDeployed.address).toHexString();
  logger.info(`Contrat deployed: ${deployedContractAddress}`);
  // debug(log);
  createtppTransferDatasource({
    address: deployedContractAddress,
  });
}

export async function handleTransfer(log: TransferLog): Promise<void> {
  await sleep(2000);
  logger.info(`New Tpp Transfer event at block ${log.blockNumber}`);
  // debug(log);
}

export async function emptyHandler(log: StarknetLog): Promise<void> {
  await sleep(2000);
  logger.info(`Empty handler at block ${log.blockNumber}`);
}

export async function handleTransferDynamically(log: TransferLog): Promise<void> {
  await sleep(2000);
  logger.info(`New Tpp Transfer event at block ${log.blockNumber} with dynamic handler`);
}

export const debug = (value: any) =>
  logger.info(
    JSON.parse(
      JSON.stringify(
        value,
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      ),
    ),
  );