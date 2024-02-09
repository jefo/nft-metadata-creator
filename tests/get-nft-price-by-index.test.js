import {describe, it} from 'node:test';
import * as assert from "assert";
import {assignPricesToNFTs} from '../utils/utils.mjs';

describe('assignPricesToNFTs', () => {
    it('should correctly find NFT price by index', () => {
        const pricesTable = {
            "195": 160,
            "325": 250,
            "650": 300,
            "1300": 150,
            "3900": 100,
            "6500": 20,
            "13000": 10,
            "19500": 10
        };
        const assignedNFTs = assignPricesToNFTs(pricesTable);
        const findNFTPriceByIndex = (index) => {
            return assignedNFTs[index];
        };
        assert.strictEqual(findNFTPriceByIndex(0), 195);
        assert.strictEqual(findNFTPriceByIndex(159), 195);
        assert.strictEqual(findNFTPriceByIndex(160), 325);
        assert.strictEqual(findNFTPriceByIndex(409), 325);
        assert.strictEqual(findNFTPriceByIndex(410), 650);
        assert.strictEqual(findNFTPriceByIndex(669), 650);
        // Продолжите тесты для других индексов
    });
});

