import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { addQuest, updateQuest, deleteQuest } from '../store/questsSlice';
import QuestModal from '../components/QuestModal/QuestModal';

const AdminPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Безопасное получение массива квестов (защита от undefined)
  const quests = useSelector((state) => {
    if (Array.isArray(state.quests?.items)) return state.quests.items;
    if (Array.isArray(state.quests)) return state.quests;
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useS;tate(false)
  const [questToEdit, setQuestToEdit] = useState(null);

  const handleOpenAdd = () => {
    setQuestToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (quest) => {
    setQuestToEdit(quest);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (questToEdit) {
      if (typeof updateQuest === 'function') dispatch(updateQuest(formData));
    } else {
      if (typeof addQuest === 'function') dispatch(addQuest(formData));
    }
  };

  const handleDelete = (id) => {
    if (typeof deleteQuest === 'function') dispatch(deleteQuest(id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
          {t('admin_panel', 'Управление квестами (Админ)')}
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<AddIcon />} 
          onClick={handleOpenAdd}
        >
          {t('btn_add', 'Добавить квест')}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: '#1f1f1f' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>Название</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>Жанр</TableCell>
              <TableCell sx={{ color: '#aaa', fontWeight: 'bold' }}>Цена</TableCell>
              <TableCell align="right" sx={{ color: '#aaa', fontWeight: 'bold' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quests.length > 0 ? (
              quests.map((quest) => (
                <TableRow key={quest.id}>
                  <TableCell sx={{ color: '#fff' }}>{quest.id}</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{quest.title}</TableCell>
                  <TableCell sx={{ color: '#aaa' }}>{quest.genre}</TableCell>
                  <TableCell sx={{ color: '#e74c3c', fontWeight: 'bold' }}>{quest.price} BYN</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleOpenEdit(quest)} 
                      sx={{ color: '#4caf50', mr: 1 }}
                      title="Редактировать"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(quest.id)} 
                      sx={{ color: '#f44336' }}
                      title="Удалить"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#888', py: 3 }}>
                  Квесты не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Модальное окно */}
      {QuestModal && (
        <QuestModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          questToEdit={questToEdit}
        />
      )}
    </Container>
  );
};

export default AdminPage;