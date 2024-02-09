import { uploadDir } from './utils/upload.mjs';
import {writeJsonContent} from "./utils/utils.mjs";

async function uploadMetadata(folder) {
  const { successfulUploads: links } = await uploadDir(folder);
  writeJsonContent(folder, 'ipfs.json', links);
  return links;
}

(async () => {
  await uploadMetadata('./data/upload/metadata');
  // await uploadMetadata('./data/eggs/metadata');
})();
