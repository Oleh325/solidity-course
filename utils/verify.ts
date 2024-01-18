import { run } from "hardhat"

const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verify contract on Etherscan...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        console.log("Contract source code verified!")
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract source code already verified!")
        } else {
            console.log(e)
        }
    }
}

export default verify
