import {create} from 'ipfs';
import fs from 'fs';
import { File } from '@web-std/file';
import path from 'path';
import { create as createKubo } from 'kubo-rpc-client';
import makeIpfsFetch from 'js-ipfs-fetch';

const client = createKubo();

export async function lsIpfsDir(cid) {
    const files = [];
    for await (const file of client.ls(cid)) {
        files.push(file);
    }
    return files;
}
export function assignPricesToNFTs(pricesHashTable) {
    const assignedNFTs = [];
    for (const price in pricesHashTable) {
        const count = pricesHashTable[price];
        for (let i = 0; i < count; i++) {
            assignedNFTs.push(parseInt(price));
        }
    }
    return assignedNFTs;
}

// export async function getLinksFromHash(hash) {
//     const ipfs = await IPFS.create();
//     const links = [];
//     try {
//         const t = ipfs.ls(hash);
//         for await (const link of t) {
//             links.push(link);
//         }
//     } catch (e) {
//         console.log('error');
//         console.error(e);
//     }
//     return links;
// }



const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for nft.storage

export async function getFilesListFromIPFS(cid) {
    const ipfs = await create();
    const fetch = makeIpfsFetch({ipfs});
    const response = await fetch(`ipfs://${cid}/`, {headers: {Accept: 'application/json'}})
    const data = await response.json();

    return data;
}

export function readFilesInDirectory(directoryPath) {
    try {
        const fileNames = fs.readdirSync(directoryPath);
        const filesArray = fileNames.map(fileName => {
          const filePath = path.join(directoryPath, fileName);
          const fileData = fs.readFileSync(filePath);
            return new File([fileData], fileName, { type: 'application/octet-stream' });
        });
    
        return filesArray;
      } catch (error) {
        console.error('Ошибка при чтении файлов:', error.message);
        return [];
      }
}

export function getPartMetadata(links) {
    const items = links.map(l => ({
        idx: parseInt(l.name, 10),
        cid: JSON.parse(JSON.stringify(l)).cid['/'], // o_O ??? xDDDD
        name: l.name,
    }))
    items.sort((a, b) => a.idx - b.idx);
    return items;
}

export async function readJsonContent(filePath) {
    const json = fs.readFileSync(filePath, {encoding: "utf8"});
    return JSON.parse(json);
}

export const readIpfsJson = async (filePath) => {
    const files = await readJsonContent(filePath);
    files.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    return files;
};

export function writeJsonContent(dir, fileName, content) {
    fs.writeFileSync(path.join(dir, `${fileName}.json`), JSON.stringify(content, null, 2));
}

export async function getCarFileCids() {
    return [
        'bafybeigdvbhwv4tsrewwrm7jg2tuveyfde6q4jyjn23pilraqd4vfdmgku',
        'bafybeide3naak76yindvscfeuaqdz6jdta7jnxeo4uebt6j5fzqt7i2owm',
        'bafybeido6td2e2mz5nxajisizueytqhrqfc7kmuomkvsqu7kq3hxkpn2me',
        'bafybeicmp4c5suzhgud5yy5v3qillfpa3syxjfv3lthg53zsjt6m3637jq',
        'bafybeigg6cnry5sz5rk7taeqvug4tn75r3bs7qszpbkeahlcuwvmfcik2u',
        'bafybeidrd4lt4pojzannrc5qc7gletdj7gb5aw25pncbtpfitg4o6gjbsu',
        'bafybeia3rjpor7ixzfjg3reo635y5e6r4iu6qvnqtcetmdvhdn2pnnvuge',
        'bafybeiboschyw4bjuj47olbxxla657f4uas72uxfbbvsffe5vckwtwuopq',
        'bafybeidfvpopu3fygw2moyvyza5nwmjkiwizktfkosvxxu4ju33f4dso3m',
        'bafybeibipdpqckjzv6zmgxvs6ucflopzd7tfoobzqhqzf4zjtkugt5adfa'
    ]
}

export async function flatLinks(rootCids, outDir) {
    const allCids = [];
    for (let file of rootCids) {
        const cids = await lsIpfsDir(file);
        allCids.push(...cids);
        console.log('cid', file)
    }
    writeJsonContent(outDir, 'items', allCids);
    const items = await readJsonContent(`${outDir}/items.json`);
    const cidArray = items.map(item => item.cid['/']);
    writeJsonContent(outDir, 'cids', cidArray);
}

