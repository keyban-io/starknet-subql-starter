import {
  StarknetProject,
  StarknetDatasourceKind,
  StarknetHandlerKind,
} from "@subql/types-starknet";

import * as dotenv from "dotenv";
import path from "path";

const mode = process.env.NODE_ENV || "production";

// Load the appropriate .env file
const dotenvPath = path.resolve(
  __dirname,
  `.env${mode !== "production" ? `.${mode}` : ""}`
);

dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the generic param
const project: StarknetProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "starknet-starter",
  description:
    "This project can be use as a starting point for developing your new Starknet SubQuery project",
  runner: {
    node: {
      name: "@subql/node-starknet",
      version: "*",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the Chain ID, for Starknet mainnet this is 0x534e5f4d41494e
     * https://docs.metamask.io/services/reference/starknet/json-rpc-methods/starknet_chainid/
     */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.ENDPOINT!?.split(",") as string[] | string,
  },
  dataSources: [
//     {
//       kind: StarknetDatasourceKind.Runtime,
//       startBlock: 205,
//       endBlock: 220,
//       mapping: {
//         file: "./dist/index.js",
//         handlers: [
//           /// Static data source handler
//           {
//             kind: StarknetHandlerKind.Event,
//             handler: "emptyHandler",
//           },
//         ],
//       },
//     },
    {
      kind: StarknetDatasourceKind.Runtime,
      startBlock: 205,
      endBlock: 220,
      options: {
        abi: "udc",
        address:
           "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf", 
      },
      assets: new Map([
        ["udc", { file: "./abis/udc.abi.json" }], 
      ]),

      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: StarknetHandlerKind.Event,
            handler: "handleContractDeployed",
            filter: {
              topics: [
                "ContractDeployed", 
              ],
            },
          },
        ],
      },
    },
    // {
    //   kind: StarknetDatasourceKind.Runtime,
    //   startBlock: 205,
    //   endBlock: 220,
    //   options:{
    //     abi: "tpp",
    //     address: "0x026432b99835556745918e5fc8507105eeecfeeaf0fb375d3fa5014422a49ca0",
    //   },
    //   assets: new Map([
    //     ["tpp", { file: "./abis/tpp.abi.json" }] 
    //   ]),
    //   mapping: {
    //     file: "./dist/index.js",
    //     handlers: [
    //       {
    //         kind: StarknetHandlerKind.Event,
    //         handler: "handleTransfer",
    //         filter: {
    //           topics: [
    //             "Transfer", 
    //           ],
    //         },
    //       },
    //     ],
    //   }
    // },
  ],
  templates: 
    [
      {
        kind: StarknetDatasourceKind.Runtime,
        name: "tppTransfer",
        options:{
          abi: "tpp",
        },
        assets: new Map([
          ["tpp", { file: "./abis/tpp.abi.json" }] 
        ]),
        mapping: {
          file: "./dist/index.js",
          handlers: [
            {
              kind: StarknetHandlerKind.Event,
              handler: "handleTransferDynamically",
              filter: {
                topics: [
                  "Transfer", 
                ],
              },
            },
          ],
        }
      }
    ],
  
  repository: "https://github.com/subquery/starknet-subql-starter",
};

// Must set default to the project instance
export default project;
