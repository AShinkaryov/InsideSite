import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // Состояние для вывода ошибок
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Сбрасываем прошлую ошибку

    // Простая клиентская проверка телефона
    const phoneRegex = /^\+?[0-9\s\-\(\)]{9,20}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg('Введите корректный номер телефона (например, +375 29 1234567)');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Ошибка регистрации');
      } else {
        alert('Регистрация прошла успешно! Войдите в свой аккаунт.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      setErrorMsg('Не удалось подключиться к серверу.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Регистрация
        </Typography>

        {/* Вывод ошибки, если она есть */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Имя"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: '#aaa' } }}
            sx={{ input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' } } }}
          />
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
            label="Номер телефона"
            required
            placeholder="+375 (29) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            Зарегистрироваться
          </Button>

          <Typography variant="body2" align="center" sx={{ color: '#aaa', mt: 1 }}>
            Уже есть аккаунт?{' '}
            <Link to="/login" style={{ color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' }}>
              Войти
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;