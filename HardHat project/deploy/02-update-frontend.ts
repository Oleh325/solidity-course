import { HardhatRuntimeEnvironment } from "hardhat/types"
import fs from "fs"
import { network } from "hardhat"

const FRONTEND_ADDRESSES_PATH = "../Frontend/constants/contractAddresses.json"
const FRONTEND_ABI_PATH = "../Frontend/constants/contractABI.json"

const updateFrontend = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments } = hre

    if(process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        const chainId = network.config.chainId!.toString()
        const raffle = await deployments.get("Raffle")
        let currentAddresses: any = {}
        if(fs.existsSync(FRONTEND_ADDRESSES_PATH)) {
            currentAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_PATH, "utf8"))
        }
        if(chainId in currentAddresses) {
            if(!currentAddresses[chainId].includes(raffle.address)) {
                currentAddresses[chainId].push(raffle.address)
                currentAddresses[chainId].reverse()
            }
        } else {
            currentAddresses[chainId] = [raffle.address]
        }
        fs.writeFileSync(FRONTEND_ADDRESSES_PATH, JSON.stringify(currentAddresses))
        fs.writeFileSync(FRONTEND_ABI_PATH, JSON.stringify(raffle.abi))
    }
}

export default updateFrontend
updateFrontend.tags = ["all", "frontend"]
