import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Ошибка входа');
      } else {
        alert(`Добро пожаловать, ${data.user.name}!`);
        // Сохраняем данные пользователя в localStorage, чтобы сайт знал, кто вошел
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); // Перенаправляем на главную
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      alert('Не удалось подключиться к серверу.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Вход в InsideQuest
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' } } }}
          />
          <TextField
            label="Пароль"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' } } }}
          />

          <Button type="submit" variant="contained" size="large" sx={{ backgroundColor: '#e74c3c', fontWeight: 'bold', '&:hover': { backgroundColor: '#d63031' } }}>
            Войти
          </Button>

          <Typography variant="body2" align="center" sx={{ color: '#aaa', mt: 1 }}>
            Нет аккаунта? <Link to="/register" style={{ color: '#e74c3c', textDecoration: 'none' }}>Зарегистрироваться</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;