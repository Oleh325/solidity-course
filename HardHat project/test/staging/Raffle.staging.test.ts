import { assert, expect } from "chai"
import { network, ethers } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { Raffle } from "../../typechain-types"
import { BigNumberish } from "ethers"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", function () {
          let raffle: Raffle,
              raffleEntranceFee: BigNumberish,
              deployer: HardhatEthersSigner

          beforeEach(async function () {
              deployer = (await ethers.getNamedSigners()).deployer
              raffle = (await ethers.getContract("Raffle", deployer)) as Raffle
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink VRF and Chainlink Automation, we get a random winner", async function () {
                  const startingTimestamp = await raffle.getLatestTimestamp()
                  const accounts = await ethers.getSigners()
                  await new Promise<void>(async (resolve, reject) => {
                      raffle.once(raffle.filters.WinnerPicked, async function () {
                          console.log("WinnerPicked event emitted")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await ethers.provider.getBalance(accounts[0].address)
                              const endingTimestamp = await raffle.getLatestTimestamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, BigInt(0))
                              assert.equal(winnerEndingBalance.toString(), (winnerStartingBalance - enterTxGasSpent!).toString())
                              assert(endingTimestamp > startingTimestamp)
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })

                      const winnerStartingBalance = await ethers.provider.getBalance(accounts[0].address)                      
                      const enterTx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      const enterTxGasSpent = await enterTx.wait(1).then((receipt) => receipt?.fee)
                  })
              })
          })
      })