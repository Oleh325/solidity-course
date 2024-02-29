import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains } from "../hepler-hardhat-config"
import { ethers } from "hardhat"
import { BasicNFT, RandomIPFSNFT, VRFCoordinatorV2Mock, DynamicSVGNFT } from "../typechain-types"

const mintNFTs: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, network } = hre
    const { deployer } = await getNamedAccounts()

    const basicNFT = await ethers.getContract("BasicNFT", deployer) as BasicNFT
    const basicMintTransaction = await basicNFT.mintNFT()
    await basicMintTransaction.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`)

    const randomIPFSNFT = await ethers.getContract("RandomIPFSNFT", deployer) as RandomIPFSNFT
    const mintFee = await randomIPFSNFT.getMintFee()

    await new Promise<void>(async (resolve, reject) => {
        setTimeout(resolve, 300000)
        randomIPFSNFT.once(randomIPFSNFT.filters.NFTMinted, async function () {
            resolve()
        })
        if (developmentChains.includes(network.name)) {
            const vrfCoordinatorV2Mock = (await ethers.getContract(
                "VRFCoordinatorV2Mock",
                deployer,
            )) as VRFCoordinatorV2Mock
            vrfCoordinatorV2Mock.addConsumer(await randomIPFSNFT.getSubscriptionId(), await randomIPFSNFT.getAddress())
            const randomIPFSMintTransaction = await randomIPFSNFT.requestNFT({ value: mintFee.toString() })
            const randomIPFSMintTransactionReceipt = await randomIPFSMintTransaction.wait(1)
            const requestEvent = await randomIPFSNFT.queryFilter(
                randomIPFSNFT.filters.NTFRequested,
                randomIPFSMintTransactionReceipt?.blockNumber,
                randomIPFSMintTransactionReceipt?.blockNumber,
            )
            const requestId = requestEvent[0]?.args?.requestId
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, await randomIPFSNFT.getAddress())
        } else {
            const randomIPFSMintTransaction = await randomIPFSNFT.requestNFT({ value: mintFee.toString() })
            const randomIPFSMintTransactionReceipt = await randomIPFSMintTransaction.wait(1)
        }
    })
    console.log(`RandomIPFS NFT index 0 has tokenURI: ${await randomIPFSNFT.tokenURI(0)}`)

    const highValue = ethers.parseEther("4000")
    const dynamicSVGNFT = await ethers.getContract("DynamicSVGNFT", deployer) as DynamicSVGNFT
    const dynamicMintTransaction = await dynamicSVGNFT.mintNFT(highValue.toString())
    await dynamicMintTransaction.wait(1)
    console.log(`Dynamic SVG NFT index 0 has tokenURI: ${await dynamicSVGNFT.tokenURI(0)}`)
}

export default mintNFTs
mintNFTs.tags = ["all", "mint"]
