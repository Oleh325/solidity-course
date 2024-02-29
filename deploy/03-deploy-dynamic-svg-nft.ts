import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
} from "../hepler-hardhat-config"
import verify from "../utils/verify"
import { ethers } from "hardhat"
import fs from "fs"

const deployDynamicSVGNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    let priceFeedAddress: string
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await ethers.getContract("MockV3Aggregator")
        priceFeedAddress = await ethUSDAggregator.getAddress()
    } else {
        priceFeedAddress = networkConfig[chainId].ethUsdPriceFeed!
    }

    const lowSVG = fs.readFileSync("./images/dynamicNFT/frown.svg", "utf8")
    const highSVG = fs.readFileSync("./images/dynamicNFT/happy.svg", "utf8")

    log("Deploying NFT...")
    const args: any[] = [priceFeedAddress, lowSVG, highSVG]
    const dynamicSVGNFT = await deploy("DynamicSVGNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(dynamicSVGNFT.address, args)
        console.log("Dynamic SVG NFT verified!")
    }
}

export default deployDynamicSVGNFT
deployDynamicSVGNFT.tags = ["all", "dynamic", "svg", "main"]
