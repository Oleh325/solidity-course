import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { networkConfig, developmentChains } from "../helper-hardhat.config"
import verify from "../utils/verify"
import fs from "fs"

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let ethUsdPriceFeedAddress: string
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }

    if (!developmentChains.includes(network.name)) {
        fs.writeFileSync("deployments/sepolia/fundMeAddress.txt", fundMe.address)
        fs.writeFileSync("../Frontend/public/fundMeAddress.txt", fundMe.address)
        fs.writeFileSync("../Frontend/public/fundMeABI.json", JSON.stringify(fundMe.abi))
    } else {
        fs.writeFileSync("../Frontend/public/fundMeAddress.local.txt", fundMe.address)
        fs.writeFileSync("../Frontend/public/fundMeABI.local.json", JSON.stringify(fundMe.abi))
    }
}

export default deployFundMe
deployFundMe.tags = ["all", "fundMe"]
