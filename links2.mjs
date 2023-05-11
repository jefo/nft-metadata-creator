import {create} from 'ipfs-http-client';


async function getFileUrlFromIpfsGateway(hash, gatewayUrl) {
  const ipfs = create({ url: gatewayUrl });
  const file = await ipfs.get(hash);
  const fileUrl = gatewayUrl + '/ipfs/' + hash;
  return fileUrl;
}

const hash = 'bafybeigvu4ju5agjqiouuaiaf4pr56eduhwi2md4rg62bsdc26t4dgooqi/13/247.png';
const gatewayUrl = 'https://ipfs.io';

getFileUrlFromIpfsGateway(hash, gatewayUrl)
  .then(url => console.log(url))
  .catch(error => console.error(error));
  