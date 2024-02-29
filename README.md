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

This is a sample "Simple Storage" project on Solidity, that was created by following the course "Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course" from freeCodeCamp at YouTube. The smart contract itself is a basic example of a contract that can store some data on the blockchain, in this particular case — an array of people and their favorite numbers. The contract can be deployed locally, or directly to the Testnet or Mainnet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![Node][Nodejs.org]][Node-url]
-   [![Typescript][Typescriptlang.org]][Typescript-url]
-   [![Solidity][Soliditylang.org]][Solidity-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Create a wallet in Metamask on Sepolia Testnet. Get some ETH to use for transaction fees using one of the many faucets available. Here's two that might work for you:

    #### Main Faucet: https://faucets.chain.link
    #### Backup Faucet: https://sepoliafaucet.com/

2. Clone the repo
    ```sh
    git clone https://github.com/Oleh325/solidity-course.git
    ```
    And switch to the ```ethers-simple-storage``` branch.
3. Install yarn packages
    ```sh
    yarn install
    ```
4. Create an account at [Alchemy.com][Alchemy-url], create an application on the current active Ethereum Testnet, and get the RPC URL
5. Create a ".env" file in the project's main directory. Add the RPC_URL, PRIVATE_KEY (the private key of the wallet you will be using on the test network to deploy the contract) and PRIVATE_KEY_PASSWORD (this one is custom)
    ```env
    RPC_URL=https://example.com/
    PRIVATE_KEY=0x000example000
    PRIVATE_KEY_PASSWORD=your_custom_password
    ```
6. Run the encryptKey.ts file to get your private key encrypted and stored locally at "./.encryptedKey.json"
7. Remove PRIVATE_KEY and PRIVATE_KEY_PASSWORD from your ".env" file

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

For deploying, run:

```sh
PRIVATE_KEY_PASSWORD=your_custom_password yarn ts-node deploy.ts
```

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
[Alchemy-url]: https://www.alchemy.com/
