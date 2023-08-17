import {create} from "ipfs-http-client";
import fs from 'fs';
import path from 'path';
import {Web3Storage} from "web3.storage";

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

export async function getLinksFromHash(hash) {
    const url = 'https://dweb.link/api/v0';
    const ipfs = create({url});
    const links = [];
    try {
        const t = await ipfs.ls(hash);
        for await (const link of t) {
            links.push(link);
        }
    } catch (e) {
        // console.error(e);
    }
    return links;
}

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwREY0MEE3NkNDMkUyRmE1MWZhODQyN2RlYWEyODMwZDA5MTlhNUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM2OTAyMzQzNDEsIm5hbWUiOiJkaWFtb25kcyJ9.EsXYNG73a5xZM1H-wwtKCft7SOBcBTp96Ji17xQouH8'; // API key for nft.storage

export async function getFilesByCId(cid) {
    const client = new Web3Storage({token: apiKey});
    const res = await client.get(cid); // Promise<Web3Response | null>
    const files = await res.files(); // Promise<Web3File[]>
    return files;
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
