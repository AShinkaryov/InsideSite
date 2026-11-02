import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Пути к файлам данных
const QUESTS_FILE = path.join(__dirname, 'src/props/quests.json');
const BOOKINGS_FILE = path.join(__dirname, 'data/bookings.json');

const readJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 1. GET: Получить список квестов
app.get('/api/quests', (req, res) => {
  const quests = readJson(QUESTS_FILE);
  res.json(quests);
});

// 2. GET: Получить текущие бронирования
app.get('/api/bookings', (req, res) => {
  const bookings = readJson(BOOKINGS_FILE);
  res.json(bookings);
});

// 3. POST: Создать бронирование (с обработкой ошибок)
app.post('/api/bookings', (req, res) => {
  const { questId, userName, date } = req.body;

  if (!questId || !userName || !date) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения!' });
  }

  const selectedDate = new Date(date);
  if (selectedDate < new Date()) {
    return res.status(400).json({ error: 'Нельзя бронировать на прошедшую дату!' });
  }

  const quests = readJson(QUESTS_FILE);
  const quest = quests.find(q => q.id === Number(questId));
  if (!quest) {
    return res.status(404).json({ error: 'Квест не найден.' });
  }

  const bookings = readJson(BOOKINGS_FILE);
  const isAlreadyBooked = bookings.some(b => b.questId === Number(questId) && b.date === date);
  if (isAlreadyBooked) {
    return res.status(400).json({ error: 'Это время для квеста уже забронировано!' });
  }

  const newBooking = {
    id: Date.now(),
    questId: Number(questId),
    questTitle: quest.title,
    userName,
    date
  };

  bookings.push(newBooking);
  writeJson(BOOKINGS_FILE, bookings);

  res.json({ message: 'Бронирование успешно создано!', bookings });
});

// 4. DELETE: Отменить бронирование
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = Number(req.params.id);
  let bookings = readJson(BOOKINGS_FILE);
  
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    return res.status(404).json({ error: 'Бронирование не найдено.' });
  }

  bookings.splice(index, 1);
  writeJson(BOOKINGS_FILE, bookings);

  res.json({ message: 'Бронирование отменено.', bookings });
});

// 5. GET: Экспорт данных с поддержкой заголовка Accept (JSON / XML / HTML)
app.get('/api/export', (req, res) => {
  const bookings = readJson(BOOKINGS_FILE);
  const acceptHeader = req.headers['accept'] || 'application/json';

  if (acceptHeader.includes('application/xml') || acceptHeader.includes('text/xml')) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<bookings>\n';
    bookings.forEach(b => {
      xml += `  <booking>\n    <id>${b.id}</id>\n    <quest>${b.questTitle}</quest>\n    <user>${b.userName}</user>\n    <date>${b.date}</date>\n  </booking>\n`;
    });
    xml += '</bookings>';
    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  }

  if (acceptHeader.includes('text/html')) {
    let html = '<html><head><title>Bookings Report</title></head><body><h1>Отчет по бронированиям</h1><ul>';
    bookings.forEach(b => {
      html += `<li><b>${b.questTitle}</b> — ${b.userName} (${b.date})</li>`;
    });
    html += '</ul></body></html>';
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на http://localhost:${PORT}`);
});

// Путь к файлу пользователей
const USERS_FILE = path.join(__dirname, 'data/users.json');

// 6. POST: Регистрация нового пользователя
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения!' });
  }

  const users = readJson(USERS_FILE);
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует!' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password // В рамках учебного проекта храним в открытом виде
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);

  res.json({ 
    message: 'Регистрация успешна!', 
    user: { id: newUser.id, name: newUser.name, email: newUser.email } 
  });
});

// 7. POST: Вход пользователя (авторизация)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Введите email и пароль!' });
  }

  const users = readJson(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ error: 'Неверный email или пароль!' });
  }

  res.json({ 
    message: 'Успешный вход!', 
    user: { id: user.id, name: user.name, email: user.email } 
  });
});