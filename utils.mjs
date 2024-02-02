// import IPFS from 'ipfs';
import fs from 'fs';
import { File } from '@web-std/file';
import path from 'path';
import { create } from 'kubo-rpc-client'

const client = create();

export async function lsIpfsDir(cid) {
    for await (const file of client.ls(cid)) {
        console.log(file)
    }   

    return [];
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
    const ipfs = await IPFS.create({  });
    const fetch = await makeIpfsFetch({ipfs});
    const response = await fetch(`ipfs://${cid}/`, {headers: {Accept: 'application/json'}})
    const data = await response.json();
    return data;
  }

export async function readDirectory(directoryPath) {
    const directoryFiles = [];

    async function readFilesRecursively(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                await readFilesRecursively(filePath);
            } else if (fileStat.isFile()) {
                const relativePath = path.relative(directoryPath, filePath);
                const stream = fs.createReadStream(filePath); // Создание потока чтения файла
                directoryFiles.push({name: file, stream: () => stream});
            }
        }
    }

    await readFilesRecursively(directoryPath);

    return directoryFiles;
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
