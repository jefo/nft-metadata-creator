import fs from 'fs';
import path from 'path';
import { create } from 'ipfs-http-client';

const rootFolder = './NFT'; // root folder containing all image files
const linksFile = './links.json'; // path to JSON file containing links

const metadata = []; // array to store metadata objects

let idx = 0;
const regex = /CID\((.*?)\)/;

async function createMetadata(folder) {
  const metadataDir = folder;
  const files = []
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
  }

  const imgLinksJson = fs.readFileSync('./links.json', { encoding: 'utf8', flag: 'r' });
  const images = JSON.parse(imgLinksJson);
  const links = images.map(i => ({ name: i.name, hash: i.cid['/'] }));
  let idx = 0;

  for (const link of links) {
    idx++;
    // const imageFileName = path.basename(link.name);
    // const metadataFileName = path.join(metadataDir, `${imageFileName}.json`);

    async function getFileUrlFromIpfsGateway(hash, gatewayUrl) {
      // const ipfs = create({ url: gatewayUrl });
      // const file = await ipfs.get(hash);
      const fileUrl = gatewayUrl + '/ipfs/' + hash;
      return fileUrl;
    }

    const gatewayUrl = 'https://ipfs.io';
    // TODO: set link to IPFS instead of gateway
    // https://docs.ton.org/develop/dapps/tutorials/collection-minting#upload-metadata

    let imageUrl = await getFileUrlFromIpfsGateway(link.hash, gatewayUrl);

    const metadata = {
      idx,
      name: `The Diamond Duck ${idx.toString().padStart(5, '0')}`,
      description: `Discover unique eggs that hold hidden GEM💎\nLimited to a series of 1000 NFTs, this NFT grants guarantees you a unique opportunity to receive our token through an exclusive airdrop.`,
      image: imageUrl
    };
    files.push(metadata);
    console.log(`Generated metadata for ${imageUrl}`);
  }
  files.forEach((f, i) => {
    // save metadata to JSON file
    const fpath = `./metadata`;
    if (!fs.existsSync(fpath)) {
      fs.mkdirSync(fpath);
    }
    const metadata = {
      name: f.name,
      description: f.description,
      image: f.image,
    };
    fs.writeFileSync(`${fpath}/${f.idx}.json`, JSON.stringify(metadata, null, 2));
  });
}

createMetadata(rootFolder); // start creating metadata at root folder
