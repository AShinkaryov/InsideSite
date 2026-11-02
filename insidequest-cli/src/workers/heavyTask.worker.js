import { parentPort } from 'worker_threads';

// Имитация тяжелых вычислений (например, сложная аналитика по 5 миллионам итераций)
parentPort.on('message', (maxCount) => {
  console.log('[Worker] Получена задача на вычисления в отдельном потоке...');
  
  let sum = 0;
  for (let i = 0; i < maxCount; i++) {
    sum += i * Math.sin(i);
  }

  // Отправляем результат обратно в главный поток
  parentPort.postMessage({ result: sum, status: 'completed' });
});