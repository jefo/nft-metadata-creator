import fs from 'fs';
import { Web3Storage } from "web3.storage";
import path from 'path';
import {getLinksFromHash, readDirectory} from "./utils.mjs";

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for web3.storage

async function uploadMetadata(folder) {
  const web3storage = new Web3Storage({ token: apiKey });
  const data = [];

  const files = await readDirectory(folder);

  const cid = await web3storage.put(files);
  const link = `https://ipfs.io/ipfs/${cid}`;
  console.log(`Uploaded metadata to ${link}`);

  const links = await getLinksFromHash(cid);

  fs.writeFileSync(path.join(folder, 'ipfs.json'), JSON.stringify(links, null, 2));
  return link;
}

(async () => {
  await uploadMetadata('./data/eggs/metadata');
})();
