import React, { useState, useEffect } from 'react';
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
  const [viewedBooking, setViewedBooking] = useState(null); 
  const [dayOffset, setDayOffset] = useState(0);
  const [bookingType, setBookingType] = useState('client'); 
  
  // Список бронирований, полученный с бэкенда
  const [serverBookings, setServerBookings] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
    players: '2',
  });

  // Загружаем брони с сервера при открытии модального окна
  const fetchBookingsFromBackend = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/bookings');
      const data = await res.json();
      setServerBookings(data);
    } catch (err) {
      console.error('Ошибка загрузки броней с сервера:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBookingsFromBackend();
    }
  }, [open]);

  if (!quest) return null;

  // Динамическое расписание с учетом данных с сервера
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
      
      // Формат даты для сопоставления (например, "2026-11-03")
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateKeyStr = `${year}-${month}-${day}`;

      const defaultSlots = [
        { time: '12:00', price: basePrice },
        { time: '13:30', price: basePrice },
        { time: '15:00', price: basePrice },
        { time: '16:30', price: basePrice + 10 },
        { time: '18:00', price: basePrice + 15 },
        { time: '19:30', price: basePrice + 20 },
        { time: '21:00', price: basePrice + 20 },
      ];

      const processedSlots = defaultSlots.map((slot) => {
        // Проверяем, есть ли этот слот в базе сервера для этого квеста и даты
        const foundBooking = serverBookings.find(
          b => b.questId === quest.id && b.date === `${dateKeyStr}T${slot.time}`
        );

        if (foundBooking) {
          return {
            ...slot,
            available: false,
            isTech: foundBooking.isTech || false,
            bookingInfo: {
              name: foundBooking.userName,
              phone: foundBooking.phone || 'Не указан',
              email: foundBooking.email || 'Не указан',
              players: foundBooking.players || 2,
              comment: foundBooking.comment || ''
            }
          };
        }

        // Проверка на прошедшее время
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotDate = new Date(dateObj);
        slotDate.setHours(hours, minutes, 0, 0);
        const diffHours = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        return {
          ...slot,
          available: diffHours >= 1,
          isTech: false
        };
      });

      schedule.push({
        id: `${dayOffset}-${i}`,
        dateKey: dateKeyStr,
        date: `${dayNum} ${monthStr}`,
        day: weekdayStr,
        slots: processedSlots
      });
    }
    return schedule;
  };

  const currentSchedule = generateSchedule();

  const handleSlotClick = (slot, row) => {
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

    setSelectedSlot({
      dateKey: row.dateKey, // "2026-11-03"
      date: row.date,
      day: row.day,
      time: slot.time,
      price: slot.price
    });
  };

  // Отправка бронирования на бэкенд (POST)
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    const dateTimeIso = `${selectedSlot.dateKey}T${selectedSlot.time}`;

    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId: quest.id,
          questTitle: quest.title,
          userName: bookingType === 'tech' ? 'Техническая служба' : formData.name,
          phone: formData.phone,
          email: formData.email,
          players: formData.players,
          comment: formData.comment,
          date: dateTimeIso,
          isTech: bookingType === 'tech'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Ошибка при бронировании');
      } else {
        alert(bookingType === 'tech' ? 'Слот успешно закрыт тех-бронью!' : 'Квест успешно забронирован!');
        setServerBookings(result.bookings); // Обновляем список броней с сервера
        handleCloseModal();
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      alert('Не удалось связаться с сервером. Убедитесь, что сервер запущен.');
    }
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setViewedBooking(null);
    setBookingType('client');
    setDayOffset(0);
    setFormData({ name: '', phone: '', email: '', comment: '', players: '2' });
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
          </Box>
        ) : !selectedSlot ? (
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
          <Box component="form" onSubmit={handleSubmitBooking} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedSlot(null)} sx={{ alignSelf: 'flex-start', color: '#e74c3c', p: 0 }}>
              Вернуться к выбору времени
            </Button>

            {isAdmin && (
              <Box sx={{ p: 2, backgroundColor: '#2a2a2a', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#aaa' }}>Тип бронирования:</Typography>
                <RadioGroup row value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                  <FormControlLabel value="client" control={<Radio sx={{ color: '#e74c3c' }} />} label="Обычная бронь (Клиент)" />
                  <FormControlLabel value="tech" control={<Radio sx={{ color: '#ff9800' }} />} label="Тех-бронь (Закрыть слот)" />
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
              <TextField fullWidth label="Причина закрытия / Примечание" name="comment" multiline rows={3} placeholder="Например: Ремонт реквизита" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} InputLabelProps={{ style: { color: '#aaa' } }} sx={{ textarea: { color: '#fff' } }} />
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