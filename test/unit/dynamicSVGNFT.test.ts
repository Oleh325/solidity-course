import { developmentChains } from "../../hepler-hardhat-config"
import { network, deployments, ethers } from "hardhat"
import { expect } from "chai"
import { DynamicSVGNFT, MockV3Aggregator } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { encodeBase64, toUtf8Bytes } from "ethers"
import fs from "fs"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("DynamicSVGNFT", function () {
          let dynamicSVGNFT: DynamicSVGNFT, deployer: HardhatEthersSigner

          beforeEach(async function () {
              deployer = (await ethers.getNamedSigners()).deployer
              await deployments.fixture(["all"])
              dynamicSVGNFT = (await ethers.getContract("DynamicSVGNFT", deployer)) as DynamicSVGNFT
          })

          describe("constructor", async function () {
              it("Should have the right name", async function () {
                  expect(await dynamicSVGNFT.name()).to.equal("Dynamic SVG NFT")
              })
              it("Should have the right symbol", async function () {
                  expect(await dynamicSVGNFT.symbol()).to.equal("DSNFT")
              })
              it("Should set the right SVGs", async function () {
                  const lowSVG = fs.readFileSync("./images/dynamicNFT/frown.svg", "utf8")
                  const highSVG = fs.readFileSync("./images/dynamicNFT/happy.svg", "utf8")
                  const lowSVGURI = `data:image/svg+xml;base64,${encodeBase64(toUtf8Bytes(lowSVG))}`
                  const highSVGURI = `data:image/svg+xml;base64,${encodeBase64(toUtf8Bytes(highSVG))}`
                  expect(await dynamicSVGNFT.getLowSVGURI()).to.equal(lowSVGURI)
                  expect(await dynamicSVGNFT.getHighSVGURI()).to.equal(highSVGURI)
              })
              it("Should set the right price feed", async function () {
                  const ethUSDAggregator = (await ethers.getContract(
                      "MockV3Aggregator",
                  )) as MockV3Aggregator
                  expect(await dynamicSVGNFT.getPriceFeedAddress()).to.equal(
                      await ethUSDAggregator.getAddress(),
                  )
              })
          })

          describe("utils", async function () {
              it("Should return the right content URI", async function () {
                  const contentURI = `data:image/svg+xml;base64,${encodeBase64(toUtf8Bytes("content"))}`
                  expect(await dynamicSVGNFT.SVGtoImageURI("content")).to.equal(contentURI)
              })
          })

          describe("tokenURI", async function () {
              it("Should revert if the token ID is not valid", async function () {
                  await expect(dynamicSVGNFT.tokenURI(0)).to.be.revertedWithCustomError(
                      { interface: dynamicSVGNFT.interface },
                      "DynamicSVGNFT__URIQueryForNonexistentTokenId",
                  )
              })
              it("Should return the right token URI", async function () {
                  const ethUSDAggregator = (await ethers.getContract(
                      "MockV3Aggregator",
                  )) as MockV3Aggregator
                  const price = await ethUSDAggregator.latestRoundData()
                  const name = await dynamicSVGNFT.name()
                  const lowSVGURI = "data:application/json;base64," + encodeBase64(toUtf8Bytes(`{"name":"${name}", "description":"An NFT that changes based on the Chainlink Feed", "attributes": [{"trait_type": "coolness", "value": "100"}], "image": "${await dynamicSVGNFT.getLowSVGURI()}"}`)) 
                  const highSVGURI = "data:application/json;base64," + encodeBase64(toUtf8Bytes(`{"name":"${name}", "description":"An NFT that changes based on the Chainlink Feed", "attributes": [{"trait_type": "coolness", "value": "100"}], "image": "${await dynamicSVGNFT.getHighSVGURI()}"}`)) 
                  await dynamicSVGNFT.mintNFT(ethers.parseEther((Number(ethers.formatEther(price[1])) + 100).toString()))
                  expect(await dynamicSVGNFT.tokenURI(0)).to.equal(lowSVGURI)
                  await dynamicSVGNFT.mintNFT(ethers.parseEther((Number(ethers.formatEther(price[1])) - 100).toString()))
                  expect(await dynamicSVGNFT.tokenURI(1)).to.equal(highSVGURI)
              })
          })

          describe("mintNFT", async function () {
              it("Should set highValue correctly", async function () {
                  const ethUSDAggregator = (await ethers.getContract(
                      "MockV3Aggregator",
                  )) as MockV3Aggregator
                  const price = await ethUSDAggregator.latestRoundData()
                  await dynamicSVGNFT.mintNFT(ethers.parseEther((Number(ethers.formatEther(price[1])) + 100).toString()))
                  expect(await dynamicSVGNFT.getHighValue(0)).to.equal(ethers.parseEther((Number(ethers.formatEther(price[1])) + 100).toString()))
              })
              it("Should mint an NFT, increase token counter and emit the right event", async function () {
                  const ethUSDAggregator = (await ethers.getContract(
                      "MockV3Aggregator",
                  )) as MockV3Aggregator
                  const price = await ethUSDAggregator.latestRoundData()
                  const transaction = await dynamicSVGNFT.mintNFT(ethers.parseEther((Number(ethers.formatEther(price[1])) + 100).toString()))
                  const receipt = await transaction.wait(1)
                  const mintEvent = await dynamicSVGNFT.queryFilter(
                      dynamicSVGNFT.filters.CreatedNFT,
                      receipt?.blockNumber,
                      receipt?.blockNumber,
                  )
                  const tokenCounter = mintEvent[0].args.tokenId
                  const highValue = mintEvent[0].args.highValue.toString()
                  expect(await dynamicSVGNFT.getTokenCounter()).to.equal(tokenCounter)
                  expect(await dynamicSVGNFT.getHighValue(Number(tokenCounter) - 1)).to.equal(highValue)
                })
          })

      })
