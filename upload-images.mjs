import client from './nft-storage.mjs';
import {lsIpfsDir} from './utils.mjs';

// const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for nft.storage
const outputDir = './data/ducks';

async function uploadImages(dir) { 
    // const files = await readFilesInDirectory(dir);
    // const cid = await client.storeDirectory(files.slice(0, 2));
    // console.log('cid', cid);
    const links = await lsIpfsDir('bafybeie7cnb2dvvzmubuxsilx45vnndnscb3mtnn3liku4un3mwlqghkne');
    console.log('links', links);
    
    for (const item of links) {
        console.log('item', item);
    }
    // writeJsonContent(outputDir, 'images', links);
}

(async () => {
    await uploadImages('./data/upload');
})(); 
