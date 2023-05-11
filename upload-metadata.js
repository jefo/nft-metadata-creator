const fs = require('fs');
const { Web3Storage } = require('web3.storage');
const path = require('path');
const 

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for web3.storage

const rootFolder = './NFT'; // root folder containing all metadata files

async function uploadMetadata(folder) {
  const web3storage = new Web3Storage({ token: apiKey });
  const links = {};
  const data = [];
  
  async function uploadFiles(folder) {
    const files = fs.readdirSync(folder);
    for (const file of files) {
      const filePath = path.join(folder, file);
      const fileStat = fs.statSync(filePath);
      if (fileStat.isDirectory()) {
        await uploadFiles(filePath);
      } else if (path.extname(filePath) === '.json' && filePath.includes('template')) {
        // const fileData = fs.readFileSync(filePath);
        data.push(filePath);
        links[filePath] = null;
      }
    }
  }

  await uploadFiles(folder);
  const cid = await web3storage.put(data);
  const link = `https://dweb.link/ipfs/${cid}`;
  console.log(`Uploaded metadata to ${link}`);
  
  for (const file in links) {
    if (links.hasOwnProperty(file)) {
      links[file] = link;
    }
  }
  
  fs.writeFileSync('links.json', JSON.stringify(links, null, 2));
  return link;
}

uploadMetadata(rootFolder);
