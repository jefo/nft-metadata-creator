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

const eggsDir = 'bafybeiajoukagmuqxzv4frqwxbo6ojclz6tmeztbkdk4stxb6djtxnabm4';
const ducksDir = 'bafybeihqmd6abyu5jcdyjtlftfgsitvt7qiycexblifwzbnuqjhnhyg5q4';
// const hash = 'bafybeigvu4ju5agjqiouuaiaf4pr56eduhwi2md4rg62bsdc26t4dgooqi/34';
async function run(hash, subdir) {
  const links = await getLinksFromHash(hash);
  const fileLinks = [];

  console.log('link', links.length);
  delayarr.each(links, { time: 2000 }, async (item) => {
    const hash = item.path;
    console.log(hash);
    if (item.type === 'dir') {
      const links = await getLinksFromHash(hash);
      fileLinks.push(...links);
    } else {
      fileLinks.push({
        idx: parseInt(item.name, 10),
        cid: JSON.parse(JSON.stringify(item)).cid['/'] // o_O ??? xDDDD
      });
    }
  }, () => {
    console.log(hash, fileLinks.length);
    fileLinks.sort((a, b) => a.idx - b.idx);
    console.log(fileLinks);
    const linksJson = JSON.stringify(fileLinks.map(f => f.cid), null, 2);
    fs.writeFileSync(`./data/${subdir}/metadata/${hash}.json`, linksJson);
  });
}

(async () => {
  run(eggsDir, 'eggs');
  run(ducksDir, 'ducks');
})();

