import fs from 'fs';
import path from 'path';
import {create} from 'ipfs-http-client';
import {assignPricesToNFTs} from "./utils.mjs";

const rootFolder = './NFT'; // root folder containing all image files

async function createMetadata(folder) {
    const metadataDir = folder;
    const files = []
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir);
    }
    const imgLinksJson = fs.readFileSync('./data/ducks/images/bafybeifdasqfzqlyeugqp76pg3clggbrrn5f4oaseervqjjpmxcwc3cnby.json', {
        encoding: 'utf8',
        flag: 'r'
    });
    const images = JSON.parse(imgLinksJson);
    const links = images.map(i => ({idx: parseInt(i.name, 10), name: i.name, hash: i.cid['/']}));
    links.sort((a, b) => a.idx - b.idx);
    const pricesJson = fs.readFileSync('./prices.json', {encoding: 'utf8', flag: 'r'});
    const pricesMap = JSON.parse(pricesJson);
    const priceByIndex = assignPricesToNFTs(pricesMap);
    for (const link of links) {
        async function getFileUrlFromIpfsGateway(hash, gatewayUrl) {
            const fileUrl = gatewayUrl + '/ipfs/' + hash;
            return fileUrl;
        }

        const gatewayUrl = 'https://ipfs.io';
        // TODO: set link to IPFS instead of gateway
        // https://docs.ton.org/develop/dapps/tutorials/collection-minting#upload-metadata

        let imageUrl = await getFileUrlFromIpfsGateway(link.hash, gatewayUrl);

        const metadata = {
            idx: link.idx,
            name: `The Diamond Duck ${link.idx.toString().padStart(4, '0')}`,
            description: `Discover unique eggs that hold hidden GEM💎\nLimited to a series of 1000 NFTs, this NFT grants guarantees you a unique opportunity to receive our token through an exclusive airdrop.`,
            // image: imageUrl
            image: 'https://ipfs.io/ipfs/bafybeidk2hekrw3whjwdboytdf6grpnfvg3bo4yq4exdz77b362aa4tldy',
            attributes: [
                {trait_type: 'price', value: priceByIndex[link.idx - 1]},
            ]
        };
        files.push(metadata);
        console.log(`Generated metadata for ${imageUrl}`);
    }
    files.forEach((f, i) => {
        // save metadata to JSON file
        const fpath = `./data/eggs/metadata`;
        if (!fs.existsSync(fpath)) {
            fs.mkdirSync(fpath);
        }
        const metadata = {
            name: f.name,
            description: f.description,
            image: f.image,
            attributes: f.attributes,
        };
        fs.writeFileSync(`${fpath}/${f.idx}.json`, JSON.stringify(metadata, null, 2));
    });
}

(async () => {
    await createMetadata(rootFolder);
})();