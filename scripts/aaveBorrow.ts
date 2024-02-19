import { getWeth } from "./getWeth"
import { ethers, getNamedAccounts, network } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { ContractRunner } from "ethers"
import { ILendingPool } from "../typechain-types"

async function main() {
    // Get WETH
    await getWeth("1")
    const { deployer } = await getNamedAccounts()
    // Get the LendingPool address
    const signer = await ethers.getSigner(deployer)
    const lendingPool = await getLendingPool(signer)
    console.log("Lending pool address: ", await lendingPool.getAddress())

    // Deposit WETH into the AAVE lending pool
    const wethTokenAddress = networkConfig[network.name].wethContractAddress!
    await approveErc20(
        wethTokenAddress,
        await lendingPool.getAddress(),
        ethers.parseEther("1").toString(),
        signer,
    )
    console.log("Depositing...")
    const transaction = await lendingPool.deposit(
        wethTokenAddress,
        ethers.parseEther("1"),
        deployer,
        0,
    )
    await transaction.wait(1)
    console.log("Deposited 1 WETH into the AAVE lending pool")

    let { availableBorrowsETH, totalDebtETH } = await getBorrowerData(lendingPool, deployer)
    const daiEthPrice = await getDaiPrice()
    const daiAmountToBorrow = Number(availableBorrowsETH / daiEthPrice) * 0.95
    console.log("Borrowing DAI: ", daiAmountToBorrow)
    const daiAmountToBorrowWei = ethers.parseEther(daiAmountToBorrow.toString())

    // Borrow from the AAVE lending pool
    const daiAddress = networkConfig[network.name].daiContractAddress!
    console.log("Borrowing DAI from the AAVE lending pool...")
    await borrowDaiFromAave(daiAddress, lendingPool, daiAmountToBorrowWei.toString(), deployer)
    console.log("After borrowing DAI: ")
    await getBorrowerData(lendingPool, deployer)
    console.log("Repaying DAI to the AAVE lending pool...")
    await repayDaiToAave(daiAddress, lendingPool, daiAmountToBorrowWei.toString(), deployer, signer)
    console.log("After repaying DAI: ")
    await getBorrowerData(lendingPool, deployer)
}

async function repayDaiToAave(
    daiAddress: string,
    lendingPool: ILendingPool,
    daiAmountToRepay: string,
    signerAddress: string,
    signer: ContractRunner
) {
    await approveErc20(daiAddress, await lendingPool.getAddress(), daiAmountToRepay, signer)
    const repayTransaction = await lendingPool.repay(
        daiAddress,
        daiAmountToRepay,
        2,
        signerAddress,
    )
    await repayTransaction.wait(1)
    console.log(
        "Repaid ",
        ethers.formatEther(daiAmountToRepay),
        " DAI to the AAVE lending pool",
    )
}

async function borrowDaiFromAave(
    daiAddress: string,
    lendingPool: ILendingPool,
    daiAmountToBorrow: string,
    signerAddress: string,
) {
    const borrowTransaction = await lendingPool.borrow(
        daiAddress,
        daiAmountToBorrow,
        2,
        0,
        signerAddress,
    )
    await borrowTransaction.wait(1)
    console.log(
        "Borrowed ",
        ethers.formatEther(daiAmountToBorrow),
        " DAI from the AAVE lending pool",
    )
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.name].daiEthPriceFeed!,
    )
    const price = (await daiEthPriceFeed.latestRoundData()).answer
    console.log("DAI/ETH price: ", ethers.formatEther(price.toString()))
    return price
}

async function getBorrowerData(lendingPool: ILendingPool, borrower: string) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(borrower)
    console.log("Total collateral ETH: ", ethers.formatEther(totalCollateralETH.toString()))
    console.log("Total debt ETH: ", ethers.formatEther(totalDebtETH.toString()))
    console.log("Available borrows ETH: ", ethers.formatEther(availableBorrowsETH.toString()))
    return { totalDebtETH, availableBorrowsETH }
}

async function getLendingPool(deployer: ContractRunner) {
    const lendingPoolAddressesProvider = (
        await ethers.getContractAt(
            "ILendingPoolAddressesProvider",
            networkConfig[network.name].lendingPoolAddressesProvider!,
        )
    ).connect(deployer)
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = (await ethers.getContractAt("ILendingPool", lendingPoolAddress)).connect(
        deployer,
    )
    return lendingPool
}

async function approveErc20(
    erc20Address: string,
    spenderAddress: string,
    amountToSpend: string,
    signer: ContractRunner,
) {
    const erc20Token = (await ethers.getContractAt("IERC20", erc20Address)).connect(signer)
    const transaction = await erc20Token.approve(spenderAddress, amountToSpend)
    await transaction.wait(1)
    console.log(
        "Approved ",
        ethers.formatEther(amountToSpend),
        " of ",
        await erc20Token.symbol(),
        " for ",
        spenderAddress,
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
