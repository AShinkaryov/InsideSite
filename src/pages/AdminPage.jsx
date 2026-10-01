import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AdminPage = ({ quests, onDeleteQuest, onAddQuest }) => {
  const [open, setOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    genre: 'Хоррор',
    price: '',
    duration: '60 мин',
    players: '2-4 чел',
    description: '',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newQuest.title || !newQuest.price) return;
    
    onAddQuest({
      ...newQuest,
      id: Date.now(),
      rating: 5.0,
      price: Number(newQuest.price)
    });

    setOpen(false);
    setNewQuest({ title: '', genre: 'Хоррор', price: '', duration: '60 мин', players: '2-4 чел', description: '', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Управление квестами (Админ)
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
        >
          Добавить квест
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#262626' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a1a1a' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Название</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Жанр</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Цена</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quests.map((q) => (
              <TableRow key={q.id}>
                <TableCell sx={{ color: '#ccc' }}>{q.id}</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{q.title}</TableCell>
                <TableCell sx={{ color: '#ccc' }}>{q.genre}</TableCell>
                <TableCell sx={{ color: '#e74c3c', fontWeight: 'bold' }}>{q.price} BYN</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => onDeleteQuest(q.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Модалка добавления */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ background: '#1a1a1a', color: '#fff' }}>Добавить новый квест</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent sx={{ background: '#262626', color: '#fff' }}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField 
                label="Название" 
                required 
                fullWidth 
                value={newQuest.title} 
                onChange={(e) => setNewQuest({...newQuest, title: e.target.value})}
                InputLabelProps={{ style: { color: '#aaa' } }}
                sx={{ input: { color: '#fff' } }}
              />
              <TextField 
                label="Цена (BYN)" 
                type="number" 
                required 
                fullWidth 
                value={newQuest.price} 
                onChange={(e) => setNewQuest({...newQuest, price: e.target.value})}
                InputLabelProps={{ style: { color: '#aaa' } }}
                sx={{ input: { color: '#fff' } }}
              />
              <TextField 
                label="Описание" 
                multiline 
                rows={3} 
                fullWidth 
                value={newQuest.description} 
                onChange={(e) => setNewQuest({...newQuest, description: e.target.value})}
                InputLabelProps={{ style: { color: '#aaa' } }}
                sx={{ textarea: { color: '#fff' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ background: '#1a1a1a' }}>
            <Button onClick={() => setOpen(false)} color="inherit">Отмена</Button>
            <Button type="submit" variant="contained" color="error">Создать</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminPage;