import fs from 'fs';
import path from 'path';

const rootFolder = './data/NFT'; // root folder containing all subfolders with images

let count = 1; // starting count

// recursive function to iterate through all subfolders
let res = [];
function renameFiles(folder) {
  const files = fs.readdirSync(folder).sort((a, b) => parseInt(a) - parseInt(b)); // get list of files in current folder
  for (const file of files) {
    const filePath = path.join(folder, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      renameFiles(filePath); // if subfolder, recurse into it
    } else {
      const ext = path.extname(file);
      if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.gif') {
        continue;
      }
      const newName = `${count}${ext}`; // generate new name
      const newFilePath = path.join('data/upload', newName);
      fs.renameSync(filePath, newFilePath); // rename file
      // fs.copyFileSync(path.join(__dirname, newFilePath), path.join(__dirname, 'NFT2'));
      count++; // increment count
      res.push(count);
    }
  }
  console.log('res', res.length);
}

renameFiles(rootFolder); // start renaming at root folder
