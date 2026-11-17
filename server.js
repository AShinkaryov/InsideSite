import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes, Op } from 'sequelize';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Инициализация подключения к PostgreSQL через Sequelize
const sequelize = new Sequelize('escape_room_db', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// 2. Определение моделей БД с валидаторами
export const Quest = sequelize.define('Quest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    validate: { notEmpty: { msg: 'Название квеста не должно быть пустым' } } 
  },
  description: { type: DataTypes.TEXT, allowNull: false },
  difficulty: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1, max: 5 } 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    validate: { min: 0 } 
  },
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    validate: { isUrl: { msg: 'Ссылка на фото должна быть валидным URL' } } 
  }
});

export const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: { msg: 'Email уже занят' },
    validate: { isEmail: { msg: 'Некорректный формат email' } } 
  },
  phone: { type: DataTypes.STRING, allowNull: false }
});

export const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingDate: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'подтверждено' }
});

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: { msg: 'Email уже занят' },
    validate: { isEmail: { msg: 'Некорректный формат email' } } 
  },
  phone: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'client' } // 'client' или 'admin'
});

// Связи между таблицами
Client.hasMany(Booking, { onDelete: 'CASCADE' });
Booking.belongsTo(Client);

Quest.hasMany(Booking, { onDelete: 'CASCADE' });
Booking.belongsTo(Quest);


// ==================== РОУТЫ ДЛЯ КВЕСТОВ (QUESTS) ====================

app.get('/api/quests', async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = 'id', order = 'ASC', search = '', difficulty, minPrice } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) whereConditions.title = { [Op.iLike]: `%${search}%` };
    if (difficulty) whereConditions.difficulty = difficulty;
    if (minPrice) whereConditions.price = { [Op.gte]: parseFloat(minPrice) };

    const { count, rows } = await Quest.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      quests: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quests/:id', async (req, res) => {
  try {
    const quest = await Quest.findByPk(req.params.id);
    if (!quest) return res.status(404).json({ error: 'Квест не найден' });
    res.status(200).json(quest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quests', async (req, res) => {
  try {
    const newQuest = await Quest.create(req.body);
    res.status(201).json({ message: 'Квест успешно создан!', quest: newQuest });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.put('/api/quests/:id', async (req, res) => {
  try {
    const quest = await Quest.findByPk(req.params.id);
    if (!quest) return res.status(404).json({ error: 'Квест не найден' });
    await quest.update(req.body);
    res.status(200).json({ message: 'Квест обновлен!', quest });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.delete('/api/quests/:id', async (req, res) => {
  try {
    const quest = await Quest.findByPk(req.params.id);
    if (!quest) return res.status(404).json({ error: 'Квест не найден' });
    await quest.destroy();
    res.status(200).json({ message: 'Квест удален!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==================== РОУТЫ ДЛЯ КЛИЕНТОВ (CLIENTS) ====================

app.get('/api/clients', async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = 'id', order = 'ASC', search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Client.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      clients: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Клиент не найден' });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json({ message: 'Клиент создан!', client: newClient });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Клиент не найден' });
    await client.update(req.body);
    res.status(200).json({ message: 'Клиент обновлен!', client });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ error: 'Клиент не найден' });
    await client.destroy();
    res.status(200).json({ message: 'Клиент удален!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==================== РОУТЫ ДЛЯ БРОНИРОВАНИЙ (BOOKINGS) ====================

app.get('/api/bookings', async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = 'id', order = 'ASC', status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (status) whereConditions.status = status;

    const { count, rows } = await Booking.findAndCountAll({
      where: whereConditions,
      include: [Client, Quest],
      limit,
      offset,
      order: [[sortBy, order.toUpperCase()]]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      bookings: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: [Client, Quest] });
    if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    res.status(201).json({ message: 'Бронирование создано!', booking: newBooking });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
    await booking.update(req.body);
    res.status(200).json({ message: 'Бронирование обновлено!', booking });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Бронирование не найдено' });
    await booking.destroy();
    res.status(200).json({ message: 'Бронирование удалено!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==================== РОУТЫ АВТОРИЗАЦИИ И РЕГИСТРАЦИИ ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Первый зарегистрированный пользователь автоматически становится администратором
    const userCount = await User.count();
    const role = userCount === 0 ? 'admin' : 'client';

    const newUser = await User.create({ name, email, phone, password, role });
    
    res.status(201).json({ 
      message: 'Регистрация успешна!', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(400).json({ error: error.errors?.map(e => e.message) || error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    res.status(200).json({
      message: 'Успешный вход!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Запуск сервера и проверка подключения к БД
sequelize.authenticate()
  .then(async () => {
    console.log('📦 Успешное подключение к PostgreSQL через Sequelize.');
    
    // Синхронизируем модели с базой данных (автоматически создаст таблицу Users)
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к базе данных:', err);
  });