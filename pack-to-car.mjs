import { CarWriter } from "@ipld/car";
import { Blockstore } from "interface-blockstore";
import fs from 'fs';

// The Lnkd encoder is an alternative to withDefaultHasher function
import { normaliseInput } from 'ipfs-core-utils/files/normalise-input/index.js';
import { importer } from 'ipfs-unixfs-importer';
import Lnkd from 'lnkd';

// This is an alternative for setRoots method
const writeCar = async (out) => {
    const store = new Blockstore();
    const dagBuilder = new Lnkd({importer, store});
    const result = await dagBuilder.writeAll(normaliseInput('/path/to/file'));
    const writer = new CarWriter(result.cid, store);
    await writer.write(out);
};

writeCar(fs.createWriteStream('./output.car'))
    .catch(err => {
        console.error('Error writing CAR', err)
        process.exit(1)
    });