import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import "hardhat-deploy"

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || ""
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.19",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: LOCALHOST_RPC_URL,
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}

export default config