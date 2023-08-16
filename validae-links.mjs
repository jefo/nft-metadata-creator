import fs from 'fs';

function findMissingNumbers(sequence) {
    const sortedSequence = sequence.sort((a, b) => a - b);
    const min = sortedSequence[0];
    const max = sortedSequence[sortedSequence.length - 1];
    const missingNumbers = [];

    for (let i = min; i <= max; i++) {
        if (!sortedSequence.includes(i)) {
            missingNumbers.push(i);
        }
    }

    return missingNumbers;
}


async function validateLinks(hash) {
    const str = fs.readFileSync(`./${hash}.json`, { encoding: 'utf-8' });
    const data = JSON.parse(str);
    console.log('data.length', data.length);
    const t = data.map(item => {
        const num = parseInt(item.name, 10);
        return num;
    });
    t.sort((a, b) => a - b);
    // console.log(t);

    const missingNumbers = findMissingNumbers(t);

    if (missingNumbers.length === 0) {
        console.log('В числовом ряду нет пропусков.');
    } else {
        console.log('Пропущенные числа:', missingNumbers);
    }

}

(async () => {
    validateLinks('bafybeifrh6vqhcm3qbdqm45uwpnutcced7iozi2b2trv3rcsn3wbnfk5ky')
})();
