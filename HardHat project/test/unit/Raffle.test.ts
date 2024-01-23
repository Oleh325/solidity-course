// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
// import { BigNumber } from "ethers"
import { network, deployments, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config.js"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async () => {
          let raffle: Raffle, vrfCoordinatorV2Mock: VRFCoordinatorV2Mock
          const chainId = network.config.chainId!

          beforeEach(async () => {
              const { deployer } = await ethers.getNamedSigners()
              await deployments.fixture(["all"])
              raffle = (await ethers.getContract("Raffle", deployer)) as Raffle
              vrfCoordinatorV2Mock = (await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer,
              )) as VRFCoordinatorV2Mock
          })

          describe("constructor", async () => {
              it("initializes the raffle correctly", async () => {
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId].keepersUpdateInterval)
              })
          })
      })
