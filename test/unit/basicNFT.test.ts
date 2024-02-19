import { developmentChains } from "../../hepler-hardhat-config"
import { network, deployments, ethers } from "hardhat"
import { expect } from "chai"
import { BasicNFT } from "../../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT", function () {
        let basicNFT: BasicNFT, deployer: HardhatEthersSigner

          beforeEach(async function () {
              deployer = (await ethers.getNamedSigners()).deployer
              await deployments.fixture(["all"])
              basicNFT = (await ethers.getContract("BasicNFT", deployer)) as BasicNFT
          })

          it("Should deploy with the right name and symbol", async function () {
              expect(await basicNFT.name()).to.equal("Doggie")
              expect(await basicNFT.symbol()).to.equal("DOG")
          })

          it("Should have an initial token count of 0", async function () {
              expect(await basicNFT.getTokenCounter()).to.equal(0)
          })

          it("Should mint an NFT and update the counter", async function () {
              await basicNFT.mintNFT()
              expect(await basicNFT.getTokenCounter()).to.equal(1)
          })

          it("Should return the correct URI for the token", async function () {
              await basicNFT.mintNFT()
              const tokenURI = await basicNFT.tokenURI(1)
              expect(tokenURI).to.equal("ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json")
          })
    })
