import { BigNumberish } from "ethers"
import { ethers, network } from "hardhat"
import { Raffle, VRFCoordinatorV2Mock } from "../typechain-types"

async function mockKeepers() {
    const raffle: Raffle = await ethers.getContract("Raffle")
    const checkData = ethers.keccak256(ethers.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkData)
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData)
        const transactionReceipt = await tx.wait(1)
        const events = await raffle.queryFilter(
            raffle.filters.RequestedRaffleWinner,
            transactionReceipt?.blockNumber,
            transactionReceipt?.blockNumber,
        )
        const requestId = events[0].args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if (network.config.chainId == 31337) {
            await mockVrf(requestId, raffle)
        }
    } else {
        console.log("No upkeep needed!")
    }
}

async function mockVrf(requestId: BigNumberish, raffle: Raffle) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock =
        await ethers.getContract("VRFCoordinatorV2Mock")
    // get raffle's address
    const address = (await ethers.getContract("Raffle")).getAddress()
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, address)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
