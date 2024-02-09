import path from 'path';
import fs from 'fs';
function run(dir) {
    // Читаем файл ipfs.json
    fs.readFile(path.join(dir, 'ipfs.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла: ", err);
            return;
        }

        // Преобразуем JSON строку в объект
        const ipfsArray = JSON.parse(data);


        // Извлечение значений CID в новый массив
        const cidArray = ipfsArray.map(item => item.cid['/']);
        console.log(cidArray);
        // Записать результат в items.json
        fs.writeFile('items.json', JSON.stringify(cidArray, null, 2), 'utf8', (err) => {
            if (err) {
                console.error("Ошибка записи в файл: ", err);
                return;
            }
            console.log("Файл items.json успешно сохранен.");
        });
    });
}

(() => {
    run('./data/upload/metadata');
})();
