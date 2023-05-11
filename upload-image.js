const { Web3Storage, getFilesFromPath } = require('web3.storage');

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for nft.storage

const rootFolder = './NFT'; // root folder containing all image files

async function run() {
  const web3storage = new Web3Storage({ token: apiKey });
  const files = await getFilesFromPath(rootFolder);
  await web3storage.put(files);
}

run();
