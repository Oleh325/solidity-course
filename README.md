<h1 align="center">NFT starter</h1>

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

This is a sample NFT project on Solidity, that was created by following the course "Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course" from freeCodeCamp at YouTube.
It has:
1. Basic NFT contract with image URI stored on the IPFS
2. Random NFT contract, that gets a random number from an Chainlink VRF node, and has a different image URI depending on the result
3. Dynamic SVG NFT contract, that gets information about the ETH price from Chainlink Price Feeds and generates happy or frowned face depending on the price relative to the one set while minting. The URI is stored on chain, and is Base64 encoded

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![Node][Nodejs.org]][Node-url]
-   [![Typescript][Typescriptlang.org]][Typescript-url]
-   [![Solidity][Soliditylang.org]][Solidity-url]
-   [<img src="https://i.ibb.co/vmt4rKJ/badge.jpg" alt="Hardhat logo" style="height: 25px; width:97px;"/>][Hardhat-url]
-   [![Chainlink][Chain.link]][Chainlink-url]
-   [<img src="https://i.ibb.co/6rDd1Y1/IPFS-logo.png" alt="IPFS logo" style="height: 25px; width:58px;"/>][IPFS-url]

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
    And switch to the ```ultimate-nft``` branch.
3. Install yarn packages
    ```sh
    yarn install
    ```
4. **(OPTIONAL)** Create an account at [Alchemy.com][Alchemy-url], create an application on the current active Ethereum Testnet, and get the RPC URL
5. Create a ".env" file and populate it with the following values:
    ```env
    SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/example - optional
    LOCALHOST_RPC_URL=http://127.0.0.1:8545/
    SEPOLIA_PRIVATE_KEY=0x000example000 - optional
    ETHERSCAN_API_KEY=your_etherscan_api_key - optional
    COINMARKETCAP_API_KEY=your_coinmarketcap_api_key - optional
    PINATA_API_KEY=your_pinata_api_key - optional, only if you want to upload to IPFS via Pinata
    PINATA_API_SECRET=your_pinata_api_secret - optional, only if you want to upload to IPFS via Pinata
    PINATA_SECRET_JWT=yout_pinata_secret_jwt - optional, only if you want to upload to IPFS via Pinata
    UPLOAD_TO_PINATA=false - set to true if you want to upload to IPFS via Pinata
    ```
6. To compile the contract, run:
    ```sh
    yarn hardhat compile
    ```
    This will create an "artifacts" folder with the compiled contract and typechain files.
7. **(OPTIONAL)** If you want to deploy the contract to Sepolia Testnet, you need to register an VRF subscription at https://vrf.chain.link/. Don't forget to update all the values at "helper-hardhat-config.json". After deploying, simply add RandomIPFSNFT contract as a consumer.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

You can use "uploadToPinata.ts" script to upload images to the IPFS using Pinata. For that you need to set the appropriate values in the ".env" file. The uploading is done automatically when you run the deployment script for the Random IPFS NFT contract.

To run tests locally, run:
```sh
hh test
```

For deploying locally, run:
```sh
hh node
```
And in another terminal window:
```sh
hh deploy --tags main
```

Then you can mint NFTs using the mint script:
```sh
hh deploy --tags mint
```

For deploying on Sepolia Testnet, run:

```sh
hh deploy --network sepolia --tags main
```

It will return the addressess of the deployed contracts, which you can look up on Sepolia Testnet Etherscan: https://sepolia.etherscan.com/

Then you can mint NFTs using the mint script:
```sh
hh deploy --network sepolia --tags mint
```

You can then check your NFTs on Sepolia Testnet OpenSea: https://testnets.opensea.io/

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
[Chain.link]: https://img.shields.io/badge/Chainlink-375BD2?style=for-the-badge&logo=Chainlink&logoColor=white
[Chainlink-url]: https://chain.link/
[Hardhat-url]: https://hardhat.org/
[IPFS-url]: https://ipfs.tech/
[Alchemy-url]: https://www.alchemy.com/