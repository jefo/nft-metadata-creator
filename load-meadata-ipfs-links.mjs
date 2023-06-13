import fs from 'fs';
import { create } from 'ipfs-http-client';
import delayarr from 'delay-for-array';

async function getLinksFromHash(hash) {
  const url = 'https://dweb.link/api/v0';
  const ipfs = create({ url });
  const links = [];
  try {
    const t = await ipfs.ls(hash);
    for await (const link of t) {
      links.push(link);
    }
  }
  catch (e) {
    // console.error(e);
  }
  finally {
    return links;
  }
  // console.log(links);
  return links;
}

const eggsDir = 'bafybeibkhuancwvnattd4tuws2ahs2a5vayu2mvihdoejtzp4f63ylxl2y'; 
const ducksDir = 'bafybeidlqe7zn6yevcid2oun6m7xorrwzbrbiwlrd7oun243hl5kuwzylq';
// const hash = 'bafybeigvu4ju5agjqiouuaiaf4pr56eduhwi2md4rg62bsdc26t4dgooqi/34';
async function run(hash) {
  const links = await getLinksFromHash(hash);
  const fileLinks = [];

  console.log('link', links.length);
  delayarr.each(links, { time: 2000 }, async (item) => {
    const hash = item.path;
    console.log(hash);
    if (item.type === 'dir') {
      const links = await getLinksFromHash(hash);
      fileLinks.push(...links);
    }
  }, () => {
    console.log(hash, fileLinks.length);
    const linksJson = JSON.stringify(fileLinks, null, 2);
    fs.writeFileSync(`${hash}.json`, linksJson);
  });
}

(async () => {
  run(eggsDir);
  run(ducksDir);
})();

