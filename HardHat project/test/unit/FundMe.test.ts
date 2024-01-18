import { assert, expect } from "chai"
import { deployments, ethers, network } from "hardhat"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { developmentChains } from "../../helper-hardhat.config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe: FundMe
          let deployer: HardhatEthersSigner
          let mockV3Aggregator: MockV3Aggregator
          const sendValue = ethers.parseEther("1")
          beforeEach(async function () {
              deployer = (await ethers.getSigners())[0]
              await deployments.fixture(["all"])
              fundMe = (await ethers.getContractAt(
                  "FundMe",
                  (
                      await deployments.get("FundMe")
                  ).address
              )) as FundMe
              mockV3Aggregator = (await ethers.getContractAt(
                  "MockV3Aggregator",
                  (
                      await deployments.get("MockV3Aggregator")
                  ).address
              )) as MockV3Aggregator
          })

          describe("constructor", async function () {
              it("Sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  const expected = await mockV3Aggregator.getAddress()
                  assert.equal(response, expected)
              })
          })

          describe("receive and fallback", async function () {
              it("calls fund() when receiving ether", async function () {
                  // send 1 ether to the contract address
                  const fundTx = await deployer.sendTransaction({
                      to: fundMe.getAddress(),
                      value: sendValue,
                  })
                  await fundTx.wait(1)
                  const fundMeBalance = await ethers.provider.getBalance(
                      fundMe.getAddress()
                  )
                  assert.equal(fundMeBalance.toString(), sendValue.toString())
              })
              it("calls fund() when calling the fallback function", async function () {
                  // send 1 ether to the contract address
                  const nonExistentFuncSignature =
                      "nonExistentFunc(uint256,uint256)"
                  const fakeFundMe = new ethers.Contract(
                      await fundMe.getAddress(),
                      [
                          ...fundMe.interface.fragments,
                          `function ${nonExistentFuncSignature}`,
                      ],
                      deployer
                  )
                  const tx = fakeFundMe[nonExistentFuncSignature](5, 10)
                  await expect(tx).to.be.revertedWithCustomError(
                      {
                          interface: fundMe.interface,
                      },
                      "FundMe__NotEnoughSent"
                  )
              })
          })

          describe("fund", async function () {
              it("reverts if you don't send enough ether", async function () {
                  await expect(fundMe.fund()).to.be.revertedWithCustomError(
                      {
                          interface: fundMe.interface,
                      },
                      "FundMe__NotEnoughSent"
                  )
              })
              it("updates the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFundersAmountFunded(
                      deployer.getAddress()
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("adds funder to funders array", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  const deployerAddress = await deployer.getAddress()
                  assert.equal(response, deployerAddress)
              })
              it("should add the funder to the mapping once", async function () {
                  const accounts = await ethers.getSigners()
                  const signer = accounts[1]
                  const fundMeConnectedContract = await fundMe.connect(signer)
                  await fundMeConnectedContract.fund({ value: sendValue })
                  await fundMeConnectedContract.fund({ value: sendValue })
                  const response = await fundMe.getFundersAmountFunded(
                      signer.getAddress()
                  )

                  assert.equal(
                      (BigInt(2) * sendValue).toString(),
                      response.toString()
                  )
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single funder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.getAddress())
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.getAddress())
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, gasPrice } = transactionReceipt!
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.getAddress()
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.getAddress())
                  // Assert
                  assert.equal(endingFundMeBalance, BigInt(0))
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )
              })

              it("allows us to withdraw with multiple funders", async function () {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const signer = accounts[i]
                      const fundMeConnectedContract = await fundMe.connect(
                          signer
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.getAddress())
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.getAddress())

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipt!
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.getAddress()
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.getAddress())

                  // Assert

                  assert.equal(endingFundMeBalance, BigInt(0))
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )

                  // Check that the funders list has been reset

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getFundersAmountFunded(
                              accounts[i].getAddress()
                          ),
                          BigInt(0)
                      )
                  }
              })

              it("reverts if you are not the owner", async function () {
                  const accounts = await ethers.getSigners()
                  const signer = accounts[1]
                  const fundMeConnectedContract = await fundMe.connect(signer)
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      {
                          interface: fundMe.interface,
                      },
                      "FundMe__NotOwner"
                  )
              })
          })
      })
