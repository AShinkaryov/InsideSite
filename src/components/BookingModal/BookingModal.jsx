import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

const BookingModal = ({ quest, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '14:00'
  });

  if (!quest) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(`Квест "${quest.title}" успешно забронирован на ${formData.date} в ${formData.time}!`);
    onClose();
  };

  return (
    <Dialog open={Boolean(quest)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', background: '#1a1a1a', color: '#fff', borderBottom: '1px solid #333' }}>
        Бронирование: {quest.title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ background: '#262626', color: '#fff', pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Ваше имя"
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputLabelProps={{ style: { color: '#aaa' } }}
              sx={{ input: { color: '#fff' } }}
            />
            <TextField
              label="Номер телефона"
              variant="outlined"
              fullWidth
              required
              placeholder="+375 (29) 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              InputLabelProps={{ style: { color: '#aaa' } }}
              sx={{ input: { color: '#fff' } }}
            />
            <TextField
              label="Дата"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              sx={{ input: { color: '#fff' } }}
            />
            <TextField
              select
              label="Время сеанса"
              fullWidth
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              InputLabelProps={{ style: { color: '#aaa' } }}
              sx={{ '.MuiSelect-select': { color: '#fff' } }}
            >
              {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="h6" align="right" sx={{ color: '#e74c3c', fontWeight: 'bold', mt: 1 }}>
              К оплате: {quest.price} BYN
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: '#1a1a1a', p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Отмена
          </Button>
          <Button type="submit" variant="contained" color="error">
            Затвердить бронь
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingModal;