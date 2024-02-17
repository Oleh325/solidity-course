import { ethers, getNamedAccounts, network } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"

export async function getWeth(amount: string) {
    const deployer = await getNamedAccounts()
    // call the "deposit" function of the WETH contract
    const wethAddress = networkConfig[network.name].wethContractAddress!
    const iWeth = (
        await ethers.getContractAt("IWeth", wethAddress)
    ).connect(await ethers.getSigner(deployer.deployer))
    const transaction = await iWeth.deposit({ value: ethers.parseEther(amount) })
    await transaction.wait()
    const wethBalance = await iWeth.balanceOf(deployer.deployer)
    console.log("Got WETH balance of: ", ethers.formatEther(wethBalance), " WETH")
}
