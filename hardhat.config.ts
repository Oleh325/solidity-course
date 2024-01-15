import { HardhatUserConfig } from "hardhat/config"
import "dotenv/config"
import "@nomicfoundation/hardhat-toolbox"
import "./tasks/block-number.ts"
import "hardhat-gas-reporter"
import "solidity-coverage"

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/example"
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545/"
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

const config: HardhatUserConfig = {
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
    solidity: "0.8.19",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC"
    },
}

export default config
