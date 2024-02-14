import client from './nft-storage.mjs';
import {
    getFilesListFromIPFS,
    readFilesInDirectory,
    writeJsonContent,
    readJsonContent,
    lsIpfsDir, getCarFileCids
} from './utils/utils.mjs';
import retry from 'async-retry';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const outputDir = './data/upload';
const carFolder = './data/upload/car';
const successfulUploadsFie = path.join(outputDir, 'uploads.json');

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
    if (fileExists(successfulUploadsFie)) {
        const successfulUploads = await readJsonContent(successfulUploadsFie);

        if (successfulUploads && Array.isArray(successfulUploads)) {
            const allLinks = successfulUploads.flatMap(upload => upload.links);

            if (allLinks.length === 1000) {
                console.log('The successful uploads JSON file contains 1000 links.');
                await writeJsonContent(outputDir, 'successful_uploads_all', allLinks);
                console.log('Flattened array of links was written to:', successfulUploadsFie);
                return true;
            } else {
                console.log(`The successful uploads JSON file contains ${allLinks.length} links instead of 1000.`);
            }
        } else {
            console.log(`The successful uploads JSON file contains ${successfulUploads.length} groups instead of 10.`);
        }
    } else {
        console.log('The file does not exist:', successfulUploadsFie);
    }
    return false;
}

async function restoreUploads() {
    const rootCids = [
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
    ];
    const allCids = [];
    for (let file of rootCids) {
        const cids = await lsIpfsDir(file);
        allCids.push(...cids);
    }
    writeJsonContent(outputDir, 'uploads.json', allCids)
}

(async () => {
    if (fileExists(successfulUploadsFie)) {
        await checkSuccessfulUploads();
    }  else if (directoryExists(carFolder) && hasCarFiles(carFolder)) {
        await restoreUploads();
    }
    else {
        // await uploadImages('./data/upload');
    }
})();

function directoryExists(directoryPath) {
    try {
        return fs.statSync(directoryPath).isDirectory();
    } catch (err) {
        return false;
    }
}

function hasCarFiles(directoryPath) {
    const filesInDir = fs.readdirSync(directoryPath);
    return filesInDir.some(file => file.endsWith('.car'));
}
