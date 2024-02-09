import fs from 'fs';
import path from 'path';
import {assignPricesToNFTs, getPartMetadata, readIpfsJson, writeJsonContent} from "./utils/utils.mjs";

async function createMetadata(dir) {
    // upload images dir to ipfs
    if (!fs.existsSync(path.join(dir, 'uploads.json'))) {
        // todo: load images to ipfs and create file
        console.log('uploads.json not found in ' + dir);
        return null;
    }
    const pricesJson = fs.readFileSync('./prices.json', {encoding: 'utf8', flag: 'r'});
    const pricesMap = JSON.parse(pricesJson);
    const priceByIndex = assignPricesToNFTs(pricesMap);
    const images = await readIpfsJson(path.join(dir, 'uploads.json'));
    const partMetadata = getPartMetadata(images);
    if (partMetadata.length < 1000) {
        throw new Error('Not all are loaded');
    }
    partMetadata.forEach(m => {
        const metadata = {
            // idx: m.idx,
            name: `The Diamond Duck ${m.idx.toString().padStart(4, '0')}`,
            description: `This NFT, limited to a series of 1000, offers a unique opportunity to receive our token through an exclusive AirDrop.`,
            image: `https://ipfs.io/ipfs/${m.cid}`,
            attributes: [
                {trait_type: 'value', value: priceByIndex[m.idx - 1]},
            ]
        };
        writeJsonContent(path.join(dir, 'metadata'), m.idx.toString(), metadata);
    });
}

(async () => {
    await createMetadata('./data/upload');
})();