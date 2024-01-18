import { getNamedAccounts, ethers } from "hardhat"
import promptSync from "prompt-sync"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt(
        "FundMe",
        "0x538b4f0aDE3244a881259c1A90a46a753197f58f"
    )
    const prompt = promptSync()
    const amount = prompt("How much do you want to fund? (in ETH): ")
    console.log(`Funding with ${amount} ETH...`)
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther(amount),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
