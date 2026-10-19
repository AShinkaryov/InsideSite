import { createSlice } from '@reduxjs/toolkit';

const initialQuests = [
  {
    id: 1,
    title: "Сокровища Пиратов",
    genre: "Приключения",
    rating: 4.7,
    duration: "60 мин",
    players: "2-4 чел",
    price: 100,
    description: "Найдите спрятанный клад черной бороды до того, как корабль затонет.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Обитель Зла",
    genre: "Хоррор",
    rating: 5.0,
    duration: "80 мин",
    players: "2-6 чел",
    price: 140,
    description: "Секретная лаборатория вышла из-под контроля. Выживите в зараженном бункере.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Шерлок Холмс: Игра теней",
    genre: "Детектив",
    rating: 4.8,
    duration: "70 мин",
    players: "2-5 чел",
    price: 120,
    description: "Раскройте таинственное преступление на Бейкер-стрит до прихода полиции.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Затерянный город Атлантида",
    genre: "Фантастика",
    rating: 4.6,
    duration: "60 мин",
    players: "2-5 чел",
    price: 110,
    description: "Исследуйте древний затонувший город и запустите его подводные генераторы.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  }
];

const questsSlice = createSlice({
  name: 'quests',
  initialState: {
    items: initialQuests,
    searchTerm: '',
    selectedGenre: 'Все',
    sortBy: 'default',
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