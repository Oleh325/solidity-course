import { ethers } from "ethers"
import { Contract } from "ethers"
import fs from "fs-extra"
import "dotenv/config"

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!)
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD!,
    )
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deploymentTransaction()!.wait(1)
    const address = await contract.getAddress()
    console.log(`Contract address: ${address}`)

    const currFavNumber = await (contract!.connect(contract!.runner) as Contract).retreive()
    console.log(`Current favourite number: ${currFavNumber.toString()}`)

    const transactionResponse = await (contract!.connect(contract!.runner) as Contract).store("7")
    await transactionResponse.wait(1)

    const updatedFavNumber = await (contract!.connect(contract!.runner) as Contract).retreive()
    console.log(`Updated favourite number: ${updatedFavNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
