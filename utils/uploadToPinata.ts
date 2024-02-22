import pinataSDK, { PinataPinOptions } from "@pinata/sdk"
import path from "path"
import fs from "fs"
import "dotenv/config"

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET

interface MetadataTemplate {
    name: string
    description: string
    image: string
    attributes: Attribute[]
}

interface Attribute {
    trait_type: string
    value: number
}

export async function storeImages(imagesFilePath: string) {
    const fullImagesPath: string = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []

    console.log("Uploading images to Pinata...")
    for (let fileIndex in files) {
        console.log(`Uploading image: ${files[fileIndex]}`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)
            const pinataMetadata = {
                name: files[fileIndex],
            }
            const response = await pinata.pinFileToIPFS(readableStreamForFile, { pinataMetadata })
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

export async function storeTokenURIMetadata(metadata: MetadataTemplate) {
    try {
        const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
}
