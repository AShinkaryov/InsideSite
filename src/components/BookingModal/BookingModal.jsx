import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const monthsNames = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const weekdaysNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const BookingModal = ({ open, onClose, quest, isAdmin = false }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewedBooking, setViewedBooking] = useState(null); // Данные забронировавшего для Админа
  const [dayOffset, setDayOffset] = useState(0);
  const [bookingType, setBookingType] = useState('client'); // 'client' (обычная) или 'tech' (тех-бронь)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
    players: '2',
  });

  const adminSchedules = useSelector((state) => state.schedules?.items || {});

  if (!quest) return null;

  // Динамическое расписание (в будущем загружается с сервера)
  const generateSchedule = () => {
    const schedule = [];
    const basePrice = Number(quest.price) || 90;
    const now = new Date();

    for (let i = 0; i < 5; i++) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + dayOffset + i);

      const dayNum = dateObj.getDate();
      const monthStr = monthsNames[dateObj.getMonth()];
      const weekdayStr = weekdaysNames[dateObj.getDay()];
      const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;

      // Пример структуры с данными бронирования
      const defaultSlots = [
        { 
          time: '12:00', price: basePrice, available: false, isTech: false,
          bookingInfo: { name: 'Иван Иванов', phone: '+375 (29) 111-22-33', email: 'ivan@mail.ru', players: 4, comment: 'День рождения' } 
        },
        { time: '13:30', price: basePrice, available: true },
        { 
          time: '15:00', price: basePrice, available: false, isTech: true,
          bookingInfo: { comment: 'Технический перерыв (уборка/ремонт)' } 
        },
        { time: '16:30', price: basePrice + 10, available: true },
        { time: '18:00', price: basePrice + 15, available: true },
        { time: '19:30', price: basePrice + 20, available: true },
        { time: '21:00', price: basePrice + 20, available: true },
      ];

      const questAdminSlots = adminSchedules[quest.id]?.[dateKey] || defaultSlots;

      const processedSlots = questAdminSlots.map((slot) => {
        if (!slot.available) return slot;

        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotDate = new Date(dateObj);
        slotDate.setHours(hours, minutes, 0, 0);

        const diffHours = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        return {
          ...slot,
          available: diffHours >= 1
        };
      });

      schedule.push({
        id: `${dayOffset}-${i}`,
        date: `${dayNum} ${monthStr}`,
        day: weekdayStr,
        slots: processedSlots
      });
    }
    return schedule;
  };

  const currentSchedule = generateSchedule();

  const handleSlotClick = (slot, row) => {
    // Если слот занят И кликает админ -> Показываем данные забронировавшего
    if (!slot.available) {
      if (isAdmin && slot.bookingInfo) {
        setViewedBooking({
          ...slot.bookingInfo,
          date: row.date,
          time: slot.time,
          isTech: slot.isTech
        });
      }
      return;
    }

    // Если слот свободен -> Переходим к заполнению
    setSelectedSlot({
      date: row.date,
      day: row.day,
      time: slot.time,
      price: slot.price
    });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    if (bookingType === 'tech') {
      alert(`Слот ${selectedSlot.date} в ${selectedSlot.time} успешно закрыт ТЕХ-БРОНЬЮ!`);
    } else {
      alert(`Квест "${quest.title}" забронирован!\nДата: ${selectedSlot.date}, Время: ${selectedSlot.time}\nКлиент: ${formData.name}`);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setViewedBooking(null);
    setBookingType('client');
    setDayOffset(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {viewedBooking 
            ? `Информация о брони (${viewedBooking.time})`
            : selectedSlot 
              ? `Бронирование: ${quest.title}` 
              : `Забронировать квест "${quest.title}"`}
        </Typography>
        <IconButton onClick={handleCloseModal} sx={{ color: '#aaa' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: '#333' }} />

      <DialogContent sx={{ py: 3 }}>
        {/* РЕЖИМ 1: ПРОСМОТР ДАННЫХ ЗАНЯТОГО СЛОТА (ДЛЯ АДМИНА) */}
        {viewedBooking ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setViewedBooking(null)} sx={{ alignSelf: 'flex-start', color: '#e74c3c' }}>
              Назад к расписанию
            </Button>
            
            <Paper sx={{ p: 3, backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: viewedBooking.isTech ? '#ff9800' : '#e74c3c', mb: 2, fontWeight: 'bold' }}>
                {viewedBooking.isTech ? '🛠 Техническая бронь (Слот закрыт)' : '👤 Клиентская бронь'}
              </Typography>
              
              {!viewedBooking.isTech ? (
                <>
                  <Typography><strong>Имя:</strong> {viewedBooking.name}</Typography>
                  <Typography><strong>Телефон:</strong> {viewedBooking.phone}</Typography>
                  <Typography><strong>Email:</strong> {viewedBooking.email}</Typography>
                  <Typography><strong>Игроков:</strong> {viewedBooking.players}</Typography>
                  <Typography><strong>Комментарий:</strong> {viewedBooking.comment || 'Нет'}</Typography>
                </>
              ) : (
                <Typography><strong>Причина закрытия:</strong> {viewedBooking.comment || 'Технические работы'}</Typography>
              )}
            </Paper>

            {isAdmin && (
              <Button variant="outlined" color="error" onClick={() => { alert('Бронь отменена'); setViewedBooking(null); }}>
                Снять бронь / Открыть слот
              </Button>
            )}
          </Box>
        ) : !selectedSlot ? (
          /* РЕЖИМ 2: СЕТКА ВРЕМЕНИ */
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mb: 3 }}>
              <Button 
                variant="text" 
                disabled={dayOffset <= 0} 
                onClick={() => setDayOffset(prev => Math.max(0, prev - 5))}
                sx={{ color: '#e74c3c', fontWeight: 'bold', '&.Mui-disabled': { color: '#444' } }}
              >
                ← раньше
              </Button>
              <Typography variant="body2" sx={{ color: '#888' }}>Выберите дату и время</Typography>
              <Button variant="text" onClick={() => setDayOffset(prev => prev + 5)} sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                позже →
              </Button>
            </Box>

            {currentSchedule.map((row) => (
              <Grid container key={row.id} sx={{ borderBottom: '1px solid #333', py: 2, alignItems: 'center' }}>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{row.date}</Typography>
                  <Typography variant="caption" sx={{ color: row.day === 'Суббота' || row.day === 'Воскресенье' ? '#e74c3c' : '#888' }}>
                    {row.day}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {row.slots.map((slot, index) => (
                      <Button
                        key={index}
                        onClick={() => handleSlotClick(slot, row)}
                        variant={slot.available ? "contained" : "outlined"}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: '75px',
                          p: 1,
                          textTransform: 'none',
                          backgroundColor: slot.available ? '#e74c3c' : (slot.isTech ? '#424242' : '#262626'),
                          color: slot.available ? '#fff' : '#888',
                          borderColor: '#444',
                          cursor: (!slot.available && !isAdmin) ? 'default' : 'pointer',
                          '&:hover': {
                            backgroundColor: slot.available ? '#d63031' : (isAdmin ? '#333' : '#262626'),
                          }
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', lineHeight: 1 }}>
                          {slot.time}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', mt: 0.5, color: slot.available ? '#ffeaa7' : '#aaa' }}>
                          {slot.available 
                            ? `от ${slot.price} BYN` 
                            : (slot.isTech ? 'Тех-бронь' : (isAdmin ? 'Инфо' : 'Занято'))}
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Box>
        ) : (
          /* РЕЖИМ 3: СОЗДАНИЕ БРОНИ (ОБЫЧНАЯ ИЛИ ТЕХНИЧЕСКАЯ) */
          <Box component="form" onSubmit={handleSubmitBooking} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedSlot(null)} sx={{ alignSelf: 'flex-start', color: '#e74c3c', p: 0 }}>
              Вернуться к выбору времени
            </Button>

            {/* Выбор типа брони для Администратора */}
            {isAdmin && (
              <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#aaa' }}>Тип бронирования:</Typography>
                <RadioGroup row value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                  <FormControlLabel value="client" control={<Radio sx={{ color: '#e74c3c', '&.Mui-focused': { color: '#e74c3c' } }} />} label="Обычная бронь (Клиент)" />
                  <FormControlLabel value="tech" control={<Radio sx={{ color: '#ff9800', '&.Mui-focused': { color: '#ff9800' } }} />} label="Тех-бронь (Закрыть слот)" />
                </RadioGroup>
              </Box>
            )}

            {bookingType === 'client' ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Ваше имя" name="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ input: { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Номер телефона" name="phone" required placeholder="+375 (XX) XXX-XX-XX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ input: { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ input: { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Количество человек" name="players" type="number" value={formData.players} onChange={(e) => setFormData({...formData, players: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ input: { color: '#fff' } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Комментарий" name="comment" multiline rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ textarea: { color: '#fff' } }} />
                </Grid>
              </Grid>
            ) : (
              <TextField fullWidth label="Причина закрытия / Примечание" name="comment" multiline rows={3} placeholder="Например: Ремонт реквизита или санитарный час" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ textarea: { color: '#fff' } }} />
            )}

            <Button type="submit" variant="contained" size="large" sx={{ mt: 2, backgroundColor: bookingType === 'tech' ? '#ff9800' : '#e74c3c', color: '#fff', fontWeight: 'bold' }}>
              {bookingType === 'tech' ? 'Установить тех-бронь' : 'Подтвердить бронирование'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;