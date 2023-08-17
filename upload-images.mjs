import {Web3Storage, getFilesFromPath} from 'web3.storage';
import {getFilesByCId, getLinksFromHash, writeJsonContent} from './utils.mjs';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for nft.storage
const outputDir = './data/ducks';

async function uploadImages(dir) {
    const web3storage = new Web3Storage({token: apiKey});
    const files = await getFilesFromPath(dir);
    console.log('files', files.length)
    const cid = await web3storage.put(files);
    const links = await getFilesByCId(cid);
    console.log('links', links.length);
    writeJsonContent(outputDir, 'images', links);
}

(async () => {
    await uploadImages('./NFT_test');
})();
