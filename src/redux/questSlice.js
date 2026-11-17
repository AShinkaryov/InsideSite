import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронный экшен для загрузки квестов с бэкенда
export const fetchQuests = createAsyncThunk(
  'quests/fetchQuests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/quests');
      const rawQuests = response.data.quests || response.data || [];

      // Адаптируем поля из базы под формат карточки
      return rawQuests.map((q) => ({
        ...q,
        image: q.image || q.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        genre: q.genre || 'Приключения',
        rating: Number(q.rating) || 4.8,
        duration: q.duration || '60 мин',
        players: q.players || '2-4 чел',
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const questsSlice = createSlice({
  name: 'quests',
  initialState: {
    items: [],
    status: 'idle',
    searchTerm: '',
    selectedGenre: 'all',
    sortBy: 'none',
    error: null,
  },
  reducers: {
    addQuest: (state, action) => {
      const newQuest = {
        ...action.payload,
        id: Date.now(),
        rating: Number(action.payload.rating) || 5.0,
        price: Number(action.payload.price) || 100
      };
      state.items.push(newQuest);
    },
    updateQuest: (state, action) => {
      const index = state.items.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteQuest: (state, action) => {
      state.items = state.items.filter((q) => q.id !== action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  addQuest,
  updateQuest,
  deleteQuest,
  setSearchTerm,
  setSelectedGenre,
  setSortBy,
  setError
} = questsSlice.actions;

export default questsSlice.reducer;