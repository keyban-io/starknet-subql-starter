import { StarknetLog } from "@subql/types-starknet";

import { createtppTransferDatasource } from "../types";
import {BigNumber} from "ethers";

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

export async function handleKeybanContractDeployed(log: KeybanContractDeployedLog): Promise<void> {
  await sleep(2000);
  const [, classHash, contractAddress] = log.topics;
  logger.info(`New KeybanContractDeployed event at block ${log.blockNumber}`);
  //debug(log);
  logger.info(`Contrat deployed: ${contractAddress}, class hash: ${classHash}`);

  if (classHash.toLowerCase() === "0x465f43678bed94c77425be409c7e7a1dea76db331f0520db3eafeff1d2d46e2".toLowerCase()) { // tpp contract
    await createtppTransferDatasource({
      address: contractAddress,
    });
  }
}

export async function handleTransfer(log: TransferLog): Promise<void> {
  await sleep(2000);
  logger.info(`New Tpp Transfer event at block ${log.blockNumber}`);
  // debug(log);
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