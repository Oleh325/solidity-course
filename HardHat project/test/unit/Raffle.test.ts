import { assert, expect } from "chai"
import { network, deployments, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"
import { BigNumberish } from "ethers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", function () {
          let raffle: Raffle,
              vrfCoordinatorV2Mock: VRFCoordinatorV2Mock,
              raffleEntranceFee: BigNumberish,
              deployer: HardhatEthersSigner,
              interval: number
          const chainId = network.config.chainId!

          beforeEach(async function () {
              deployer = (await ethers.getNamedSigners()).deployer
              await deployments.fixture(["all"])
              raffle = (await ethers.getContract("Raffle", deployer)) as Raffle
              vrfCoordinatorV2Mock = (await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer,
              )) as VRFCoordinatorV2Mock
              raffleEntranceFee = await raffle.getEntranceFee()
              interval = Number(await raffle.getInterval())
          })

          describe("constructor", function () {
              it("initializes the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId].keepersUpdateInterval)
              })
          })

          describe("enterRaffle", function () {
              it("reverts when you don't send enough ETH", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
                      {
                          interface: raffle.interface,
                      },
                      "Raffle__NotEnoughETHEntered",
                  )
              })

              it("records players when they enter the raffle", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  assert.equal(playerFromContract, deployer.address)
              })

              it("emits an event when a player enters the raffle", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee }))
                      .to.emit(raffle, "RaffleEnter")
                      .withArgs(deployer.address)
              })

              it("doesn't allow entrance when raffle is not open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep("0x")
                  await expect(
                      raffle.enterRaffle({ value: raffleEntranceFee }),
                  ).to.be.revertedWithCustomError(
                      { interface: raffle.interface },
                      "Raffle__NotOpen",
                  )
              })
          })

          describe("checkUpkeep", function () {
              it("returns false if people haven't sent any eth", async function () {
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x")
                  assert(!upkeepNeeded)
              })

              it("returns false if raffle isn't open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  await raffle.performUpkeep("0x")
                  const raffleState = await raffle.getRaffleState()
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x")
                  assert.equal(raffleState.toString(), "1")
                  assert(!upkeepNeeded)
              })

              it("returns false if enough time hasn't passed", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x")
                  assert(!upkeepNeeded)
              })

              it("returns true if enough time has passed and people have sent eth and is open", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.checkUpkeep.staticCall("0x")
                  assert(upkeepNeeded)
              })
          })

          describe("performUpkeep", function () {
              it("can only run if checkUpkeep returns true", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  const transaction = await raffle.performUpkeep("0x")
                  assert(transaction)
              })

              it("reverts if checkUpkeep returns false", async function () {
                  await expect(raffle.performUpkeep("0x")).to.be.revertedWithCustomError(
                      { interface: raffle.interface },
                      "Raffle__UpkeepNotNeeded",
                  )
              })

              it("updates the raffle state, emits an event, calls the vrf coordinator", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
                  const transactionResponse = await raffle.performUpkeep("0x")
                  const transactionReceipt = await transactionResponse.wait(1)
                  const events = await raffle.queryFilter(
                      raffle.filters.RequestedRaffleWinner,
                      transactionReceipt?.blockNumber,
                      transactionReceipt?.blockNumber,
                  )
                  const requestId = events[0].args.requestId
                  assert(requestId > 0)
                  const raffleState = await raffle.getRaffleState()
                  assert(raffleState.toString() === "1")
              })
          })

          describe("fulfillRandomWords", function () {
              beforeEach(async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval + 1])
                  await network.provider.send("evm_mine", [])
              })

              it("can only be called after performUpkeep", async function () {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.getAddress()),
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.getAddress()),
                  ).to.be.revertedWith("nonexistent request")
              })

              it("picks a winner, resets the lottery, and sends the winner their winnings", async function () {
                  const additionalEntrants = 3
                  const startingAccountIndex = 1
                  const accounts = await ethers.getSigners()
                  for (
                      let i = startingAccountIndex;
                      i < startingAccountIndex + additionalEntrants;
                      i++
                  ) {
                      const signer = raffle.connect(accounts[i])
                      await signer.enterRaffle({ value: raffleEntranceFee })
                  }
                  const startingTimestamp = await raffle.getLatestTimestamp()

                  await new Promise<void>(async (resolve, reject) => {
                      raffle.once(raffle.filters.WinnerPicked, async function () {
                          console.log("Found the event!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const endingTimestamp = await raffle.getLatestTimestamp()
                              const numPlayers = await raffle.getNumberOfPlayers()
                              const winnerEndingBalance = await ethers.provider.getBalance(
                                  accounts[startingAccountIndex].address,
                              )
                              assert.equal(numPlayers.toString(), "0")
                              assert.equal(raffleState.toString(), "0")
                              assert(endingTimestamp > startingTimestamp)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  (
                                      winnerStartingBalance +
                                      BigInt(raffleEntranceFee) * BigInt(additionalEntrants) +
                                      BigInt(raffleEntranceFee)
                                  ).toString(),
                              )
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      const transaction = await raffle.performUpkeep("0x")
                      const transactionReceipt = await transaction.wait(1)
                      const winnerStartingBalance = await ethers.provider.getBalance(
                          accounts[startingAccountIndex].address,
                      )
                      const events = await raffle.queryFilter(
                          raffle.filters.RequestedRaffleWinner,
                          transactionReceipt?.blockNumber,
                          transactionReceipt?.blockNumber,
                      )
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          events[0].args.requestId,
                          raffle.getAddress(),
                      )
                  })
              })
          })

          describe("get constants", () => {
              it("returns number of words", async function () {
                  const numWords = await raffle.getNumWords()
                  assert.equal(numWords.toString(), "1")
              })

              it("returns network confirmations", async function () {
                  const confirmations = await raffle.getRequestConfirmations()
                  assert.equal(confirmations.toString(), "3")
              })
          })
      })
