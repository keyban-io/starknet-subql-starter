import assert from "assert";
// Face TextEncoder though sandbox
import {hash, num,validateAndParseAddress} from "starknet";
import {StarknetLog, StarknetTransaction} from "@subql/types-starknet";
import {Deposit, Withdraw} from "../types/models";
import {BigNumber, BigNumberish} from "ethers";

/***
 *
 *     "kind": "struct",
 *     "name": "zklend::market::Market::Deposit",
 *     "type": "event",
 *     "members": [
 *       {
 *         "kind": "data",
 *         "name": "user",
 *         "type": "core::starknet::contract_address::ContractAddress"
 *       },
 *       {
 *         "kind": "data",
 *         "name": "token",
 *         "type": "core::starknet::contract_address::ContractAddress"
 *       },
 *       {
 *         "kind": "data",
 *         "name": "face_amount",
 *         "type": "core::felt252"
 *       }
 *     ]
 *
 */

type DespositEvent = {
  user: BigNumberish,
  token: BigNumberish,
  face_amount: string,
}
type DespositArgs = {
  "zklend::market::Market::Deposit":DespositEvent,
  block_hash: string,
  block_number: number,
  transaction_hash: string,
}


// @ts-ignore
type DepositLog = StarknetLog<DespositArgs>

// Custom method replace "num.toHexString", due to sandbox TextEncoder issue
//  at utf8ToBytes (webpack://stark-starter/./node_modules/@scure/starknet/node_modules/@noble/hashes/utils.js:109:31)
function convertBigNumberish(bigNumberish:BigNumberish):string{
  const bigNumber = BigNumber.from(bigNumberish);
  const hexValue = bigNumber.toHexString();
  return hexValue;
}

export async function handleLog(log: DepositLog): Promise<void> {
  logger.info(`New deposit event at block ${log.blockNumber}`);
  assert(log.args, "No log.args");
  const event = log.args["zklend::market::Market::Deposit"];
  const user = convertBigNumberish(event.user);
  const token = convertBigNumberish(event.token);
  const deposit = Deposit.create({
    id: `${log.transactionHash}_${user}`,
    token: token,
    amount: BigInt(event.face_amount),
    user: user,
  });
  logger.info(`deposit ${deposit.id}`)
  logger.info(`token ${token}, amount ${deposit.amount}`)
  await deposit.save();
}

type WithdrawTransaction = StarknetTransaction

export async function handleTransaction(tx: WithdrawTransaction): Promise<void> {
  logger.info(`New Withdraw transaction at block ${tx.blockNumber}`);
  assert(tx.decodedCalls, "No tx decodedCalls");

  for(let i=0; i<tx.decodedCalls.length; i++){
    const call = tx.decodedCalls[i];
    // Because the entire invoke transaction is returned, so we need to filter out the calls with filter here again
    // This should not have major impact on performance
    if(call.selector === "0x015511cc3694f64379908437d6d64458dc76d02482052bfb8a5b33a72c054c77"
        || call.selector === "0x15511cc3694f64379908437d6d64458dc76d02482052bfb8a5b33a72c054c77"
    ){
      const withdraw = Withdraw.create({
        id: `${tx.hash}_${i}`,
        user: tx.from,
        token: convertBigNumberish(call.decodedArgs.token),
        amount: BigInt(call.decodedArgs.amount)
      });
      logger.info(`withdraw at ${withdraw.id}`)
      await withdraw.save();
    }
  }
}
