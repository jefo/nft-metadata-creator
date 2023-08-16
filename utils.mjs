import {create} from "ipfs-http-client";
import fs from 'fs';
import path from 'path';

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


