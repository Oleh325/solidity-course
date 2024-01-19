<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This is a sample "FundMe" crowdfunding project on Solidity, that was created by following the course "Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course" from freeCodeCamp at YouTube. The project is written using HardHat Ethereum development environment. The contract can be deployed to Sepolia Testnet or Localhost. The contract is being automatically verified on Sepolia Etherscan. Everything is covered with tests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![Node][Nodejs.org]][Node-url]
-   [![Typescript][Typescriptlang.org]][Typescript-url]
-   [![Solidity][Soliditylang.org]][Solidity-url]
-   [<img src="https://i.ibb.co/vmt4rKJ/badge.jpg" alt="Hardhat logo" style="height: 25px; width:97px;"/>][Hardhat-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. **(OPTIONAL)** Create a wallet in Metamask on Sepolia Testnet. Get some ETH to use for transaction fees using one of the many faucets available. Here's two that might work for you:

    #### Main Faucet: https://faucets.chain.link
    #### Backup Faucet: https://sepoliafaucet.com/

2. Clone the repo
    ```sh
    git clone https://github.com/Oleh325/solidity-course.git
    ```
3. Install yarn packages
    ```sh
    yarn install
    ```
4. **(OPTIONAL)** Create an account at [Alchemy.com][Alchemy-url], create an application on the current active Ethereum Testnet, and get the RPC URL
5. Create a ".env" file and populate it with the following values:
    ```env
    SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/example - optional
    LOCALHOST_RPC_URL=http://127.0.0.1:8545/
    SEPOLIA_PRIVATE_KEY=0x000example000
    ETHERSCAN_API_KEY=your_etherscan_api_key
    ```
6. To compile the contract, run:
    ```sh
    yarn hardhat compile
    ```
    This will create an "artifacts" folder with the compiled contract and typechain files.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

To run tests locally, run:
```sh
yarn test
```

To run tests on Sepolia, run:
```sh
yarn test staging
```

For deploying on Sepolia Testnet, run:

```sh
yarn hardhat deploy --network sepolia
```

It will return the address of the deployed contract, which you can look up on Sepolia Testnet Etherscan: https://sepolia.etherscan.com/

To deploy the contract to Localhost, run:
```sh
yarn hardhat node
```
and in another terminal window run:
```sh
yarn hardhat deploy
```

All the info about the deployed contract will be displayed in the terminal window running the node. The contract address file is generated and saved to "deployments/sepolia" folder for staging tests. The contract address and ABI files are generated and saved to "Frontend/public" folder for testing frontend with Testnet or locally.

To interact with the contract, run:
```sh
yarn hardhat run scripts/fund.ts
```
for funding the contract, or:
```sh
yarn hardhat run scripts/withdraw.ts
```
for withdrawing the funds from the contract.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

You can contact me at: oleh325.work@gmail.com

Project Link: [https://github.com/Oleh325/solidity-course](https://github.com/Oleh325/solidity-course)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Please, check out <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052" alt="Youtube logo" style="height: 15px; width:22.5px;"/> <a href="https://www.youtube.com/@freecodecamp" style="color: red;">freeCodeCamp</a>
 and <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png?20220706172052" alt="Youtube logo" style="height: 15px; width:22.5px;"/> <a href="https://www.youtube.com/@PatrickAlphaC" style="color: red;">Patrick Collins</a> YouTube channels for great free development courses!


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/oleh-yatskiv-8746b820b/
[Nodejs.org]: https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Typescriptlang.org]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Soliditylang.org]: https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black
[Solidity-url]: https://soliditylang.org/
[Hardhat-url]: https://hardhat.org/
[Alchemy-url]: https://www.alchemy.com/