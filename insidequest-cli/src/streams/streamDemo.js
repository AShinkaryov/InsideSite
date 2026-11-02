import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Transform } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const largeFilePath = path.join(__dirname, '../../data/large_quests.json');

// 1. Функция генерации большого файла с колбэком по завершении
const generateLargeFile = (callback) => {
  console.log('⏳ Генерация большого файла данных...');
  
  const dataDir = path.dirname(largeFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const writeStream = fs.createWriteStream(largeFilePath);
  
  writeStream.write('[\n');
  for (let i = 1; i <= 50000; i++) {
    const item = JSON.stringify({ id: i, title: `Quest Room ${i}`, author: `Author ${i % 100}`, year: 2020 + (i % 6) });
    writeStream.write(i === 50000 ? item + '\n' : item + ',\n');
  }
  writeStream.write(']');
  
  // Ждем полного закрытия и записи файла на диск перед вызовом callback
  writeStream.end(() => {
    console.log('✅ Большой файл успешно создан: data/large_quests.json');
    if (callback) callback();
  });
};

// 2. Сравнение полного чтения и потокового чтения
const comparePerformance = () => {
  console.log('\n--- Сравнение производительности ---');

  // А) Полное чтение через readFileSync (загружает всё в оперативную память)
  const startMemorySync = process.memoryUsage().heapUsed;
  const startTimeSync = performance.now();

  const fileContent = fs.readFileSync(largeFilePath, 'utf8');
  const parsedData = JSON.parse(fileContent);

  const endTimeSync = performance.now();
  const endMemorySync = process.memoryUsage().heapUsed;

  console.log(`[readFileSync] Время: ${(endTimeSync - startTimeSync).toFixed(2)} мс`);
  console.log(`[readFileSync] Память: ${((endMemorySync - startMemorySync) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Записей прочитано: ${parsedData.length}`);

  console.log('\n----------------------------------------\n');

  // Б) Потоковое чтение через Readable Stream (обрабатывает частями - chunk'ами)
  const startMemoryStream = process.memoryUsage().heapUsed;
  const startTimeStream = performance.now();

  const readStream = fs.createReadStream(largeFilePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
  
  let charCount = 0;
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      charCount += chunk.length;
      callback(null, chunk);
    }
  });

  readStream
    .pipe(transformStream)
    .on('data', () => {
      // Чанки обрабатываются поочередно
    })
    .on('end', () => {
      const endTimeStream = performance.now();
      const endMemoryStream = process.memoryUsage().heapUsed;

      console.log(`[Stream] Время: ${(endTimeStream - startTimeStream).toFixed(2)} мс`);
      console.log(`[Stream] Память: ${((endMemoryStream - startMemoryStream) / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Всего обработано символов через поток: ${charCount}`);
    });
};

// Логика запуска: если файла нет — создаем и после этого запускаем тест. Если есть — сразу тестируем.
if (!fs.existsSync(largeFilePath)) {
  generateLargeFile(() => {
    comparePerformance();
  });
} else {
  comparePerformance();
}