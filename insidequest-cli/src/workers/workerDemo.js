import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runWorker = () => {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, 'heavyTask.worker.js');
    const worker = new Worker(workerPath);

    // Отправляем число для тяжелой задачи
    worker.postMessage(500000000);

    worker.on('message', (message) => {
      resolve(message);
    });

    worker.on('error', reject);
    
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};

// Демонстрация того, что основной поток не блокируется
const main = async () => {
  console.log('1. Главный поток: Запускаем тяжелую задачу в Worker Thread...');
  
  const workerPromise = runWorker();

  // Пока воркер считает в фоне, главный поток продолжает жить и отвечать
  const interval = setInterval(() => {
    console.log('2. Главный поток свободен: обрабатывает другие действия (не завис!)');
  }, 400);

  // Ждем завершения работы фонового потока
  const result = await workerPromise;
  clearInterval(interval);

  console.log('3. Главный поток получил результат от Worker:', result);
};

main();