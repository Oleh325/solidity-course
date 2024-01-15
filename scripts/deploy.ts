import { ethers, run, network } from "hardhat"

async function main() {
    const simpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying...")
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment()
    const address = await simpleStorage.getAddress()
    console.log(`Deployed contract to: ${address}`)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block transactions...")
        await simpleStorage.deploymentTransaction()?.wait(6)
        await verify(address, [])
    }
    const currentFavNumber = await simpleStorage.retreive()
    console.log(`Current favourite number: ${currentFavNumber}`)

    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)

    const updatedFavNumber = await simpleStorage.retreive()
    console.log(`Updated favourite number: ${updatedFavNumber}`)
}

async function verify(contractAddress: string, args: any[]) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
