import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(INDEX_FILE)) {
  fs.writeFileSync(INDEX_FILE, JSON.stringify([], null, 2));
}

const readIndex = () => {
  try {
    const data = fs.readFileSync(INDEX_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Ошибка чтения индексного файла: некорректный JSON.');
  }
};

const writeIndex = (indexData) => {
  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));
};

export const createQuest = (id, title, author, isbn, year) => {
  const index = readIndex();
  
  if (index.some((item) => item.id === id)) {
    throw new Error(`Ошибка: Запись с ID "${id}" уже существует.`);
  }

  const fileName = `${id}.json`;
  const filePath = path.join(DATA_DIR, fileName);
  const questData = { id, title, author, isbn, year };

  fs.writeFileSync(filePath, JSON.stringify(questData, null, 2));
  index.push({ id, fileName });
  writeIndex(index);

  console.log(`Успешно создано: Квест "${title}" (ID: ${id})`);
};

export const readQuest = (id) => {
  const index = readIndex();
  const record = index.find((item) => item.id === id);

  if (!record) {
    throw new Error(`Ошибка: Запись с ID "${id}" не найдена в индексе.`);
  }

  const filePath = path.join(DATA_DIR, record.fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Ошибка: Файл данных ${record.fileName} не найден на диске.`);
  }

  const questData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log('Данные квеста:', questData);
  return questData;
};

export const listQuests = () => {
  const index = readIndex();
  if (index.length === 0) {
    console.log('Список квестов пуст.');
    return;
  }
  console.log('Список всех квестов:');
  index.forEach((item, indexNum) => {
    const filePath = path.join(DATA_DIR, item.fileName);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`${indexNum + 1}. [ID: ${data.id}] "${data.title}" — Автор: ${data.author} (${data.year})`);
    }
  });
};

export const deleteQuest = (id) => {
  let index = readIndex();
  const recordIndex = index.findIndex((item) => item.id === id);

  if (recordIndex === -1) {
    throw new Error(`Ошибка: Запись с ID "${id}" для удаления не найдена.`);
  }

  const record = index[recordIndex];
  const filePath = path.join(DATA_DIR, record.fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  index.splice(recordIndex, 1);
  writeIndex(index);

  console.log(`Запись с ID "${id}" успешно удалена.`);
};

export const backupData = (backupDirPath) => {
  const targetDir = path.resolve(backupDirPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = fs.readdirSync(DATA_DIR);
  files.forEach((file) => {
    const srcPath = path.join(DATA_DIR, file);
    const destPath = path.join(targetDir, file);
    if (fs.lstatSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  console.log(`Резервная копия успешно создана в каталоге: ${targetDir}`);
};