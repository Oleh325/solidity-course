import { ethers } from "hardhat"
import { assert } from "chai"
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types"

describe("SimpleStorege", function () {
    let simpleStorage: SimpleStorage
    let simpleStorageFactory: SimpleStorage__factory
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")

        simpleStorage = await simpleStorageFactory.deploy()
        await simpleStorage.waitForDeployment()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentFavNumber = await simpleStorage.retrieve()
        const expectedFavNumber = "0"
        assert.equal(currentFavNumber.toString(), expectedFavNumber)
        // expect(currentFavNumber.toString()).to.equal(expectedFavNumber)
    })
    it("Should update when we call store", async function () {
        const expectedFavNumber = "7"
        const transactionResponse = await simpleStorage.store(expectedFavNumber)
        await transactionResponse.wait(1)

        const currentFavNumber = await simpleStorage.retrieve()

        assert.equal(currentFavNumber.toString(), expectedFavNumber)
    })
    it("Should add a person with their favourite number", async function () {
        const expectedFavNumber = "325"
        const personName = "Alex"
        const transactionResponse = await simpleStorage.addPerson(expectedFavNumber, personName)
        await transactionResponse.wait(1)

        const retreivedPeopleArray = await simpleStorage.getPeopleArray()
        const getFavNumberNyName = (name: string) => {
            for(let i = 0; i < retreivedPeopleArray.length; i++) {
                if (retreivedPeopleArray[i][1] === name) {
                    return retreivedPeopleArray[i][0]
                } 
            }
            return undefined
        }

        const favNumberByName = getFavNumberNyName(personName)

        assert.equal(BigInt(expectedFavNumber), favNumberByName)
    })
})
