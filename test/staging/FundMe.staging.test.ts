import { assert } from "chai"
import { network, ethers } from "hardhat"
import { FundMe } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { developmentChains } from "../../helper-hardhat.config"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe: FundMe
          let deployer: HardhatEthersSigner
          const sendValue = ethers.parseEther("0.02")
          beforeEach(async function () {
              deployer = (await ethers.getSigners())[0]
              fundMe = (await ethers.getContractAt(
                  "FundMe",
                  deployer.address
              )) as FundMe
          })

          it("allows people to fund and withdraw", async function () {
              fundMe.fund({ value: sendValue })
              await fundMe
                  .withdraw({
                      gasLimit: 100000,
                  })
                  .then((tx) => tx.wait(1))

              const balance = await ethers.provider.getBalance(
                  fundMe.getAddress()
              )
              assert.equal(balance.toString(), "0")
          })
      })
