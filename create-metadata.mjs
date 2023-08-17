import fs from 'fs';
import path from 'path';
import {assignPricesToNFTs, getPartMetadata, readIpfsJson, writeJsonContent} from "./utils.mjs";

async function createMetadata(dir) {
    // upload images dir to ipfs
    if (!fs.existsSync(path.join(dir, 'images.json'))) {
        // todo: load images to ipfs and create file
        console.log('images.json not found in ' + dir);
        return null;
    }
    const pricesJson = fs.readFileSync('./prices.json', {encoding: 'utf8', flag: 'r'});
    const pricesMap = JSON.parse(pricesJson);
    const priceByIndex = assignPricesToNFTs(pricesMap);
    const images = await readIpfsJson(path.join(dir, 'images.json'));
    const partMetadata = getPartMetadata(images);
    partMetadata.forEach(m => {
        // const img = images[m.idx - 1];
        // console.log(img)
        const metadata = {
            idx: m.idx,
            name: `The Diamond Duck ${m.idx.toString().padStart(4, '0')}`,
            description: `Discover unique eggs that hold hidden GEM💎\nLimited to a series of 1000 NFTs, this NFT grants guarantees you a unique opportunity to receive our token through an exclusive airdrop.`,
            // image: 'https://ipfs.io/ipfs/bafybeidk2hekrw3whjwdboytdf6grpnfvg3bo4yq4exdz77b362aa4tldy',
            images: `https://ipfs.io/ipfs/${m.cid}`,
            attributes: [
                {trait_type: 'price', value: priceByIndex[m.idx - 1]},
            ]
        };
        writeJsonContent(path.join(dir, 'metadata'), m.idx.toString(), metadata);
    });
}

(async () => {
    await createMetadata('./data/ducks');
})();