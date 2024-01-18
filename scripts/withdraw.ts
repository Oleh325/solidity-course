import { getNamedAccounts, ethers } from "hardhat"

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt(
        "FundMe",
        "0x538b4f0aDE3244a881259c1A90a46a753197f58f"
    )
    console.log("Withdrawing...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("Withdrawn!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
