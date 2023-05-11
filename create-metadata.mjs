import fs from 'fs';
import path from 'path';
import { create } from 'ipfs-http-client';

const rootFolder = './NFT'; // root folder containing all image files
const linksFile = './links.json'; // path to JSON file containing links

const metadata = []; // array to store metadata objects

let idx = 0;
const regex = /CID\((.*?)\)/;

async function createMetadata(folder) {
  const metadataDir = path.join(folder, 'metadata');
  const files = []
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
  }

  const imgLinksJson = fs.readFileSync('./links.json', { encoding: 'utf8', flag: 'r' });
  const images = JSON.parse(imgLinksJson);
  const links = images.map(i => ({ name: i.name, hash: i.cid['/'] }));
  let idx = 0;

  for (const link of links) {
    console.log(link);
    idx++;
    const imageFileName = path.basename(link.name);
    const metadataFileName = path.join(metadataDir, `${imageFileName}.json`);

    async function getFileUrlFromIpfsGateway(hash, gatewayUrl) {
      const ipfs = create({ url: gatewayUrl });
      const file = await ipfs.get(hash);
      const fileUrl = gatewayUrl + '/ipfs/' + hash;
      return fileUrl;
    }

    const gatewayUrl = 'https://ipfs.io';

    let imageUrl = await getFileUrlFromIpfsGateway(link.hash, gatewayUrl);

    const metadata = {
      name: `The Diamond Ducks ${idx.toString().padStart(5, '0')}`,
      description: `Introducing the Diamond Duck - a rare gem and a symbol of adventure and fortune. This plucky bird braved the treacherous diamond diggings to uncover a glittering treasure trove. With its gleaming feathers and fearless spirit, the Diamond Duck is a beacon of hope for crypto enthusiasts seeking their own path to riches. Let this NFT be your guide on your journey to success in the unpredictable world of crypto. Get it now and soar with the Diamond Duck to weather any storm!`,
      // description: `Quack, quack! Get ready to join a group of adventurous ducks on a thrilling journey through the diamond diggins. These plucky explorers are on a quest for fortune, digging deep into the earth to uncover the glittering gems that lie hidden beneath the surface.
      //   But this isn't your typical mining operation - it's a daring adventure full of excitement and danger. Just like the intrepid diamond diggers of old, these ducks aren't afraid to take risks and push the limits of what's possible. And with their NFT collection, you can be a part of their quest for riches.
      //   So come along for the ride and see what treasures await in the diamond diggins. With a little luck and a lot of determination, you could be the next diamond digger to strike it rich!`,
      image: imageUrl
    };

    files.push(metadata)

    console.log(`Generated metadata for ${imageUrl}`);
  }
  files.forEach((f, i) => {
    // save metadata to JSON file
    const metadataJson = JSON.stringify(f, null, 2);
    const fpath = `./metadata/${i}`;
    if (!fs.existsSync(fpath)) {
      fs.mkdirSync(fpath);
    }
    fs.writeFileSync(`${fpath}/metadata.json`, metadataJson);
  });
}

createMetadata(rootFolder); // start creating metadata at root folder
