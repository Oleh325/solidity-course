import { developmentChains } from "../../hepler-hardhat-config"
import { network, deployments, ethers } from "hardhat"
import { expect } from "chai"
import { RandomIPFSNFT, VRFCoordinatorV2Mock } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { networkConfig } from "../../hepler-hardhat-config"
import { ContractTransactionReceipt } from "ethers"
import { assert } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RandomIPFSNFT", function () {
          let randomIPFSNFT: RandomIPFSNFT, deployer: HardhatEthersSigner

          beforeEach(async function () {
              deployer = (await ethers.getNamedSigners()).deployer
              await deployments.fixture(["all"])
              randomIPFSNFT = (await ethers.getContract("RandomIPFSNFT", deployer)) as RandomIPFSNFT
          })

          describe("Should deploy with the right attributes", async function () {
              it("Should have the right name", async function () {
                  expect(await randomIPFSNFT.name()).to.equal("Random Doggie")
              })

              it("Should have the right symbol", async function () {
                  expect(await randomIPFSNFT.symbol()).to.equal("RDOG")
              })

              it("Should have the an initial token count of 0", async function () {
                  expect(await randomIPFSNFT.getTokenCounter()).to.equal(0)
              })

              it("Should return the correct mint fee", async function () {
                  expect(await randomIPFSNFT.getMintFee()).to.equal(
                      networkConfig[network.config.chainId!].mintFee,
                  )
              })

              it("Should return the correct chances array", async function () {
                  const chanceArray = await randomIPFSNFT.getChanceArray()
                  const expectedChances = [10, 30, 100]
                  for (let chanceIndex in chanceArray) {
                      expect(chanceArray[chanceIndex]).to.equal(expectedChances[chanceIndex])
                  }
              })

              it("Should return the correct URIs", async function () {
                  const tokenURIs: string[] = [
                      "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
                      "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
                      "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
                  ]
                  const contractURIs = await randomIPFSNFT.getDogTokenURIs()
                  for (let URIindex in tokenURIs) {
                      expect(contractURIs[URIindex]).to.equal(tokenURIs[URIindex])
                  }
              })
          })

          describe("Should get a correct breed", async function () {
              it("Should get a correct breed from given chance", async function () {
                  const chancesToTry = [0, 9, 10, 39, 40, 99, 100]
                  const expectedBreeds = [
                      "Pug",
                      "Pug",
                      "Shiba Inu",
                      "Shiba Inu",
                      "St. Bernard",
                      "St. Bernard",
                  ]
                  const breedFromStruct = (breedIndex: Number) => {
                      switch (breedIndex) {
                          case 0:
                              return "Pug"
                          case 1:
                              return "Shiba Inu"
                          case 2:
                              return "St. Bernard"
                          default:
                              return undefined
                      }
                  }
                  for (let chanceIndex in chancesToTry) {
                      if (chanceIndex === String(chancesToTry.length - 1)) {
                          expect(
                              breedFromStruct(
                                  Number(
                                      await randomIPFSNFT.getBreedFromModdedRNG(
                                          chancesToTry[chanceIndex],
                                      ),
                                  ),
                              ),
                          ).to.be.revertedWithCustomError({
                            interface: randomIPFSNFT.interface
                          }, "RandomIPFSNFT__RangeOutOfBounds")
                          break
                      }
                      expect(
                          breedFromStruct(
                              Number(
                                  await randomIPFSNFT.getBreedFromModdedRNG(
                                      chancesToTry[chanceIndex],
                                  ),
                              ),
                          ),
                      ).to.equal(expectedBreeds[chanceIndex])
                  }
              })
          })

          describe("Should request, mint an NFT", async function () {
              let mintReceipt: ContractTransactionReceipt | null, vrfCoordinatorV2Mock: VRFCoordinatorV2Mock

              beforeEach(async function () {
                  vrfCoordinatorV2Mock = (await ethers.getContract(
                      "VRFCoordinatorV2Mock",
                      deployer,
                  )) as VRFCoordinatorV2Mock
                  vrfCoordinatorV2Mock.addConsumer(await randomIPFSNFT.getSubscriptionId(), randomIPFSNFT.getAddress())
                  const mintFee = await randomIPFSNFT.getMintFee()
                  const mintTransaction = await randomIPFSNFT.requestNFT({ value: mintFee })
                  mintReceipt = await mintTransaction.wait(1)
              })

              it("Should revert if mint fee is not enough", async function () {
                    const mintFeeModified = Number(await randomIPFSNFT.getMintFee()) - 1
                    expect(
                        randomIPFSNFT.requestNFT({ value: mintFeeModified }),
                    ).to.be.revertedWithCustomError({
                        interface: randomIPFSNFT.interface
                    }, "RandomIPFSNFT__InsufficientFunds")
              })

              it("Should request an NFT and emit an event", async function () {
                  const mintEvent = await randomIPFSNFT.queryFilter(
                      randomIPFSNFT.filters.NTFRequested,
                      mintReceipt?.blockNumber,
                      mintReceipt?.blockNumber,
                  )
                  const requestId = mintEvent[0].args.requestId
                  const messageSender = mintEvent[0].args.sender
                  assert(requestId > 0)
                  expect(messageSender).to.equal(await deployer.getAddress())
              })

              it("Should mint an NFT, emit an event and increase token counter (fulfillRandomWords)", async function () {
                  await new Promise<void>(async (resolve, reject) => {
                      randomIPFSNFT.once(randomIPFSNFT.filters.NFTMinted, async function () {
                          try {
                              const mintEvent = await randomIPFSNFT.queryFilter(
                                  randomIPFSNFT.filters.NFTMinted
                              )
                              const dogBreed = mintEvent[0].args.dogBreed
                              const NFTowner = mintEvent[0].args.owner
                              assert(dogBreed >= 0 && dogBreed <= 2)
                              expect(NFTowner).to.equal(await deployer.getAddress())
                              expect(await randomIPFSNFT.getTokenCounter()).to.equal(1) 
                              resolve()
                          } catch (error) {
                              reject(error)
                          }
                      })
                      const requestEvent = await randomIPFSNFT.queryFilter(
                          randomIPFSNFT.filters.NTFRequested,
                          mintReceipt?.blockNumber,
                          mintReceipt?.blockNumber,
                      )
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          requestEvent[0].args.requestId,
                          randomIPFSNFT.getAddress(),
                      )
                  })
              })
          })

          describe("Should let the owner withdraw", async function () {

            let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock

              beforeEach(async function () {
                  vrfCoordinatorV2Mock = (await ethers.getContract(
                      "VRFCoordinatorV2Mock",
                      deployer,
                  )) as VRFCoordinatorV2Mock
                  vrfCoordinatorV2Mock.addConsumer(await randomIPFSNFT.getSubscriptionId(), await randomIPFSNFT.getAddress())
                  const mintFee = await randomIPFSNFT.getMintFee()
                  const mintTransaction = await randomIPFSNFT.requestNFT({ value: mintFee })
                  const mintReceipt = await mintTransaction.wait(1)
                  const requestEvent = await randomIPFSNFT.queryFilter(
                      randomIPFSNFT.filters.NTFRequested,
                      mintReceipt?.blockNumber,
                      mintReceipt?.blockNumber,
                  )
                  await vrfCoordinatorV2Mock.fulfillRandomWords(
                      requestEvent[0].args.requestId,
                      randomIPFSNFT.getAddress(),
                  )
              })

                it("Should let the owner withdraw the contract balance", async function () {
                    const balanceBefore = await ethers.provider.getBalance(deployer.getAddress())
                    const withdrawTransaction = await randomIPFSNFT.withdraw()
                    const withdrawReceipt = await withdrawTransaction.wait(1)
                    const { fee } = withdrawReceipt!
                    const balanceAfter = await ethers.provider.getBalance(deployer.getAddress())
                    expect(balanceAfter).to.equal(balanceBefore + await randomIPFSNFT.getMintFee() - fee)
                })

                it("Should revert if withdrawer is not the owner", async function () {
                    const accounts = await ethers.getSigners()
                    const nonOwner = accounts[1]
                    randomIPFSNFT.connect(nonOwner)
                    expect(await randomIPFSNFT.withdraw()).to.be.revertedWithCustomError({
                        interface: randomIPFSNFT.interface
                    }, "OwnableUnauthorizedAccount")
                })

          })

      })
