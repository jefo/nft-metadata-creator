import client from "../nft-storage.mjs";
import { lsIpfsDir, writeJsonContent } from "../utils.mjs";
import retry from 'async-retry';

export async function putFolder(files) {
    const cid = await client.storeDirectory(files);
    const links = await lsIpfsDir(cid);
    return links;
}

async function uploadDir(dir) {
    const files = readFilesInDirectory(dir);

    // Splitting files into 10 groups
    const chunkedFiles = _.chunk(files, Math.ceil(files.length / 10));

    // Array to store successful and failed uploads
    let successfulUploads = [];
    let failedUploads = [];

    for (const [index, filesGroup] of chunkedFiles.entries()) {
        // Making 5 attempts to upload each group of files
        try {
            await retry(async () => {
                const links = putFolder(filesGroup);
                // Adding successful upload to array
                successfulUploads.push(...links);
            }, {
                retries: 5
            });
        } catch  (error) {
            console.log(`Failed to upload group ${index + 1}:`, error);
            // Adding failed upload to array
            failedUploads.push({ group: index + 1, error });
        }
    }
    return { successfulUploads, failedUploads };
}
