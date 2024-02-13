<h1 align="center">smartRaffle</h1>

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

This is a frontend application to interact with deployed Raffle contract. Address and ABI are stored in "constants/" folder. You can use either network to interact with the contract, but it needs to be deployed on that network first. After connecting Trust Wallet or Metamask you can enter the raffle.

WalletConnect is disabled as it is not working properly on localhost. Therefore you should use Trust Wallet or Metamask.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Sass][Sass-lang.com]][Sass-url]
- [![Typescript][Typescriptlang.org]][Typescript-url]
- [![Next][Nextjs]][Next-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

After deploying the contract, set up the frontend by following the steps below.

### Installation

1. Clone the repo
    ```sh
    git clone https://github.com/Oleh325/solidity-course.git
    ```
2. Install yarn packages
    ```sh
    yarn install
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Run the frontend application by running the following command in the terminal:

```sh
yarn start
```

Visit "http://localhost:3000/" in your browser to interact with the contract. After connecting, the information about the raffle will appear. You can enter the raffle by clicking "Enter Raffle" button. The raffle starts whenever there's at least one player. The winner is chosen randomly and receives the contract's balance.


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
[Sass-lang.com]: https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white
[Sass-url]: https://sass-lang.com/
[Typescriptlang.org]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Nextjs]: https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white
[Next-url]: https://nextjs.org/
[Hardhat-url]: https://hardhat.org/
[Alchemy-url]: https://www.alchemy.com/