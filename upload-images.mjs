import client from './nft-storage.mjs';
import {getFilesListFromIPFS, readFilesInDirectory, writeJsonContent, readJsonContent} from './utils/utils.mjs';
import { getDirectoryListing } from './utils/get-files-fron-ipfs.mjs';
import retry from 'async-retry';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const outputDir = './data/upload';
const successfulUploadsFile = path.join(outputDir, 'uploads.json');


async function uploadImages(dir) {
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
                const cid = await client.storeDirectory(filesGroup);
                console.log('cid', cid);
                const links = await lsIpfsDir(cid);
                // Adding successful upload to array
                successfulUploads.push({ group: index + 1, cid, links });
            }, {
                retries: 5
            });
        } catch  (error) {
            console.log(`Failed to upload group ${index + 1}:`, error);
            // Adding failed upload to array
            failedUploads.push({ group: index + 1, error });
        }
    }

    // Writing successful and failed uploads to JSON
    writeJsonContent(outputDir, 'successful_uploads_all', successfulUploads);
    writeJsonContent(outputDir, 'failed_uploads_all', failedUploads);
}
const fileExists = (path) => {
    try {
        fs.accessSync(path, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
};

async function checkSuccessfulUploads() {
    if (fileExists(successfulUploadsFile)) {
        const successfulUploads = await readJsonContent(successfulUploadsFile);

        if (successfulUploads && Array.isArray(successfulUploads)) {
            const allLinks = successfulUploads.flatMap(upload => upload.links);

            if (allLinks.length === 1000) {
                console.log('The successful uploads JSON file contains 1000 links.');
                await writeJsonContent(outputDir, 'successful_uploads_all', allLinks);
                console.log('Flattened array of links was written to:', successfulUploadsFile);
                return true;
            } else {
                console.log(`The successful uploads JSON file contains ${allLinks.length} links instead of 1000.`);
            }
        } else {
            console.log(`The successful uploads JSON file contains ${successfulUploads.length} groups instead of 10.`);
        }
    } else {
        console.log('The file does not exist:', successfulUploadsFile);
    }
    return false;
}


(async () => {
    if (fileExists(successfulUploadsFile)) {
        await checkSuccessfulUploads();
    } else {
        await uploadImages('./data/upload');
    }
})();