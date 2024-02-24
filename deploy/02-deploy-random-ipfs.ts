import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../hepler-hardhat-config"
import verify from "../utils/verify"
import { storeImages, storeTokenURIMetadata } from "../utils/uploadToPinata"
import { ethers } from "hardhat"
import { networkConfig } from "../hepler-hardhat-config"

const VRF_SUB_FUND_AMOUNT = "1000000000000000000000"
const IMAGES_PATH = "./images/randomNFT"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

const deployNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!
    let VRFCoordinatorV2Address: string,
        subscriptionId,
        tokenURIs: string[] = [
            'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',
            'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',
            'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm'
        ]

    if (process.env.UPLOAD_TO_PINATA === "true") {
        tokenURIs = await handleTokenURIs()
    }

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    if (developmentChains.includes(network.name)) {
        VRFCoordinatorV2Address = (await deployments.get("VRFCoordinatorV2Mock")).address
        const vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock",
            VRFCoordinatorV2Address,
        )
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt?.logs?.[0]?.topics?.[1]!
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        VRFCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2!
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("Deploying Random IPFS NFT...")

    const args = [
        VRFCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenURIs,
        networkConfig[chainId].mintFee,
    ]

    const randomIPFSNFT = await deploy("RandomIPFSNFT", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    console.log("Random IPFS NFT deployed to: ", randomIPFSNFT.address)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(randomIPFSNFT.address, args)
        console.log("Random IPFS NFT verified!")
    }    
}

async function handleTokenURIs() {
    const tokenURIs: string[] = []
    const { responses, files } = await storeImages(IMAGES_PATH)
    for (let responseIndex in responses) {
        let tokenURIMetadata = { ...metadataTemplate }
        tokenURIMetadata.name = files[responseIndex].replace(".png", "")
        tokenURIMetadata.description = `An adorable ${tokenURIMetadata.name} pup!`
        tokenURIMetadata.image = `ipfs://${responses[responseIndex].IpfsHash}`
        console.log(`Uploading ${tokenURIMetadata.name} metadata to Pinata...`)
        const metadataUploadResponse = await storeTokenURIMetadata(tokenURIMetadata)
        tokenURIs.push(`ipfs://${metadataUploadResponse!.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are: ")
    console.log(tokenURIs)
    return tokenURIs
}

export default deployNFT
deployNFT.tags = ["all", "random-ipfs", "main"]
