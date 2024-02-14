import fs from 'fs';
import { create } from 'ipfs-http-client';
import delayarr from 'delay-for-array';
import path from 'path';

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
    console.error(e.response);
  }
  finally {
    return links;
  }
  // console.log(links);
  return links;
}

const ducksDir = 'bafybeifdasqfzqlyeugqp76pg3clggbrrn5f4oaseervqjjpmxcwc3cnby';
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
      fileLinks.push(item);
    }
  }, () => {
    console.log(hash, fileLinks.length);
    const linksJson = JSON.stringify(fileLinks, null, 2);
    const savePath = path.join('./data', subdir, `${hash}.json`);
    console.log('savedTo', savePath);
    fs.writeFileSync(savePath, linksJson);
  });
}

(async () => {
  run(ducksDir, 'images');
})();

