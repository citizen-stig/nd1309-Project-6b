# Supply chain & data auditing

This repository contains an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

## How to run and test

1. Run ganache client, by executing `make run-ganache`. This will start ganache instance with Ethereum RPC. Keep this program running
1. Run tests by executing `make test`
1. Run web app by executing `make dev`. This will start web server and app will be availabe on  http://localhost:3000


## Project diagrams

Diagrams are available  in `diagrams` folder

## Libraries and Technologies

 * Solidity as smart contract language
 * All data is stored inside Ethereum's smart contract
 * Truffle framework for testing and deployments
 * Web3.js is used for interacting with contract from browser
 * HD Wallet and Infura is used for deployment

IPFS is not used in this project

## Contract on Rinkeby network

Contact address on Rinkeby Network:  [0x2fDBB4e546101700C3a2a9D26386dBc34880cC11](https://rinkeby.etherscan.io/address/0x2fdbb4e546101700c3a2a9d26386dbc34880cc11)

Deployment transcation is 0x02654aa939411ff5b0fb87c275cefa99bff166494ae3d602b3f1d4fcbd6f76de

Full output of deploy is available in [rinkeby_deploy.txt](rinkeby_deploy.txt)


## Acknowledgments

* Solidity
* Ganache-cli
* Truffle
* IPFS
