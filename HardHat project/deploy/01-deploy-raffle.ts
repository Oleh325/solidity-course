import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config.js"
import { ethers } from "hardhat"
import verify from "../utils/verify"

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2")

const deployRaffle = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!
    let vrfCoordinatorV2Address
    let subscriptionId

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Address = (await deployments.get("VRFCoordinatorV2Mock")).address
        const vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock",
            vrfCoordinatorV2Address,
        )
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt?.logs?.[0]?.topics?.[1]!
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    const entranceFee = networkConfig[chainId].raffleEntranceFee
    const gasLane = networkConfig[chainId].gasLane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const keepersUpdateInterval = networkConfig[chainId].keepersUpdateInterval
    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        keepersUpdateInterval,
    ]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying on Etherscan...")
        await verify(raffle.address, args)
    }

    log("----------------------------------------------")
}

export default deployRaffle
deployRaffle.tags = ["all", "raffle"]
