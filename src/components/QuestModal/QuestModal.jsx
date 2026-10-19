import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const genres = ['Хоррор', 'Детектив', 'Приключения', 'Фантастика'];

const QuestModal = ({ open, onClose, onSave, questToEdit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Хоррор',
    price: '',
    duration: '60 мин',
    players: '2-4 чел',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (questToEdit) {
      setFormData(questToEdit);
    } else {
      setFormData({
        title: '',
        genre: 'Хоррор',
        price: '',
        duration: '60 мин',
        players: '2-4 чел',
        description: '',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
      });
    }
    setError('');
  }, [questToEdit, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Простейшая валидация
    if (!formData.title.trim()) {
      setError('Введите название квеста');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Укажите корректную цену (больше 0)');
      return;
    }
    if (!formData.description.trim()) {
      setError('Введите описание');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {questToEdit ? t('btn_edit') : t('btn_add')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Название"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            select
            label="Жанр"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            fullWidth
          >
            {genres.map((g) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Цена (BYN)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Длительность"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Количество игроков"
            name="players"
            value={formData.players}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Ссылка на изображение"
            name="image"
            value={formData.image}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{t('btn_cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="error">
          {t('btn_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestModal;