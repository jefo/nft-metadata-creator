const fs = require('fs');
const path = require('path');

const rootFolder = './NFT'; // root folder containing all subfolders with images

let count = 1; // starting count

// recursive function to iterate through all subfolders
function renameFiles(folder) {
  const files = fs.readdirSync(folder).sort((a, b) => parseInt(a) - parseInt(b)); // get list of files in current folder
  for (const file of files) {
    const filePath = path.join(folder, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      renameFiles(filePath); // if subfolder, recurse into it
    } else {
      const ext = path.extname(file);
      if (ext !== '.png') {
        continue;
      }
      const newName = `${count}${ext}`; // generate new name
      const newFilePath = path.join(folder, newName);
      fs.renameSync(filePath, newFilePath); // rename file
      count++; // increment count
    }
  }
}

renameFiles(rootFolder); // start renaming at root folder
