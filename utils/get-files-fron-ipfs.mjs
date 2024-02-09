import {create} from 'ipfs-http-client';

// Создаем экземпляр клиента IPFS
const ipfsClient = create();

// Хеш директории, которую вы хотите получить
const directoryHash = 'bafybeidn527i3xqdqdujyjo67l77nuoe4meiimhaxod6gd5fcprqihjndm';

// Функция для получения листинга директории
export async function getDirectoryListing(directoryHash) {
  try {
    // Получаем информацию о хеше
    const directory = await ipfsClient.object.get(directoryHash);

    // Извлекаем список объектов в директории
    const links = directory.links;

    // Преобразуем в формат JSON
    const jsonListing = links.map(link => {
      return {
        name: link.name,
        hash: link.hash,
        size: link.size
      };
    });

    // Выводим результат
    console.log(JSON.stringify(jsonListing, null, 2));

    return jsonListing;
  } catch (error) {
    console.error('Ошибка при получении листинга директории:', error);
  }
}
