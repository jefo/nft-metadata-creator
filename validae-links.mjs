import fs from 'fs';

async function validateLinks(hash) {
    const str = fs.readFileSync(`./${hash}.json`, { encoding: 'utf-8' });
    const data = JSON.parse(str);
    console.log('data.length', data.length);
    const t = data.map(item => {
        const num = parseInt(item.name, 10);
        return num;
    });
    t.sort((a, b) => a - b);
    console.log(t);
}

(async () => {
    validateLinks('bafybeifrh6vqhcm3qbdqm45uwpnutcced7iozi2b2trv3rcsn3wbnfk5ky')
})();
