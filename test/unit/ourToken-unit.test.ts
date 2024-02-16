import { assert, expect } from "chai"
import { deployments, ethers } from "hardhat"
import { INITIAL_SUPPLY } from "../../helper-hardhat-config.ts"
import { OurToken } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

describe("OurToken Unit Test", function () {
    let ourToken: OurToken, deployer: HardhatEthersSigner, user1: HardhatEthersSigner
    beforeEach(async function () {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]

        await deployments.fixture("all")
        const tokenAddress = (await deployments.get("OurToken")).address
        ourToken = await ethers.getContractAt("OurToken", tokenAddress)
    })

    it("Should have correct INITIAL_SUPPLY of token ", async function () {
        const totalSupply = await ourToken.totalSupply()
        assert.equal(totalSupply.toString(), ethers.utils.parseEther(INITIAL_SUPPLY).toString())
    })

    it("Should be able to transfer tokens successfully to an address", async function () {
        const tokensToSend = ethers.utils.parseEther("10")
        await ourToken.transfer(user1.address, tokensToSend)
        expect(await ourToken.balanceOf(user1.address)).to.equal(tokensToSend)
    })

    it("Should approve other address to spend token", async () => {
        const tokensToSpend = ethers.utils.parseEther("5")
        await ourToken.approve(deployer.address, tokensToSpend)
        const tokenAddress = (await deployments.get("OurToken")).address
        const ourToken1 = await ethers.getContractAt("OurToken", tokenAddress)
        ourToken1.connect(user1)
        await ourToken1.transferFrom(deployer.address, user1.address, tokensToSpend)
        expect(await ourToken1.balanceOf(user1.address)).to.equal(tokensToSpend)
    })
})
